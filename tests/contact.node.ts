import { test } from "node:test";
import assert from "node:assert/strict";
import { onRequest } from "../functions/api/contact.ts";
const env = {
  RESEND_API_KEY: "test-key",
  CONTACT_FROM_EMAIL: "studio@verified.example",
};
const data = {
  name: "Jamie",
  email: "jamie@example.com",
  service: "Bots",
  message: "Build a community bot",
  website: "",
};
const make = (body: unknown = data, origin = "https://dev.zyrix.qzz.io") =>
  new Request("https://dev.zyrix.qzz.io/api/contact", {
    method: "POST",
    headers: { origin, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
test("rejects cross-origin, invalid input, honeypot and oversized body before sending", async () => {
  for (const [request, status] of [
    [make(data, "https://untrusted.example"), 403],
    [make({ ...data, email: "invalid" }), 400],
    [make({ ...data, website: "spam" }), 400],
    [make({ ...data, message: "x".repeat(13000) }), 413],
    [make(null), 400],
    [make({ ...data, service: "untrusted" }), 400],
  ] as const) {
    assert.equal((await onRequest({ request, env })).status, status);
  }
});
test("missing secret produces a truthful unavailable response", async () => {
  const r = await onRequest({ request: make(), env: {} });
  assert.equal(r.status, 503);
  assert.match((await r.json()).error, /email/);
});
test("only POST can send", async () => {
  assert.equal(
    (
      await onRequest({
        request: new Request("https://dev.zyrix.qzz.io/api/contact"),
        env,
      })
    ).status,
    405,
  );
});
test("provider acceptance, failure and timeouts are handled without exposing secrets", async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async (url, options) => {
      assert.equal(url, "https://api.resend.com/emails");
      const sent = JSON.parse(options!.body as string);
      assert.deepEqual(sent.to, ["imzyrixx@gmail.com"]);
      assert.equal(sent.reply_to, "jamie@example.com");
      assert.equal(sent.from, env.CONTACT_FROM_EMAIL);
      assert.match(sent.text, /community bot/);
      return new Response(JSON.stringify({ id: "test-message" }));
    };
    let r = await onRequest({ request: make(), env });
    assert.equal(r.status, 200);
    assert.deepEqual(await r.json(), { ok: true });
    globalThis.fetch = async () =>
      new Response("sensitive provider error", { status: 401 });
    r = await onRequest({ request: make(), env });
    assert.equal(r.status, 502);
    assert.doesNotMatch(await r.text(), /sensitive|test-key/);
    globalThis.fetch = async () => {
      throw new Error("network timeout");
    };
    assert.equal((await onRequest({ request: make(), env })).status, 502);
  } finally {
    globalThis.fetch = original;
  }
});

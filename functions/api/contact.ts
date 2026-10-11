interface Env {
  RESEND_API_KEY?: string;
  CONTACT_FROM_EMAIL?: string;
}
type Context = { request: Request; env: Env };
const headers = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};
const reply = (status: number, body: object) =>
  new Response(JSON.stringify(body), { status, headers });
const services = [
  "Websites",
  "Bots",
  "Automations",
  "Tools",
  "Software",
  "Something else entirely",
];

/** Cloudflare Pages Function: secrets stay on the server, recipient is fixed. */
async function onRequestPost({ request, env }: Context): Promise<Response> {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return reply(403, { error: "Please send your message from this website." });
  if (!request.headers.get("content-type")?.includes("application/json"))
    return reply(415, { error: "Please submit the contact form." });
  if (Number(request.headers.get("content-length")) > 12000)
    return reply(413, { error: "Your message is too long." });
  let data: Record<string, unknown>;
  try {
    // Limit streamed bytes too: Content-Length may be absent or forged.
    const reader = request.body?.getReader();
    if (!reader) return reply(400, { error: "Please complete the form." });
    let bytes = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 12000) {
        await reader.cancel();
        return reply(413, { error: "Your message is too long." });
      }
      chunks.push(value);
    }
    const body = new Uint8Array(bytes);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.length;
    }
    data = JSON.parse(new TextDecoder().decode(body));
    if (!data || typeof data !== "object" || Array.isArray(data))
      throw new Error("invalid");
  } catch {
    return reply(400, { error: "Please complete the form and try again." });
  }
  if (data.website)
    return reply(400, { error: "Unable to accept this submission." });
  const field = (key: string) =>
    typeof data[key] === "string" ? data[key].trim() : "";
  const name = field("name"),
    email = field("email"),
    service = field("service"),
    message = field("message");
  if (
    !name ||
    name.length > 100 ||
    /[\r\n]/.test(name) ||
    email.length > 200 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !services.includes(service) ||
    !message ||
    message.length > 1500
  )
    return reply(400, {
      error:
        "Please enter your name, a valid email, and a message of up to 1,500 characters.",
    });
  if (!env.RESEND_API_KEY || !env.CONTACT_FROM_EMAIL)
    return reply(503, {
      error:
        "Online sending is being connected. Please email imzyrixx@gmail.com directly.",
    });
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      signal: AbortSignal.timeout(10000),
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: ["imzyrixx@gmail.com"],
        reply_to: email,
        subject: `zyrixdev / ${service} / ${name}`,
        text: `New project enquiry\n\nName: ${name}\nEmail: ${email}\nService: ${service}\n\n${message}`,
      }),
    });
    if (!response.ok)
      return reply(502, {
        error:
          "Your message could not be delivered. Please retry or email imzyrixx@gmail.com.",
      });
    const result = (await response.json()) as { id?: string };
    if (!result.id)
      return reply(502, {
        error:
          "Delivery could not be confirmed. Please email imzyrixx@gmail.com.",
      });
    return reply(200, { ok: true });
  } catch {
    return reply(502, {
      error:
        "The email service is temporarily unavailable. Please try again or email us directly.",
    });
  }
}
export const onRequest = (context: Context) =>
  context.request.method === "POST"
    ? onRequestPost(context)
    : new Response("Method not allowed", {
        status: 405,
        headers: { Allow: "POST", "Cache-Control": "no-store" },
      });

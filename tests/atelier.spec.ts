import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("cinematic opening lasts five seconds and supports skipping", async ({
  page,
}) => {
  await page.addInitScript(() => {
    let started = 0,
      ended = false;
    new MutationObserver(() => {
      const intro = document.querySelector(".cinematic-intro");
      if (intro && !started) started = performance.now();
      if (!intro && started && !ended) {
        ended = true;
        document.documentElement.dataset.introDuration = String(
          performance.now() - started,
        );
      }
    }).observe(document, { childList: true, subtree: true });
  });
  await page.goto("/");
  await expect(page.locator(".cinematic-intro")).toBeHidden({ timeout: 7000 });
  const duration = await page.evaluate(() =>
    Number(document.documentElement.dataset.introDuration),
  );
  expect(duration).toBeGreaterThan(4800);
  expect(duration).toBeLessThan(6500);
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe(
    "hidden",
  );
  await page.evaluate(() => sessionStorage.removeItem("zyrixdev-intro"));
  await page.reload();
  await page.getByRole("button", { name: "SKIP INTRO" }).click();
  await expect(page.locator(".cinematic-intro")).toBeHidden();
});
test("original WebGL engine morphs, rotates with keys, and stops rendering when paused", async ({
  page,
}) => {
  await page.addInitScript(() => sessionStorage.setItem("zyrixdev-intro", "cinematic-v2"));
  await page.goto("/");
  const engine = page.locator(".sculpture");
  await engine.scrollIntoViewIfNeeded();
  await expect(engine).toHaveAttribute("data-ready", "true");
  await page
    .locator(".engine-modes")
    .getByRole("button", { name: "03 Orbit" })
    .click();
  await expect(engine).toHaveAttribute("data-form", "orbit");
  await engine.focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("status", { name: "Engine energy and angle" }),
  ).not.toHaveText("035 / 000°");
  await page.getByLabel("ENERGY", { exact: true }).focus();
  await page.keyboard.press("End");
  await expect(
    page.getByRole("status", { name: "Engine energy and angle" }),
  ).toContainText("100");
  await page.getByRole("button", { name: "Pause sculpture" }).click();
  await expect(engine).toHaveAttribute("data-render-state", "idle", {
    timeout: 8000,
  });
  await page.getByRole("button", { name: "Resume sculpture" }).click();
  // On a small screen, clicking the controls can scroll the canvas offscreen.
  await engine.scrollIntoViewIfNeeded();
  await expect(engine).toHaveAttribute("data-render-state", "running");
});
test("system prototype routes input, cancels cleanly, and prefills a relevant inquiry", async ({
  page,
}) => {
  await page.addInitScript(() => sessionStorage.setItem("zyrixdev-intro", "cinematic-v2"));
  await page.goto("/");
  const lab = page.locator("#lab");
  await lab.scrollIntoViewIfNeeded();
  await lab.getByLabel("YOUR INPUT").fill("Organize community requests");
  await lab.getByRole("button", { name: "RUN THE SIGNAL" }).click();
  await lab
    .locator(".lab-tabs")
    .getByRole("button", { name: "02 Bots" })
    .click();
  await expect(lab.locator(".lab-output")).toContainText("OUTPUT / WAITING");
  await lab.getByRole("button", { name: "RUN THE SIGNAL" }).click();
  await expect(lab.locator(".lab-output")).toContainText(
    "Organize community requests",
  );
  await expect(lab.locator(".lab-output")).toContainText(
    "Prepare a community bot workflow",
  );
  await lab.getByRole("button", { name: "Let’s build your bots" }).click();
  await expect(
    page.getByRole("dialog").getByLabel("What are you thinking?"),
  ).toHaveValue("Bots");
});
test("experiment and chapter navigation remain accessible", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator("#lab").scrollIntoViewIfNeeded();
  const dial = page.getByRole("navigation", { name: "Story chapters" });
  await expect(dial).toBeVisible();
  await dial.getByRole("button").click();
  expect(
    (
      await new AxeBuilder({ page })
        .include("#lab")
        .include(".chapter-dial")
        .analyze()
    ).violations,
  ).toEqual([]);
  await dial.getByRole("link", { name: "Chapter 5: The studio" }).click();
  await expect(page).toHaveURL(/#studio$/);
});

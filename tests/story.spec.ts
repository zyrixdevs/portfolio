import { test, expect, type Page } from "@playwright/test";
async function progress(page: Page, selector: string, value: number) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
  await page
    .locator(selector)
    .evaluate(
      (el, p) =>
        window.scrollTo(
          0,
          el.getBoundingClientRect().top +
            scrollY +
            (el.clientHeight - innerHeight) * p,
        ),
      value,
    );
}
test("vertical scrolling advances the horizontal gallery and looping services", async ({
  page,
  isMobile,
}) => {
  await page.addInitScript(() => sessionStorage.setItem("zyrixdev-intro", "1"));
  await page.goto("/");
  await progress(page, ".work-scroll", 0.1);
  const carousel = page.getByRole("region", { name: "Image carousel" });
  await expect(carousel.locator("canvas")).toBeVisible();
  await progress(page, ".work-scroll", 0.5);
  await expect(carousel.locator("[aria-live]")).toContainText("3 of 5");
  const frame = await page.locator(".work-experience").boundingBox();
  expect(Math.abs(frame!.y)).toBeLessThan(3);
  await progress(page, ".services-scroll", 0.44);
  await expect(
    page.getByRole("heading", { name: "Your ambitious idea, engineered." }),
  ).toBeVisible();
  await progress(page, ".services-scroll", 0.8);
  await expect(
    page.getByRole("heading", { name: "Let your workflow flow." }),
  ).toBeVisible();
  await page.getByRole("listbox").hover();
  const y = await page.evaluate(() => scrollY);
  if (isMobile) {
    const box = await page.getByRole("listbox").boundingBox();
    const cdp = await page.context().newCDPSession(page);
    const x = box!.x + box!.width / 2,
      start = box!.y + box!.height * 0.8;
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x, y: start }],
    });
    for (let i = 1; i <= 8; i++)
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x, y: start - i * 22 }],
      });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await cdp.detach();
  } else await page.mouse.wheel(0, 250);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(y + 50);
});
test("scroll flips multiple cards and advances the separate photo spiral", async ({
  page,
}) => {
  await page.addInitScript(() => sessionStorage.setItem("zyrixdev-intro", "1"));
  await page.goto("/");
  await progress(page, ".spiral-scroll", 0.2);
  const photo = page.locator('.spiral-stage [role="listitem"]').first();
  await expect(photo).toBeVisible();
  const before = await photo.getAttribute("style");
  await progress(page, ".spiral-scroll", 0.6);
  await expect.poll(() => photo.getAttribute("style")).not.toEqual(before);
  await progress(page, ".principles-scroll", 0.25);
  await expect(
    page.getByRole("button", { name: "Flip the clarity card" }),
  ).toHaveAttribute("aria-pressed", "true");
  await progress(page, ".principles-scroll", 0.9);
  await expect(
    page.getByRole("button", { name: "Flip the purpose card" }),
  ).toHaveAttribute("aria-pressed", "true");
  expect(
    await page.locator(".principles-rail").evaluate((el) => el.scrollLeft),
  ).toBeGreaterThan(50);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("loading story completes and releases page scrolling", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".story-intro")).toBeHidden({ timeout: 7000 });
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe(
    "hidden",
  );
  await page.mouse.wheel(0, 600);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100);
});
test("photo spiral keeps manual drag alongside scroll control", async ({
  page,
}) => {
  await page.addInitScript(() => sessionStorage.setItem("zyrixdev-intro", "1"));
  await page.goto("/");
  await progress(page, ".spiral-scroll", 0.35);
  const stage = page.locator(".spiral-stage");
  const photo = stage.locator('[role="listitem"]').first();
  await expect(photo).toBeVisible();
  const rect = await stage.boundingBox();
  const x = rect!.x + rect!.width * 0.6,
    y = rect!.y + rect!.height * 0.5;
  const before = await photo.getAttribute("style");
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x - 150, y, { steps: 12 });
  await page.mouse.up();
  await expect.poll(() => photo.getAttribute("style")).not.toEqual(before);
});

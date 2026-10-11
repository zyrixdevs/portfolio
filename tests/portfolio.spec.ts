import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("page renders without runtime errors or horizontal overflow", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Code meets possibility." }),
  ).toBeVisible();
  await expect(page.locator(".sculpture")).toHaveAttribute(
    "data-ready",
    "true",
    { timeout: 20000 },
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});

test("all concept studies open and close accessibly", async ({ page }) => {
  await page.goto("/");
  for (const name of ["Orbit", "Relay", "Pulse", "Forma", "Parallel"]) {
    await page
      .getByRole("button", { name: `Explore ${name} concept study` })
      .click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole("heading", { name: new RegExp(name) }),
    ).toBeVisible();
    await expect(
      dialog.getByText("This is an original visual exploration", {
        exact: false,
      }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  }
});

test("contact validates input and creates an addressed email without sending", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Start a project", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Prepare project email" }).click();
  await expect(
    dialog.getByText("Your introduction is ready."),
  ).not.toBeVisible();
  await dialog.getByLabel("Your name").fill("Jamie Example");
  await dialog.getByLabel("Email address").fill("jamie@example.com");
  await dialog
    .getByLabel("A little about your idea")
    .fill("A creative website with accessible 3D interactions.");
  await dialog.getByRole("button", { name: "Prepare project email" }).click();
  await expect(dialog.getByText("Your introduction is ready.")).toBeVisible();
  const href = await dialog
    .getByRole("link", { name: "Open email app" })
    .getAttribute("href");
  expect(href).toContain("mailto:imzyrixx@gmail.com?");
  expect(decodeURIComponent(href!)).toContain("Jamie Example");
  expect(decodeURIComponent(href!)).toContain("accessible 3D interactions");
  await dialog.getByRole("button", { name: "Edit your introduction" }).click();
  await expect(dialog.getByLabel("Your name")).toHaveValue("Jamie Example");
  await page.keyboard.press("Escape");
});

test("GSAP overlay navigation works with focus return and section links", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(
    page.getByRole("navigation", { name: "Overlay navigation" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
  await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .getByRole("navigation", { name: "Overlay navigation" })
    .getByRole("link", { name: "The studio" })
    .click();
  await expect(
    page.getByRole("navigation", { name: "Overlay navigation" }),
  ).not.toBeVisible();
  await expect(page).toHaveURL(/#studio$/);
});

test("reduced motion keeps content and a static 3D poster available", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".sculpture-poster")).toBeVisible();
  expect(
    await page
      .locator(".sculpture-poster")
      .evaluate(
        (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
      ),
  ).toBe(true);
  await expect(page.locator(".sculpture canvas")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Ideas made tangible." }),
  ).toBeVisible();
});

test("main page and contact dialog pass accessibility checks", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page
    .getByRole("button", { name: "Start a project", exact: true })
    .click();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("without JavaScript the organization and contact route remain available", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173");
  await expect(
    page.getByRole("heading", { name: "Zyrix — Code meets possibility." }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "connect with Zyrix on GitHub" }),
  ).toHaveAttribute("href", "https://github.com/zyrixdevs");
  await context.close();
});

test("capability wheel changes details and preselects the project inquiry", async ({
  page,
}) => {
  await page.goto("/");
  const wheel = page.getByRole("listbox", { name: "Option wheel" });
  await wheel.scrollIntoViewIfNeeded();
  await wheel.focus();
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("heading", { name: "Put a new teammate to work." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Let’s build bots" }).click();
  await expect(
    page.getByRole("dialog").getByLabel("What are you thinking?"),
  ).toHaveValue("Bots");
});

test("process sidebar and two-sided philosophy card support keyboard input", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page
    .locator(".process-sidebar")
    .getByRole("button", { name: /Define/ })
    .click();
  await expect(
    page.getByRole("heading", { name: "Give the idea a shape." }),
  ).toBeVisible();
  const card = page.getByRole("button", {
    name: "Flip the studio philosophy card",
  });
  await card.scrollIntoViewIfNeeded();
  await card.focus();
  await page.keyboard.press("Enter");
  await expect(card).toHaveAttribute("aria-pressed", "true");
  await expect(
    card.getByRole("heading", { name: "Made for people. Built with purpose." }),
  ).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(card).toHaveAttribute("aria-pressed", "false");
});

test("tear-off invitation opens the project composer and can be restored", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const ticket = page.getByRole("button", {
    name: "Tear ticket to start a project",
  });
  await ticket.scrollIntoViewIfNeeded();
  await ticket.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("dialog", { name: "A good place to start." }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Restore invitation" }).click();
  await expect(ticket).toBeVisible();
});

test("flowing service menu selects the correct inquiry type", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator(".service-flow").scrollIntoViewIfNeeded();
  await page
    .locator(".flow-live")
    .getByRole("link", { name: "Automations", exact: true })
    .click();
  await expect(
    page.getByRole("dialog").getByLabel("What are you thinking?"),
  ).toHaveValue("Automations");
});

test("FlexCarousel responds to keyboard navigation", async ({ page }) => {
  await page.goto("/");
  await page.locator(".flex-gallery").scrollIntoViewIfNeeded();
  const carousel = page.getByRole("region", { name: "Image carousel" });
  await expect(carousel.locator("canvas")).toBeVisible();
  await carousel.focus();
  await page.keyboard.press("ArrowRight");
  await expect(carousel.locator("[aria-live]")).toContainText("2 of 5");
});

test("no WebGL still provides the hero and usable concept studies", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      type: string,
      ...args: unknown[]
    ) {
      if (
        type === "webgl" ||
        type === "webgl2" ||
        type === "experimental-webgl"
      )
        return null;
      return original.call(this, type as never, ...args);
    } as typeof original;
  });
  await page.goto("/");
  await expect(page.locator(".sculpture-poster")).toBeVisible();
  await page.locator(".flex-gallery").scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("region", { name: "Concept study gallery" }),
  ).toBeVisible();
  await page
    .locator(".work-directory")
    .getByRole("button", { name: "Explore Relay concept study" })
    .click();
  await expect(
    page.getByRole("dialog").getByRole("heading", { name: "Relay" }),
  ).toBeVisible();
});

test("new visual sections and overlay retain accessible controls", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Pause technology animation" })
    .click();
  await expect(
    page.getByRole("button", { name: "Resume technology animation" }),
  ).toHaveAttribute("aria-pressed", "true");
  for (const selector of ["#services", "#playground"]) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await expect(page.locator(selector)).toBeVisible();
    const results = await new AxeBuilder({ page }).include(selector).analyze();
    expect(
      results.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
  }
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await expect(
    page.getByRole("dialog", { name: "Explore Zyrix" }),
  ).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
});

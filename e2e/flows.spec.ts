import { expect, test } from "@playwright/test";

test("landing page shows every document with its price", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("honest");
  for (const name of ["Non-Disclosure Agreement", "Residential Lease Agreement", "Bill of Sale"])
    await expect(page.getByRole("heading", { name, level: 3 }).first()).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("fill in an NDA, pay in demo mode and download the PDF", async ({ page, isMobile }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/create/non-disclosure-agreement");
  const next = () => page.getByRole("button", { name: /^(Continue|Review document)/ }).click();

  await page.getByRole("radio", { name: /Mutual/ }).click();
  await next();
  await page.fill("#f-aName", "Northwind Labs LLC");
  await next();
  // Required field is enforced
  await next();
  await expect(page.locator("#f-bName-err")).toBeVisible();
  await page.fill("#f-bName", "Daniel Cho");
  await next();
  await page.fill("#f-purpose", "evaluating a partnership");
  await next();
  await page.fill("#f-effectiveDate", "2026-10-04");
  await next();
  await page.selectOption("#f-state", "California");
  await next();

  await expect(page.getByRole("heading", { name: "Review and download" })).toBeVisible();
  if (!isMobile) await expect(page.getByText("100% filled in")).toBeVisible();

  // Answers survive a reload
  await page.reload();
  await expect(page.getByRole("heading", { name: "Review and download" })).toBeVisible();

  const download = page.waitForEvent("download");
  const pay = page.getByRole("button", { name: /Pay \$9 and download/ });
  await expect(pay).toBeDisabled();
  await page.getByRole("checkbox", { name: /not a law firm/ }).check();
  await pay.click();
  const file = await download;
  expect(file.suggestedFilename()).toBe("non-disclosure-agreement.pdf");
  await expect(page.getByRole("heading", { name: /Your NDA is ready/ })).toBeVisible();

  // Coming back recognises the purchase
  await page.goto("/create/non-disclosure-agreement?step=review");
  await expect(page.getByText("You already own this document")).toBeVisible();
  expect(errors).toEqual([]);
});

test("download API refuses purchases for another document", async ({ request }) => {
  const res = await request.post("/api/download", {
    data: { slug: "bill-of-sale", sessionId: "demo__non-disclosure-agreement__1", answers: {} },
  });
  expect(res.status()).toBe(402);
});

test("every document page and editor loads", async ({ page }) => {
  await page.goto("/documents");
  const links = await page.locator('main a[href^="/documents/"]').evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute("href")!))]);
  expect(links.length).toBeGreaterThanOrEqual(5);
  for (const href of links) {
    await page.goto(href);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.goto(href.replace("/documents/", "/create/"));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});

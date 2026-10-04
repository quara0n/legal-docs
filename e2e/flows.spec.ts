import { expect, test } from "@playwright/test";

// The default build sells in Norway (NEXT_PUBLIC_MARKET unset).

test("landing page shows every document with its price", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "nb");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("ærlig");
  for (const name of ["Husleiekontrakt", "Kjøpekontrakt", "Gjeldsbrev (låneavtale)"])
    await expect(page.getByRole("heading", { name, level: 3 }).first()).toBeVisible();
  await expect(page.getByText("199 kr").first()).toBeVisible();
  // US templates are not published in the Norwegian build
  expect((await page.goto("/documents/non-disclosure-agreement"))?.status()).toBe(404);
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("fill in a taushetserklæring, pay in demo mode and download the PDF", async ({ page, isMobile }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/create/taushetserklaering");
  const next = () => page.getByRole("button", { name: /^(Fortsett|Se over dokumentet)/ }).click();

  await page.getByRole("radio", { name: /Gjensidig/ }).click();
  await next();
  await page.fill("#f-aName", "Nordlys Teknologi AS");
  await next();
  // Required field is enforced
  await next();
  await expect(page.locator("#f-bName-err")).toBeVisible();
  await page.fill("#f-bName", "Ola Nordmann");
  await next();
  await page.fill("#f-purpose", "å vurdere et mulig samarbeid");
  await next();
  await next();

  await expect(page.getByRole("heading", { name: "Se over og last ned" })).toBeVisible();
  if (!isMobile) await expect(page.getByText("100 % fylt ut")).toBeVisible();

  // Answers survive a reload
  await page.reload();
  await expect(page.getByRole("heading", { name: "Se over og last ned" })).toBeVisible();

  const download = page.waitForEvent("download");
  const pay = page.getByRole("button", { name: /Betal 99 kr og last ned/ });
  await expect(pay).toBeDisabled();
  await page.getByRole("checkbox", { name: /ikke er et advokatfirma/ }).check();
  await pay.click();
  const file = await download;
  expect(file.suggestedFilename()).toBe("taushetserklaering.pdf");
  await expect(page.getByRole("heading", { name: /Dokumentet ditt er klart/ })).toBeVisible();

  // Coming back recognises the purchase
  await page.goto("/create/taushetserklaering?step=review");
  await expect(page.getByText("Du har allerede kjøpt dette dokumentet")).toBeVisible();
  expect(errors).toEqual([]);
});

test("download API refuses purchases for another document", async ({ request }) => {
  const res = await request.post("/api/download", {
    data: { slug: "kjopekontrakt", sessionId: "demo__taushetserklaering__1", answers: {} },
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

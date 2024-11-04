import playwright, { chromium, Page } from "playwright";

// individual image of chapter
const getMangasee123Chapter = async (site: string) => {
  const baseURL = "https://mangasee123.com";

  const res = [];
  const maxTries = 3;
  let tries = 0;

  const browser = await chromium.launch();
  const page = await browser.newPage();

  while (tries < maxTries) {
    try {
      await page.goto(site);

      const mangaImages = await page.locator(".img-fluid.HasGap").all();
      for (const mI of mangaImages) {
        const link = await mI.getAttribute("src");
        res.push(link);
      }
      return { pages: res };
    } catch (error) {
      tries++;
      console.log(error);
    }
  }
  return {
    errors: [
      {
        status: "500",
        detail: "mangasee123.com is down",
      },
    ],
  };
};

export default getMangasee123Chapter;

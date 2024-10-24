import playwright, { chromium, Page } from "playwright";

// individual image of chapter
const getMangasee123Chapter = async () => {
  const baseURL = "https://mangasee123.com";
  const chapterId = "Hananoi-kun-to-Koi-no-Yamai-chapter-58.html";
  const res = [];
  const maxTries = 3;
  let tries = 0;

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(`${baseURL}/read-online/${chapterId}`);
  const mangaImages = await page.locator(".img-fluid.HasGap").all();

  for (const mI of mangaImages) {
    const link = await mI.getAttribute("src");
    res.push(link);
  }
  return res;
};

export default getMangasee123Chapter;

import playwright, { chromium, Page } from "playwright";

// need to implement way to check title while searching mangas

const getMangasee123Manga = async () => {
  const title = "Mikadono-Sanshimai-wa-Angai-Choroi";
  const maxTries = 3;
  let tries = 0;
  const baseURL = "https://mangasee123.com.manga";
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`${baseURL}/${title}`);
};

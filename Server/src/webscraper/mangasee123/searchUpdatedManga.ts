import playwright, { chromium, Page } from "playwright";

const clickLoadMore = async (page: Page) => {
  return await page.getByRole("button", { name: "Load More..." }).click();
};

const searchUpdatedManga = async () => {
  const date = new Date("09/20/2024");

  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const baseURL = "https://mangasee123.com";

    //   const launchOptions = {
    //     headless: false,
    //     proxy: {
    //        server: "http://pr.oxylabs.io:7777",
    //        username: "USERNAME",
    //        password: "PASSWORD"
    //      }
    //   }
    const res = [];
    await page.goto(`${baseURL}/search/?sort=lt&desc=true`);

    await clickLoadMore(page);

    let lastManga = await page.locator(".col-md-10").last();
    let lastMangaDate = await lastManga.locator(".GrayLabel").textContent();
    let checkDate = lastMangaDate ? new Date(lastMangaDate.slice(2)) : null;

    while (checkDate && date <= checkDate) {
      await clickLoadMore(page);

      lastManga = await page.locator(".col-md-10").last();
      lastMangaDate = await lastManga.locator(".GrayLabel").textContent();
      checkDate = lastMangaDate ? new Date(lastMangaDate.slice(2)) : null;
    }

    const rows = await page.locator(".col-md-10").all();
    console.log(rows.length);

    for (const r of rows) {
      const current = {
        title: "",
        mangaLink: "",
        mangaka: [] as string[],
        latestChapter: "",
        latestChapterLink: "",
        lastUpdatedDate: "",
      };
      const title = await r.locator(".SeriesName").textContent();
      current["title"] = title ? title : "";

      const link = await r.locator(".SeriesName").getAttribute("href");
      current["mangaLink"] = link ? `${baseURL}${link}` : "";

      const mangaka = await r
        .locator("[ng-click='vm.Search.Author = Author; vm.UpdateLink();']")
        .allTextContents();
      current["mangaka"] = mangaka ? mangaka : [];

      const latestChapter = await r
        .locator(`[ng-if="Series.l != 'N/A'"]`)
        .textContent();
      current["latestChapter"] = latestChapter ? latestChapter : "";

      const latestChapterLink = await r
        .locator(`[ng-if="Series.l != 'N/A'"]`)
        .getAttribute("href");
      current["latestChapterLink"] = latestChapterLink
        ? `${baseURL}${latestChapterLink}`
        : "";

      const latestUpdatedDate = await r.locator(".GrayLabel").textContent();
      current["lastUpdatedDate"] = latestUpdatedDate
        ? latestUpdatedDate.slice(2)
        : "";

      res.push(current);
    }

    // const lastRow = rows[rows.length - 1];

    // const mangaName = await lastRow.locator(".SeriesName").allTextContents();
    // const mangaLink = await lastRow.locator(".SeriesName").getAttribute("href");
    // const mangaka = await lastRow.locator(".ng-binding").allTextContents();
    // console.log("manga", mangaka);

    // await page.screenshot({ path: "page.png", fullPage: true });
    await browser.close();
  } catch (error: any) {
    console.log("error", error);
  }
};

export default searchUpdatedManga;

import playwright, { chromium, Page } from "playwright";

export interface searchUpdatedMangasee123 {
  data: updatedMangasee123[];
}

export interface updatedMangasee123 {
  title: string;
  mangaLink: string;
  mangaka: string[];
  latestChapter: string;
  latestChapterLink: string;
  lastUpdatedDate: string;
}

export interface errorMessageInterface {
  status: string;
  detail: string;
  cause?: string;
}

export interface errorsInterface {
  errors: errorMessageInterface[];
}

const clickLoadMore = async (page: Page) => {
  await page.getByRole("button", { name: "Load More..." }).click();
};

// input date field to check later
const searchUpdatedMangasee123 = async (): Promise<
  errorsInterface | searchUpdatedMangasee123
> => {
  const date = new Date("09/19/2024");
  const maxTries = 3;
  let tries = 0;
  const baseURL = "https://mangasee123.com";
  const browser = await chromium.launch();
  const page = await browser.newPage();

  while (tries < maxTries) {
    try {
      //   const launchOptions = {
      //     headless: false,
      //     proxy: {
      //        server: "http://pr.oxylabs.io:7777",
      //        username: "USERNAME",
      //        password: "PASSWORD"
      //      }
      //   }
      const params = new URLSearchParams({ sort: "lt", desc: "true" });
      const res = [];
      await page.goto(`${baseURL}/search/?${params}`);
      // await page.goto(`${baseURL}/search/`, { sort: "lt", desc: true });

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

        if (date > new Date(current["lastUpdatedDate"])) {
          break;
        }

        res.push(current);
      }

      tries = maxTries;
      return { data: res };
    } catch (error: any) {
      tries++;
      console.log("error tries number", tries, error);
    }
  }
  await browser.close();
  //error if failed to fetch and let me know
  return {
    errors: [
      {
        status: "500",
        detail: "mangasee123.com is down",
      },
    ],
  };
};

export default searchUpdatedMangasee123;

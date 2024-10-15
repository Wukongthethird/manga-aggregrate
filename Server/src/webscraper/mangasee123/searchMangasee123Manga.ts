import playwright, { chromium, Page } from "playwright";

// need to implement way to check title while searching mangas

// n

export interface errorMessageInterface {
  status: string;
  detail: string;
  cause?: string;
}

export interface errorsInterface {
  errors: errorMessageInterface[];
}

export interface mangasee123Manga {
  title: string;
  mangaLink: string;
  author: string[];
}

export interface searchMangasee123 {
  data: mangasee123Manga[];
}

const locateLoadMore = async (page: Page) => {
  return await page.getByRole("button", { name: "Load More..." }).all();
};

// const clickLoadMore = async (page: Page) => {
//   await page.getByRole("button", { name: "Load More..." }).click();
// };

const searchMangasee123Manga = async (): Promise<
  errorsInterface | searchMangasee123
> => {
  //request at least 5 letters to query search all result return
  const searchQuery = "Mik";
  const maxTries = 3;
  let tries = 0;
  const baseURL = `https://mangasee123.com`;
  const params = new URLSearchParams({
    sort: "s",
    desc: "false",
    name: searchQuery,
  });
  const browser = await chromium.launch();
  const page = await browser.newPage();

  while (tries < maxTries) {
    try {
      await page.goto(`${baseURL}/search/?${params}`);
      let loadMoreButton = await locateLoadMore(page);

      while (loadMoreButton.length) {
        await loadMoreButton[0].click();
        loadMoreButton = await locateLoadMore(page);
      }

      const rows = await page.locator(".col-md-10").all();
      const res = [];
      for (const r of rows) {
        const current = {
          title: "",
          mangaLink: "",
          author: [] as string[],
        };

        const title = await r.locator(".SeriesName").textContent();
        current["title"] = title ? title : "";

        const link = await r.locator(".SeriesName").getAttribute("href");
        current["mangaLink"] = link ? `${baseURL}${link}` : "";

        const author = await r
          .locator("[ng-click='vm.Search.Author = Author; vm.UpdateLink();']")
          .allTextContents();
        current["author"] = author ? author : [];

        res.push(current);
      }
      tries = maxTries;
      return { data: res };
    } catch (error) {
      tries++;
      console.log("error tries number", tries, error);
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

export default searchMangasee123Manga;

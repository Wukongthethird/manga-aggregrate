import playwright, { chromium, Page } from "playwright";

const locateLoadMore = async (page: Page) => {
  return await page.getByRole("button", { name: "Load More..." }).all();
};

const searchMangasee123Author = async (author: string) => {
  //   const author = "ueno";
  const maxTries = 3;
  let tries = 0;
  const baseURL = `https://mangasee123.com`;
  const params = new URLSearchParams({
    sort: "s",
    desc: "false",
    author,
  });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto(`${baseURL}/search/?${params}`);
    let loadMoreButton = await locateLoadMore(page);

    while (loadMoreButton.length) {
      await loadMoreButton[0].click();
      loadMoreButton = await locateLoadMore(page);
    }

    const rows = await page.locator(".col-md-10").all();
    const res = [] as any;
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
        .allInnerTexts();
      console.log(author);
      current["author"] = author ? author : [];
      res.push(current);
    }

    tries = maxTries;
    return res;
  } catch (error) {
    tries++;
    console.log("error tries number", tries, error);
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

export default searchMangasee123Author;

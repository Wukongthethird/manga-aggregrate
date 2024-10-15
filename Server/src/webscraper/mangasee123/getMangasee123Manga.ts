import playwright, { chromium, Page } from "playwright";

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
  author: string[];
  chapters: chapter[];
}

export interface chapter {
  link: "";
  chapterNumber: "";
  date: "";
}

// need to implement way to check title while searching mangas

const getMangasee123Manga = async (): Promise<
  errorsInterface | mangasee123Manga
> => {
  const titleId = "99-Reinforced-Wooden-Stick";
  const maxTries = 3;
  let tries = 0;
  const baseURL = "https://mangasee123.com";
  const browser = await chromium.launch();
  const page = await browser.newPage();
  while (tries < maxTries) {
    try {
      const res = { title: "", author: [] as string[], chapters: [] as any };
      await page.goto(`${baseURL}/manga/${titleId}`);
      const showAllChapterButton = await page
        .locator(".ShowAllChapters")
        .first();
      if (await showAllChapterButton.isVisible()) {
        await showAllChapterButton.click();
      }
      const title = await page
        .locator(".d-sm-none.col-9.top-5.bottom-5")
        .locator(".bottom-10")
        .first()
        .innerText();

      res["title"] = title ? title.replace(/\t/g, "").replace("\n", "") : "";
      const author = await page
        .locator("[href^='/search/?author=']")
        .allInnerTexts();
      res["author"] = author ? author : [];

      const chapterListRes = await page
        .locator(".list-group-item.ChapterLink.ng-scope")
        .all();

      for (const chapter of chapterListRes) {
        const current = { link: "", chapterNumber: "", date: "" };
        const link = await chapter.getAttribute("href");
        if (link) {
          current["link"] = `${baseURL}${link.slice(0, link.length - 12)}.html`;
        }
        const chapterData = await chapter
          .locator("span.ng-binding")
          .allInnerTexts();
        const chapterNumber = chapterData[0].split(" ");
        current["chapterNumber"] = chapterNumber[chapterNumber.length - 1];
        current["date"] = chapterData[chapterData.length - 1];
        res.chapters.push(current);
      }

      await page.screenshot({ path: "page.png", fullPage: true });
      tries = maxTries;
      return res;
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

export default getMangasee123Manga;

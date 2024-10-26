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
  manga: {
    site: string;
    title: string;
    author: string[];
    coverArtImageURL?: string;
  };
  chapters: chapter[];
}

export interface chapter {
  link: "";
  chapterNumber: "";
  date: "";
}

// need to implement way to check title while searching mangas

//pass the baseurl with the manga
const getMangasee123Manga = async (
  site: string
): Promise<errorsInterface | mangasee123Manga> => {
  const maxTries = 3;
  let tries = 0;
  const baseURL = "https://mangasee123.com"; //use this as validation
  const browser = await chromium.launch();
  const page = await browser.newPage();
  while (tries < maxTries) {
    try {
      const res = {
        manga: {
          site,
          title: "",
          author: [] as string[],
          coverArtImageURL: "",
        },
        chapters: [] as any,
      };
      await page.goto(site);
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

      res.manga["title"] = title
        ? title.replace(/\t/g, "").replace("\n", "")
        : "";

      const coverArtImageURL = await page
        .locator(".col-md-3.col-sm-4.col-3.top-5")
        .locator("img")
        .getAttribute("src");

      res.manga.coverArtImageURL = coverArtImageURL ? coverArtImageURL : "";

      const author = await page
        .locator("[href^='/search/?author=']")
        .allInnerTexts();
      res.manga["author"] = author ? author : [];

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

      // await page.screenshot({ path: "page.png", fullPage: true });
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

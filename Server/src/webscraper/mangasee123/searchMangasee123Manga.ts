import playwright, { chromium, Page } from "playwright";

// need to implement way to check title while searching mangas
// n
const searchMangasee123Manga = async () => {
  //request at least 5 letters to query search all result return
  const title = "Mikadono";
  const maxTries = 3;
  let tries = 0;
  const baseURL = `https://mangasee123.com/search/?sort=s&desc=false&name=${title}`;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(baseURL);
  const loadMoreButton = await page
    .getByRole("button", { name: "Load More..." })
    .all();
  const rows = await page.locator(".col-md-10").all();
  page.screenshot({ path: "page.png", fullPage: true });
  //   console.log(rows);
  console.log(loadMoreButton);
};

export default searchMangasee123Manga;

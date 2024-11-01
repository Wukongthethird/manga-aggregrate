"use strict";
import express, { Request, Response, NextFunction, request } from "express";
import corsConfig from "./src/configs/corsConfig";
import cors from "cors";
import dotenv from "dotenv";

//middleware import
import errorHandler from "./src/middlewares/errorHandler";

//manga related
import mangadexAPI from "./src/API/mangadexAPI";
import mangaUpdatesAPI, { mangaUpdatesManga } from "./src/API/mangaUpdatesAPI";
import searchUpdatedMangasee123 from "./src/webscraper/mangasee123/searchUpdatedMangasee123";
import { errorsInterface, mangadexMangaInterface } from "./src/API/mangadexAPI";
import searchMangasee123Manga from "./src/webscraper/mangasee123/searchMangasee123Manga";
import getMangasee123Manga from "./src/webscraper/mangasee123/getMangasee123Manga";
import getMangasee123Chapter from "./src/webscraper/mangasee123/getMangasee123Chapter";
import searchMangasee123Author from "./src/webscraper/mangasee123/searchMangasee123Author";
import findMangadexManga from "./src/functions/findMangadexManga";
import findMangasee123Manga from "./src/functions/findMangasee123Manga";

// configures dotenv to work in your application
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

console.log(PORT);
//Middlewares
app.use(cors(corsConfig));
app.use(express.json());

// app.use(  json())
app.get(
  "/",
  async (request: Request, response: Response, next: NextFunction) => {
    await mangadexAPI.refreshMangadexTokens();

    // const manga = await mangadexAPI.getMangaFeed(10, "2024-08-29T23:20:50");
    // const manga = await searchMangasee123Manga();
    // const manga = await mangadexAPI.getMangaDetails(
    //   "7873dd0e-131f-4f40-8a92-32601713e1da"
    // );
    const manga = await mangadexAPI.getMangaChapterList(
      "7873dd0e-131f-4f40-8a92-32601713e1da"
    );
    // const manga = await searchMangasee123Author("ueno");
    response.status(200).json(manga);
  }
);

app.post(
  "/searchmangadexmanga",
  async (request: Request, response: Response, next: NextFunction) => {
    const title = request.body.title;
    const resAPI = await mangadexAPI.searchManga(title);

    // if (!resAPI) {
    //   return response.status(500);
    // }

    // // will depend on type of error
    // if (resAPI.hasOwnProperty("error")) {
    //   return response.status(400).json(resAPI);

    // }

    return response.status(200).json({ data: resAPI });
  }
);

// w
app.post(
  "/getmangadexpage",
  async (request: Request, response: Response, next: NextFunction) => {
    const mangaId = request.body.mangaId;
    if (!mangaId) {
      return;
    }
    const mangadexPage = await mangadexAPI.getMangaDetails(mangaId);
    /// mayne dont need metadata
    const mangadexChapter = await mangadexAPI.getMangaChapterList(mangaId);
    const pageAndChapter = {
      chapters: mangadexChapter.chapterList,
      manga: { ...mangadexPage },
    };
    return response.status(200).json({ ...pageAndChapter });
  }
);

app.post(
  "/searchmangaupdates",
  async (request: Request, response: Response, next: NextFunction) => {
    const title = request.body.title;
    const pageNumber = request.body.pageNumber;
    const resAPI = await mangaUpdatesAPI.searchManga(title, pageNumber);

    if (resAPI.hasOwnProperty("error")) {
      return response.status(404).json(resAPI);
    }

    return response.status(200).json(resAPI);
  }
);

app.post(
  "/getmangaupdatesmangainfo",
  async (request: Request, response: Response, next: NextFunction) => {
    const mangaId = request.body.mangaId;
    const resAPI = await mangaUpdatesAPI.getManga(mangaId);

    if (resAPI.hasOwnProperty("errors")) {
      return response.status(404).json(resAPI);
    }
    return response.status(200).json(resAPI);
  }
);

app.post(
  "/findmangaonmangadex",
  async (request: Request, response: Response, next: NextFunction) => {
    // mangaId on mangaupdates

    const mangaId = request.body.mangaId;
    const resMangaUpdatesAPI: errorsInterface | mangaUpdatesManga =
      await mangaUpdatesAPI.getManga(mangaId);
    //array of author may need to process one by one?
    // console.log(resMangaUpdatesAPI);
    if (resMangaUpdatesAPI.hasOwnProperty("errors")) {
      return response.status(404).json(resMangaUpdatesAPI);
    }

    // console.log(resMangaUpdatesAPI);
    // filter by author is here
    if ("author" in resMangaUpdatesAPI) {
      const mangaTitles = [resMangaUpdatesAPI.title];
      if (resMangaUpdatesAPI.altTitles) {
        mangaTitles.push(...resMangaUpdatesAPI.altTitles);
      }

      const authors = resMangaUpdatesAPI.author as string[];

      const publicationYear = resMangaUpdatesAPI.publicationYear;
      const completed = resMangaUpdatesAPI.completed;

      const mangadexMangaId = await findMangadexManga(
        authors,
        mangaTitles,
        publicationYear,
        completed
      );

      return response.status(200).json({ mangadexMangaId });

      // return these 2 references,
      // probably only want chapter list no need for metadata on Mangasite
    }
  }
);

app.post(
  "/getmangadexchapterpages",
  async (request: Request, response: Response, next: NextFunction) => {
    const mangadexChapterId = request.body.mangadexChapterId;
    if (!mangadexChapterId) {
      return response.status(200).json();
    }

    const res = await mangadexAPI.getMangadeChapterPages(mangadexChapterId);

    return response.status(200).json(res);
  }
);
app.post(
  "/findmangaonmangasee123",
  async (request: Request, response: Response, next: NextFunction) => {
    // mangaId on mangaupdates

    const mangaId = request.body.site;
    const resMangaUpdatesAPI: errorsInterface | mangaUpdatesManga =
      await mangaUpdatesAPI.getManga(mangaId);
    //array of author may need to process one by one?
    // console.log(resMangaUpdatesAPI);
    if (resMangaUpdatesAPI.hasOwnProperty("errors")) {
      return response.status(404).json(resMangaUpdatesAPI);
    }

    // filter by author is here
    if ("author" in resMangaUpdatesAPI) {
      const mangaTitles = [resMangaUpdatesAPI.title];
      if (resMangaUpdatesAPI.altTitles) {
        mangaTitles.push(...resMangaUpdatesAPI.altTitles);
      }

      const authors = resMangaUpdatesAPI.author as string[];

      const mangasee123Link = await findMangasee123Manga(authors, mangaTitles);
      return response.status(200).json({ mangasee123Link });
      // return these 2 references,
      // probably only want chapter list no need for metadata on Mangasite
    }
  }
);

app.post(
  "/getmangasee123page",
  async (request: Request, response: Response, next: NextFunction) => {
    const site = request.body.site;

    if (!site) {
      return;
    }

    const mangasee123Manga = await getMangasee123Manga(site);

    /// mayne dont need metadata
    // const mangadexChapter = await mangadexAPI.getMangaChapterList(mangaId);
    // const pageAndChapter = {
    //   chapters: mangadexChapter.chapterList,
    //   manga: { ...mangadexPage },
    // };
    if (!mangasee123Manga) {
      return;
    }
    return response.status(200).json({ ...mangasee123Manga });
  }
);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server running at PORT: ", PORT);
});

// gracefully handle error

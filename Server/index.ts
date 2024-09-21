"use strict";
import express, { Request, Response, NextFunction, request } from "express";
import corsConfig from "./src/configs/corsConfig";
import cors from "cors";
import dotenv from "dotenv";

//middleware import
import errorHandler from "./src/middlewares/errorHandler";

//manga related
import mangadexAPI from "./src/API/mangadexAPI";
import mangaUpdatesAPI from "./src/API/mangaUpdatesAPI";
import searchUpdatedManga from "./src/webscraper/mangasee123/searchUpdatedManga";

// configures dotenv to work in your application
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
import { errorsInterface, mangaInterface } from "./src/API/mangadexAPI";

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
    searchUpdatedManga();

    response.status(200).json({ hello: "Hello World" });
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
    const mangadexPage = await mangadexAPI.getMangaDetails(mangaId);
    const mangadexChapter = await mangadexAPI.getMangaChapterList(mangaId);
    const pageAndChapter = {
      data: { chapters: mangadexChapter.data, manga: { ...mangadexPage } },
    };
    return response.status(200).json({ data: pageAndChapter });
  }
);

app.post(
  "/searchmangaupdates",
  async (request: Request, response: Response, next: NextFunction) => {
    const title = request.body.title;
    const resAPI = await mangaUpdatesAPI.searchManga(title);

    if (resAPI.hasOwnProperty("error")) {
      return response.status(404).json({ ...resAPI });
    }
    return response.status(200).json({ data: resAPI });
  }
);

app.post(
  "/getmangaupdatesmangainfo",
  async (request: Request, response: Response, next: NextFunction) => {
    const mangaId = request.body.mangaId;
    const resAPI = await mangaUpdatesAPI.getManga(mangaId);

    if (resAPI.hasOwnProperty("errors")) {
      return response.status(404).json({ ...resAPI });
    }
    return response.status(200).json({ data: resAPI });
  }
);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server running at PORT: ", PORT);
});

// gracefully handle error

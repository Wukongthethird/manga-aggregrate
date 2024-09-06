"use strict";
import express, { Request, Response, NextFunction } from "express";
import corsConfig from "./src/configs/corsConfig";
import cors from "cors";
import dotenv from "dotenv";

//middleware import
import errorHandler from "./src/middlewares/errorHandler";
import mangadexAPI from "./src/API/mangadexAPI";
import mangaUpdatesAPI from "./src/API/mangaUpdatesAPI";

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

    // const manga = await mangadexAPI.getMangaDetails(
    //   "bcbf9c51-2f3c-462c-a81b-b6e5530ae00f"
    // );
    // const manga = await mangadexAPI.getMangaFeed(10, "2024-08-29T23:20:50");

    // const manga = await mangadexAPI.getMangaChapterList(
    //   "ffe69cc2-3f9e-4eab-a7f7-c963cea9ec25",
    //   100,
    //   75,
    //   40
    // );
    // const manga = await mangadexAPI.getMangaChapter(
    //   "979a8de3-c9c6-4ba3-9ca4-afdbf6009a62"
    // );

    // const manga1 = await mangadexAPI.downloadMangaChapter(
    //   "979a8de3-c9c6-4ba3-9ca4-afdbf6009a62"
    // );
    const manga = await mangaUpdatesAPI.searchManga("savage hero");
    console.log(manga);

    response.status(200).send("Hello World");
  }
);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server running at PORT: ", PORT);
});

// gracefully handle error

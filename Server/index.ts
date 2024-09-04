"use strict";
import express, { Request, Response, NextFunction } from "express";
import corsConfig from "./src/configs/corsConfig";
import cors from "cors";
import dotenv from "dotenv";

//middleware import
import errorHandler from "./src/middlewares/errorHandler";
import mangadexAPI from "./src/API/mangadexAPI";

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
    // // const manga2 = await mangadexAPI.searchManga("hero");
    // const chapter = await mangadexAPI.getMangaChapterList(
    //   "bcbf9c51-2f3c-462c-a81b-b6e5530ae00f",
    //   100,
    //   146,
    //   250
    // );
    // console.log(chapter);

    response.status(200).send("Hello World");
  }
);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server running at PORT: ", PORT);
});

// gracefully handle error

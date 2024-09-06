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

    // const manga = await mangaUpdatesAPI.searchManga("savage hero");
    // console.log(manga);

    response.status(200).json({ hello: "Hello World" });
  }
);

app.post(
  "/searchmangaupdates",
  async (request: Request, response: Response, next: NextFunction) => {
    const title = request.body.title;

    const resAPI = await mangaUpdatesAPI.searchManga(title);
    console.log(resAPI);
  }
);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server running at PORT: ", PORT);
});

// gracefully handle error

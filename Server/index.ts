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

    // const manga = await mangadexAPI.getMangadexManga(
    //   "bcbf9c51-2f3c-462c-a81b-b6e5530ae00f"
    // );
    // const manga = await mangadexAPI.getMangadexFeed(10, "2024-08-29T23:20:50");
    // const manga2 = await mangadexAPI.searchMangadexManga("hero");

    // console.log("res", manga, manga2);

    response.status(200).send("Hello World");
  }
);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server running at PORT: ", PORT);
});

// gracefully handle error

"use strict";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

interface searchMangadexMangaInterface {
  id: string;
  title: string;
  link: string;
  altTitles: string[];

  //author and artist later if wanted
}
interface newMangaInterface {
  chapterId: string;
  chapterNumber: string;
  mangaId: string;
  mangaTitle: getMangadexMangaInterface;
  link: string;
}
interface getMangadexFeedInterface {
  data: newMangaInterface[];
  // chapterId: string;
  // chapterNumber: string;
  // mangaId: string;
  // mangaTitle?: any;

  errors?: ErrorMessage[];
}

interface getMangadexMangaInterface {
  title?: string;
  altTitles?: string[];
}

interface ErrorMessage {
  status: string;
  detail: string;
  cause?: string;
}
export default class mangadexAPI {
  static BASE_URL = process.env.MANGADEX_BASE_URL;

  //   static authorizations: string;
  static access_token: string;
  static refresh_token: string;

  static async request(endpoint = "", data = {}, method = "get") {
    const headers = {
      "User-Agent": process.env.USER_AGENT,
      Authorization: `Bearer ${this.access_token}`,
    };
    const url = `${this.BASE_URL}/${endpoint}`;
    const params = method === "get" ? data : {};

    try {
      return await axios({
        url,
        method,
        params,
        headers,
      });
    } catch (error: any) {
      //   console.error("api ERROR", error);
      //mangadex api drilled error
      console.log(error?.response?.data);
      return error?.response?.data;
    }
  }

  static async getMangadexTokens() {
    const creds = {
      grant_type: "password",
      username: process.env.MANGADEX_USERNAME,
      password: process.env.MANGADEX_PASSWORD,
      client_id: process.env.MANGADEX_CLIENT_ID,
      client_secret: process.env.MANGADEX_CLIENT_SECRET,
    };
    try {
      const res = await axios({
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": process.env.USER_AGENT,
        },
        url: "https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/token",
        data: creds,
      });
      const { access_token, refresh_token } = res.data;
      this.access_token = access_token;
      this.refresh_token = refresh_token;
      // console.log(this.access_token);
    } catch (error: any) {
      console.log(error.data.errors);
    }
  }

  static async refreshMangadexTokens() {
    if (!this.refresh_token) {
      await this.getMangadexTokens();
      return;
    }

    const creds = {
      grant_type: "refresh_token",
      refresh_token: this.refresh_token,
      client_id: process.env.MANGADEX_CLIENT_ID,
      client_secret: process.env.MANGADEX_CLIENT_SECRET,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": process.env.USER_AGENT,
      },
    };

    try {
      const res = await axios({
        method: "POST",
        url: "https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/token",
        data: creds,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": process.env.USER_AGENT,
        },
      });
      this.access_token = res?.data?.access_token;
      this.refresh_token = res?.data.refresh_token;
    } catch (error: any) {
      console.log(error.data.errors);
    }
  }

  static async getMangadexManga(
    id: string
  ): Promise<ErrorMessage | getMangadexMangaInterface> {
    // const r = Math.random();
    // const url = r > 0.5 ? `manga/${id}` : `manga${id}`;
    const res = await this.request(`manga/${id}`);

    //may need to loop if res.erros get multiple errors. only see one in array
    if (res.errors) {
      const status = res.errors[0].status;
      const detail = res.errors[0].detail;
      const cause = id;
      return {
        status,
        detail,
        cause,
      };
    }
    const title = res?.data.data.attributes.title.en;
    const altTitles = [];
    const altTitlesArr = res?.data.data.attributes.altTitles;
    for (let i = 0; i < altTitlesArr.length; i++) {
      if (altTitlesArr[i]["en"]) {
        altTitles.push(altTitlesArr[i]["en"]);
      } else if (altTitlesArr[i]["ja-ro"]) {
        altTitles.push(altTitlesArr[i]["ja-ro"]);
      }
    }
    return { title, altTitles };
  }

  static async searchMangadexManga(
    title: string
  ): Promise<searchMangadexMangaInterface[] | ErrorMessage> {
    const response: searchMangadexMangaInterface[] = [];
    const res = await this.request(`manga`, { title });

    if (res.errors) {
      const status = res.errors[0].status;
      const detail = res.errors[0].detail;
      const cause = title;
      return {
        status,
        detail,
        cause,
      };
    }
    const data = res?.data?.data;

    if (data.length) {
      for (let i = 0; i < data.length; i++) {
        const id = data[i]?.id;
        const title = data[i]?.attributes?.title.en;
        const link = `https://mangadex.org/title/${id}`;

        const altTitles = data[i]?.attributes?.altTitles
          ?.filter((title: { en: string }) => title.en)
          .map((title: { en: string }) => title.en);

        // const altTitles: string[] = [];

        // for (let j = 0; j < res[i]?.attributes?.altTitles.length; j++) {
        //   if ("en" in res[i]?.attributes?.altTitles[j]) {
        //     altTitles.push(res[i]?.attributes?.altTitles[j].en);
        //   }
        // }
        response.push({ id, title, link, altTitles });
      }
    }
    return response;
  }

  // not sure if i want to return title of manga its another promise request
  // date time should look like this  "2024-08-29T23:20:50"
  static async getMangadexFeed(
    limit: number,
    dateTime: string
  ): Promise<getMangadexFeedInterface> {
    // res?.data?.data gives chapter id then with data -> relationships for group and manganame
    const response = {
      data: [] as newMangaInterface[],
      errors: [] as ErrorMessage[],
    };
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const res = await this.request(`user/follows/manga/feed`, {
      translatedLanguage: ["en"],
      order: {
        updatedAt: "desc",
        readableAt: "desc",
        publishAt: "desc",
      },
      publishAtSince: dateTime,
      // updatedAtSince: dateTime,
      limit: limit,
    });
    //may need to loop if res.erros get multiple errors. only see one in array
    if (res.errors) {
      const status = res.errors[0].status;
      const detail = res.errors[0].detail;
      const cause = "something happened on the initial load";
      response.errors.push({
        status,
        detail,
        cause,
      });
      return response;
    }

    const resdata = res?.data?.data;

    if (resdata) {
      for (let i = 0; i < resdata.length; i++) {
        const manga = resdata[i];
        const chapterId = manga.id;
        const chapterNumber = manga?.attributes?.chapter;
        const link = `https://mangadex.org/title/${chapterId}`;
        // const mangaId = manga?.relationships
        //   .filter(
        //     (relationship: { id: string; type?: string }) =>
        //       relationship.type === "manga"
        //   )
        //   .map(
        //     (relationship: { id: string; type?: string }) => relationship.id
        //   );
        let mangaId;

        for (let j = 0; j < manga?.relationships.length; j++) {
          if (manga?.relationships[j]?.type === "manga") {
            mangaId = manga?.relationships[j].id;
          }
        }
        const mangaTitle = (await this.getMangadexManga(mangaId)) as any;
        await delay(210);

        if (mangaTitle.title) {
          const chapter = {
            link,
            chapterId,
            chapterNumber,
            mangaId,
            mangaTitle,
          };
          response.data.push(chapter);
        } else {
          response.errors.push(mangaTitle);
        }
      }
    }

    return response;
  }
}

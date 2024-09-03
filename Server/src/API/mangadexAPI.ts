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
    }
  }

  static async getMangadexTokens() {
    console.log("gmt");
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
      console.log(this.access_token);
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

  static async getMangadexManga(id: string) {
    const res = await this.request(`manga/${id}`);
    return res;
  }

  static async searchMangadexManga(
    title: string
  ): Promise<searchMangadexMangaInterface[]> {
    const res = await this.request(`manga`, { title }).then(
      (res) => res?.data?.data
    );

    const response = [];

    if (res.length) {
      for (let i = 0; i < res.length; i++) {
        const id = res[i]?.id as string;
        const title = res[i]?.attributes?.title.en as string;
        const link = `https://mangadex.org/title/${id}` as string;

        // const altTitles = res[i]?.attributes?.altTitles?.filter(title => title.en);
        const altTitles: string[] = [];
        for (let j = 0; j < res[i]?.attributes?.altTitles.length; j++) {
          if ("en" in res[i]?.attributes?.altTitles[j]) {
            altTitles.push(res[i]?.attributes?.altTitles[j].en);
          }
        }
        response.push({ id, title, link, altTitles });
      }
    }

    return response;
  }

  //like this "2024-08-29T23:20:50"
  static async getMangadexFeed(limit: number, dateTime: string) {
    // res?.data?.data gives chapter id then with data -> relationships for group and manganame
    const res = await this.request(`user/follows/manga/feed`, {
      translatedLanguage: ["en"],
      order: {
        updatedAt: "desc",
        readableAt: "desc",
        publishAt: "desc",
      },
      publishAt: dateTime,
      readableAt: dateTime,
      limit: limit,
    });

    // console.log(res?.data);

    // date time should look like this  2024-08-12T23:20:50
    // returns newest chapter maybe manga id and time of updates. proba want to compare last check is after last update to ping discord
    // create return type
    // console.log(res?.data?.data);
  }
}

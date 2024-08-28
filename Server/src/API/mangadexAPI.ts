"use strict";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export default class mangadexAPI {
  static BASE_URL = process.env.MANGADEX_BASE_URL;

  //   static authorizations: string;
  static access_token: string;
  static refresh_token: string;

  static async request(endpoint = "", data = {}, method = "get") {
    const headers = { "User-Agent": process.env.USER_AGENT };
    const url = `${this.BASE_URL}/${endpoint}`;
    const params = method === "get" ? data : {};

    try {
      return await axios({
        url,
        method,
        data,
        params,
        headers,
      });
    } catch (error: any) {
      console.error("api ERROR", error);
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
    } catch (error: any) {
      console.log(error);
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
      console.log("success");
    } catch (error: any) {
      console.log(error);
    }
  }

  static async getManga(id: string) {
    const res = await this.request(`manga/${id}`);
    return res;
  }

  static async searchManga(title: string) {
    const res = await this.request(`manga`, { title });
    return res;
  }
}

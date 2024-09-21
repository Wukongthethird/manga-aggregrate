"use strict";
import axios from "axios";

// this should be use to validate I guess
export default class mangaUpdatesAPI {
  static BASE_URL = process.env.MANGAUPDATES_BASE_URL;

  static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // errors check res?.status =="500 for somehting bad" 400 for bad

  static async request(endpoint = "", data = {}, method = "get") {
    const url = `${this.BASE_URL}/${endpoint}`;

    //CHECK LATER IF IT IS JSON BODY DOES NOT APPEAR SO
    const headers = {
      //   "User-Agent": process.env.USER_AGENT,
      "Content-Type": "application/x-www-form-urlencoded",
    };

    try {
      return await axios({
        url,
        method,
        data,
        headers,
      });
    } catch (error: any) {
      // console.log(error?.response);
      return error?.response;
    }
  }

  static async searchManga(title: string) {
    const data = { search: title };
    const mangapdatesRes = await this.request(`v1/series/search`, data, "post");
    const response = [];
    //return errors here
    if (mangapdatesRes.status === 500) {
      const apiErrors = mangapdatesRes.data;

      const status = apiErrors.status;
      const detail = apiErrors.reason;

      return { errors: [{ status, detail }] };
    }

    const searchresults = mangapdatesRes.data.results;
    if (searchresults) {
      for (let sr of searchresults) {
        const mangaId = sr?.record?.series_id;
        const title = sr?.record?.title;
        const imageURL = sr?.record?.image?.url?.original;
        const link = sr?.record?.url;

        response.push({ mangaId, title, imageURL, link });
      }
    }
    return response;
  }

  static async getManga(mangaId: string) {
    const mangapdatesRes = await this.request(`v1/series/${mangaId}`);

    if (mangapdatesRes.status === 500) {
      const apiErrors = mangapdatesRes.data;

      const status = apiErrors.status;
      const detail = apiErrors.reason;
      return { errors: [{ status, detail }] };
    }

    const mangaInfo = mangapdatesRes?.data;
    const title = mangaInfo.title;
    const link = mangaInfo.url;
    const imageURL = mangaInfo.image.url;
    const altTitles = [];
    if (mangaInfo?.associated) {
      for (let t of mangaInfo?.associated) {
        if (t.title.match(/[a-zA-Z0-9]/g)) {
          altTitles.push(t.title);
        }
      }
    }

    return { mangaId, title, link, imageURL, altTitles };
  }
}

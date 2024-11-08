"use strict";
import axios from "axios";
import mangadexAPI from "./mangadexAPI";

export interface searchMangaUpdatesResultsInterface {
  totalHits: number;
  perPage: number;
  page: number;
  results: mangaUpdatesManga[];
}

// export interface searchMangaUpdatesMangaInterface {
//   mangaId: string;
//   title: string;
//   imageURL: string;
//   link: string;
//   description: string;
// }

export interface errorMessageInterface {
  status: string;
  detail: string;
}

export interface errorsInterface {
  errors: errorMessageInterface[];
}

export interface mangaUpdatesManga {
  mangaId: string;
  title: string;
  link: string;
  imageURL: {
    original: string;
    thumb: string;
  };
  rating?: string;
  description?: string;
  altTitles?: string[];
  author?: string[];
  artist?: string[];
  publicationYear?: string;
  latestChapter?: string;
  completed?: string;
}

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

  static async searchManga(
    title: string,
    page: number = 1
  ): Promise<errorsInterface | searchMangaUpdatesResultsInterface> {
    const data = { search: title, page: page };
    const mangapdatesRes = await this.request(`v1/series/search`, data, "post");
    // console.log("api", mangapdatesRes.data);
    const response = {
      totalHits: 0,
      perPage: 0,
      page: 0,
      results: [] as mangaUpdatesManga[],
    };
    //return errors here
    if (mangapdatesRes.status === 500) {
      const apiErrors = mangapdatesRes.data;

      const status = apiErrors.status;
      const detail = apiErrors.reason;

      return { errors: [{ status, detail }] };
    }
    const totalHits = mangapdatesRes.data.total_hits;
    const perPage = mangapdatesRes.data.per_page;
    const muPage = mangapdatesRes.data.page;
    response.totalHits = totalHits ? totalHits : 0;
    response.perPage = perPage ? perPage : 0;
    response.page = muPage ? muPage : 0;
    const searchresults = mangapdatesRes.data.results;
    if (searchresults) {
      for (let sr of searchresults) {
        const mangaId = sr?.record?.series_id;
        const title = sr?.record?.title;
        const imageURL = sr?.record?.image?.url?.original;
        const link = sr?.record?.url;
        const description = sr?.record?.description;

        response.results.push({ mangaId, title, imageURL, link, description });
      }
    }
    return response;
  }

  static async getManga(
    mangaId: string
  ): Promise<errorsInterface | mangaUpdatesManga> {
    try {
      const mangapdatesRes = await this.request(`v1/series/${mangaId}`);

      if (mangapdatesRes.status === 404) {
        const status = mangapdatesRes.status;
        const detail = mangapdatesRes.statusText;
        return { errors: [{ status, detail }] };
      }

      if (mangapdatesRes.status === 500) {
        const status = mangapdatesRes.data;
        const detail = mangapdatesRes.statusText;
        return { errors: [{ status, detail }] };
      }

      const mangaInfo = mangapdatesRes?.data;

      const title = mangaInfo.title;
      const link = mangaInfo.url;
      const imageURL = mangaInfo?.image ? mangaInfo.image.url : "";
      const altTitles = [];
      const publicationYear = mangaInfo?.year ? mangaInfo?.year : "";
      const latestChapter = mangaInfo?.latest_chapter
        ? mangaInfo.latest_chapter
        : "";
      const rating = mangaInfo?.bayesian_rating
        ? `${mangaInfo?.bayesian_rating}`
        : "";
      const completed = mangaInfo?.completed ? mangaInfo.completed : "";

      if (mangaInfo?.associated) {
        for (let t of mangaInfo?.associated) {
          if (t.title.match(/[a-zA-Z0-9]/g)) {
            altTitles.push(t.title);
          }
        }
      }
      const author = [];
      const artist = [];
      if (mangaInfo?.authors) {
        for (let a of mangaInfo?.authors) {
          if (a.type == "Author") {
            if (a.name.includes("(") && a.name.includes(")")) {
              const tempAuthor = a.name.split(/[\(\)]/);
              for (const tAuthor of tempAuthor) {
                if (tAuthor) {
                  author.push(tAuthor.trim());
                }
              }
            }
            author.push(a.name.trim());
          }
          if (a.type == "Artist") {
            artist.push(a.name.trim());
          }
        }
      }

      return {
        mangaId,
        title,
        link,
        imageURL,
        altTitles,
        artist,
        author,
        rating,
        publicationYear,
        latestChapter,
        completed,
      };
    } catch (error: any) {
      console.log("getmangaupdatesAPI", error);
    }
    return { errors: [{ status: "400", detail: "something bad happened" }] };
  }
}

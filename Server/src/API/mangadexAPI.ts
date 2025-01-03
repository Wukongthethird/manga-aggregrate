"use strict";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

//clean up interfeace later for review rewrite so mangainterface is applicable to the data given in api
export interface mangadexMangaInterface {
  mangaId: string;
  title: title;
  link?: string;
  altTitles: title[];
  coverArtImageURL?: string;
  author?: string[];
  publicationYear?: string;
  lastChapter?: string;
  status?: string;

  //author and artist later if wanted
}
export interface authorWorks {
  authorId: string;
  name: string;
  mangaList: mangadexMangaInterface[];
}

// export interface getMangaInterface {
//   mangaId: string;
//   title?: string;
//   altTitles?: string[];
//   coverArtImageURL?: string;
// }

export interface title {
  [key: string]: string;
}

export interface newChapterInterface {
  chapterId: string;
  chapterNumber: string;
  manga: mangadexMangaInterface;
  link: string;
}

export interface getMangaFeedInterface {
  data: newChapterInterface[];
  // chapterId: string;
  // chapterNumber: string;
  // mangaId: string;
  // mangaTitle?: any;
  errors?: errorMessageInterface[];
}

export interface chapterInterface {
  chapterId: string;
  chapterNumber: string | undefined;
  totalPages: string;
  link: string;
}

export interface chapterListInterface {
  chapterList: chapterInterface[];
  errors?: errorMessageInterface[];
}

export interface errorMessageInterface {
  status: string;
  detail: string;
  cause?: string;
}

export interface errorsInterface {
  errors: errorMessageInterface[];
}

export interface mangadexChapterPages {
  result: string;
  baseUrl: string;
  chapter: {
    hash: string;
    data: string[];
    dataSaver: string[];
  };
}

export default class mangadexAPI {
  static BASE_URL = process.env.MANGADEX_BASE_URL;

  //   static authorizations: string;

  static access_token: string;
  static refresh_token: string;

  static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  static async request(endpoint = "", data = {}, method = "get", headers = {}) {
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
      // console.log(error?.response?.data);
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
      console.log("hereher", this.access_token);
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
      console.log("heere", this.access_token);
    } catch (error: any) {
      console.log(error.data.errors);
    }
  }

  static async getMangaDetails(
    mangaId: string
  ): Promise<errorsInterface | mangadexMangaInterface> {
    // const r = Math.random();
    // const url = r > 0.5 ? `manga/${id}` : `manga${id}`;
    const data = { includes: ["cover_art", "author"] };
    const res = await this.request(`manga/${mangaId}`, data);

    //may need to loop if res.erros get multiple errors. only see one in array
    if (res?.errors) {
      const status = res.errors[0].status;
      const detail = res.errors[0].detail;
      const cause = mangaId;
      return {
        errors: [
          {
            status,
            detail,
            cause,
          },
        ],
      };
    }

    //coverart iID no idea what its for but use file name for image

    const resData = res?.data?.data;

    const title = resData?.attributes?.title;
    const link = `https://mangadex.org/title/${mangaId}`;
    let coverArtImageURL;
    // const altTitles = [];
    let author: string[] = [];
    const altTitles = resData?.attributes?.altTitles;
    // for (let i = 0; i < altTitlesArr.length; i++) {
    //   if (altTitlesArr[i]["en"]) {
    //     altTitles.push(altTitlesArr[i]);
    //   } else if (altTitlesArr[i]["ja-ro"]) {
    //     altTitles.push(altTitlesArr[i]);
    //   }
    // }
    if (resData.relationships) {
      for (let i = 0; i < resData?.relationships.length; i++) {
        if (resData.relationships[i].type === "cover_art") {
          coverArtImageURL = resData.relationships[i].attributes.fileName;
        }
        if (resData.relationships[i].type === "author") {
          author.push(resData.relationships[i]?.attributes?.name);
        }
      }
    }
    return { mangaId, link, title, altTitles, author, coverArtImageURL };
  }

  static async searchManga(
    title: string
  ): Promise<errorsInterface | mangadexMangaInterface[]> {
    const response: mangadexMangaInterface[] = [];
    const data = { includes: ["cover_art"], title };
    const res = await this.request(`manga`, data);

    if (res.errors) {
      const status = res.errors[0].status;
      const detail = res.errors[0].detail;
      const cause = title;

      return {
        errors: [
          {
            status,
            detail,
            cause,
          },
        ],
      };
    }
    const resData = res?.data?.data;

    if (resData.length) {
      for (let i = 0; i < resData.length; i++) {
        const mangaId = resData[i]?.id;

        const title = resData[i]?.attributes?.title.en;

        const link = `https://mangadex.org/title/${mangaId}`;
        let coverArtImageURL;
        let author: string[] = [];
        const altTitles = resData[i]?.attributes?.altTitles
          ?.filter((title: { en: string }) => title.en)
          .map((title: { en: string }) => title.en);

        for (let j = 0; j < resData[i].relationships.length; j++) {
          if (resData[i].relationships[j]?.type == "cover_art") {
            coverArtImageURL = resData[i].relationships[j].attributes.fileName;
          }
        }

        response.push({
          mangaId,
          title,
          link,
          author,
          altTitles,
          coverArtImageURL,
        });
      }
    }
    return response;
  }

  static async searchAuthor(
    name: string
  ): Promise<errorsInterface | authorWorks> {
    const response = [] as any;
    //may need to keep going if author is less than 100
    let newOffset = 0;
    const data = { includes: ["manga"], name, limit: 100, offset: newOffset };
    let res = await this.request("author", data);

    if (res.errors) {
      const status = res.errors[0].status;
      const detail = res.errors[0].detail;

      return {
        errors: [
          {
            status,
            detail,
          },
        ],
      };
    }

    const resData = [...res?.data?.data];

    let totalAuthors = res?.data?.total;
    newOffset += res?.data?.data.length;

    while (newOffset < totalAuthors) {
      res = await this.request("author", data);

      if (res?.data?.data) {
        resData.push(...res?.data?.data);
        newOffset += res?.data?.data.length;
      }
    }

    if (resData.length) {
      for (let i = 0; i < resData.length; i++) {
        const authorId = resData[i]?.id;
        const name = resData[i]?.attributes?.name;
        // array of manga objects
        const mangaList = [] as any;
        const relationships = resData[i]?.relationships;

        if (relationships) {
          for (let r = 0; r < relationships.length; r++) {
            const mangaId = relationships[r].id ? relationships[r].id : "";
            const title = relationships[r]?.attributes?.title
              ? relationships[r]?.attributes?.title
              : "";
            const altTitles = relationships[r]?.attributes?.altTitles
              ? relationships[r]?.attributes?.altTitles
              : "";
            const publicationYear = relationships[r]?.attributes?.year
              ? relationships[r]?.attributes?.year
              : "";
            const status = relationships[r]?.attributes?.status
              ? relationships[r]?.attributes?.status
              : "";

            const lastChapter = relationships[r]?.attributes?.lastChapter
              ? relationships[r]?.attributes?.lastChapter
              : "";

            // console.log(year, failure);
            mangaList.push({
              mangaId,
              title,
              altTitles,
              publicationYear,
              status,
              lastChapter,
            });
          }
        }

        response.push({ authorId, name, mangaList });
      }
    }
    return response;
  }

  // maybe deprecated it does give you the page amount but i mean is that needed on a small personal project?
  static async getMangaChapter(chapterId: string) {
    const res = await this.request(`chapter/${chapterId}`);
    return res.data;
  }

  // api can only retrieve 100 chapters at a time will need to concat res

  // made a custome interface incase chapter is null
  static async getMangaChapterList(
    mangaId: string,
    limit: number = 100,
    end: number = 5000,
    start: number = 0
  ): Promise<chapterListInterface> {
    const response = {
      chapterList: [] as chapterInterface[],
      errors: [] as errorMessageInterface[],
    };

    if (start < 0 || end < 0 || end < start) {
      response.errors.push({ status: "400", detail: "input error" });
      return response;
    }

    let totalChapters;
    let newOffset = start;
    let searchCondition = true;

    while (searchCondition) {
      const body = {
        manga: mangaId,
        limit: limit,
        offset: newOffset,
        translatedLanguage: ["en"],
        contentRating: ["safe", "suggestive", "erotica", "pornographic"],
        order: {
          chapter: "desc",
        },
      };

      const res = await this.request(`chapter`, body);

      if (res.errors) {
        const status = res.errors[0].status;
        const detail = res.errors[0].detail;
        response.errors.push({ status, detail });
        return response;
      }

      let resData = res.data;

      totalChapters = resData.total;
      const realEnd = Math.min(end, totalChapters);

      if (resData.data) {
        newOffset += resData.data.length;
      }

      for (let i = 0; i < resData.data.length; i++) {
        const chapter = resData.data[i];
        const chapterId = chapter.id;
        const chapterNumber = chapter.attributes?.chapter;
        const totalPages = chapter.attributes?.pages;
        const readableAt = chapter.attributes?.readableAt;
        const link = `https://mangadex.org/chapter/${chapterId}`;

        response.chapterList.push({
          chapterId,
          chapterNumber,
          totalPages,
          link,
        });
        //early break to get out of while loop
        if (+chapterNumber >= realEnd || +chapterNumber >= totalChapters) {
          searchCondition = false;
          break;
        }
      }

      if (!resData.data || newOffset >= totalChapters || newOffset >= realEnd) {
        searchCondition = false;
      }
    }

    return response;
  }

  // maybe this should be front end
  static async getMangadeChapterPages(chapterId: string) {
    const res = await this.request(`at-home/server/${chapterId}`);

    if (res.hasOwnProperty("errors")) {
      return {
        errors: [
          { status: `${res.errors[0].status}`, detail: res.errors[0].detail },
        ],
      };
    }

    return res.data;
  }
  // might be the only api that requires the headers for the bearer. keep individual headers to function or maybe seperate request

  // not sure if i want to return title of manga its another promise request
  // date time should look like this  "2024-08-29T23:20:50"
  static async getMangaFeed(
    limit: number,
    dateTime: string
  ): Promise<getMangaFeedInterface> {
    const response = {
      data: [] as newChapterInterface[],
      errors: [] as errorMessageInterface[],
    };

    const headers = {
      "User-Agent": process.env.USER_AGENT,
      Authorization: `Bearer ${this.access_token}`,
    };

    const body = {
      translatedLanguage: ["en"],
      order: {
        updatedAt: "desc",
        readableAt: "desc",
        publishAt: "desc",
      },
      publishAtSince: dateTime,

      limit: limit,
    };
    const res = await this.request(
      `user/follows/manga/feed`,
      body,
      "get",
      headers
    );
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
    }

    const resData = res?.data?.data;

    if (resData) {
      for (let i = 0; i < resData.length; i++) {
        const chapter = resData[i];
        const chapterId = chapter.id;
        const chapterNumber = chapter?.attributes?.chapter;
        const link = `https://mangadex.org/chapter/${chapterId}`;
        let mangaId;

        for (let j = 0; j < chapter?.relationships.length; j++) {
          if (chapter?.relationships[j]?.type === "manga") {
            mangaId = chapter?.relationships[j].id;
          }
        }

        //updaye this later
        const manga = (await this.getMangaDetails(mangaId)) as any;

        await this.delay(210);

        if (manga.title) {
          const chapter = {
            link,
            chapterId,
            chapterNumber,
            manga,
          };
          response.data.push(chapter);
        } else {
          response.errors.push(manga);
        }
      }
    }

    return response;
  }
}

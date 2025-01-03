// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

class API {
  // for somereason it is not picking up env
  static BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  static async request(endpoint = "", data = {}, method = "Post") {
    const url = `${this.BASE_URL}/${endpoint}`;
    const params = method === "post" ? data : {};

    try {
      return await axios({
        url,
        method,
        data,
        params,
      });
    } catch (error: any) {
      console.log("API", error);
      return error?.response?.data;
    }
  }
  static async searchMangaUpdates(title: string, pageNumber: string) {
    const res = await API.request("searchmangaupdates", { title, pageNumber });
    return res;
  }

  // maybe have this call directly to api elsewhere?

  static async getmangaupdatesmangainfo(mangaId: string) {
    const res = await API.request("getmangaupdatesmangainfo", { mangaId });

    return res;
  }

  static async findmangaonmangadex(mangaId: string) {
    const res = await API.request("findmangaonmangadex", { mangaId });

    return res;
  }

  static async findmangaonmangasee123(site: string) {
    const res = await API.request("findmangaonmangasee123", { site });
    return res;
  }

  static async getmangadexpage(mangaId: string) {
    const res = await API.request("getmangadexpage", { mangaId });
    return res;
  }

  static async getmangasee123page(site: string) {
    const res = await API.request("getmangasee123page", { site });
    return res;
  }
  static async getmangadexchapterpages(mangadexChapterId: string) {
    const res = await API.request("getmangadexchapterpages", {
      mangadexChapterId,
    });
    return res;
  }

  static async getmangasee123chapterpages(
    mangasee123ChapterLink: string,
    mangaTitle: string,
    chapterNumber: string
  ) {
    const res = await API.request("getmangasee123chapterpages", {
      mangasee123ChapterLink,
      mangaTitle,
      chapterNumber,
    });

    return res;
  }
}
export default API;

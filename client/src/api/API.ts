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
    console.log("url", url);
    try {
      return await axios({
        url,
        method,
        data,
        params,
      });
    } catch (error) {
      console.log("API ERROR", error);
    }
  }
  static async searchMangaUpdates(title: string) {
    const res = await API.request("searchmangaupdates", { title });
    return res;
  }
}
export default API;

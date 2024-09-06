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
      console.log(error?.response);
      return error?.response?.data;
    }
  }

  static async searchManga(title: string) {
    const data = { search: title };
    const res = await this.request(`v1/series/search`, data, "Post");
    if (res.status == "500") {
      //     res.data: {
      //   status: 'exception',
      //   reason: 'An unexpected exception occurred. Please report to an admin.'
      // }
    }

    //array of big data
    if (res.data.results) {
    }

    console.log(res.data.results[0]);

    return res.results;
  }
  static async getManga(id: string) {
    const res = await this.request(`v1/series/search/${id}`);
    return res;
  }
}

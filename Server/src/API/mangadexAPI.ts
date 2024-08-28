"use strict";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export default class mangadexAPI {
  static BASE_URL = process.env.MANGADEX_BASE_URL;

  //   static authorizations: string;
  static access_token: string;
  static refresh_token: string;

  static async request(endpoint = "", data: {}, method = "get") {
    // const headers = {"User-Agent":}
  }
}

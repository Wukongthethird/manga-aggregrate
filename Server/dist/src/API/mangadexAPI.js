"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class mangadexAPI {
    static request() {
        return __awaiter(this, arguments, void 0, function* (endpoint = "", data = {}, method = "get") {
            var _a;
            const headers = {
                "User-Agent": process.env.USER_AGENT,
                Authorization: `Bearer ${this.access_token}`,
            };
            const url = `${this.BASE_URL}/${endpoint}`;
            const params = method === "get" ? data : {};
            try {
                return yield (0, axios_1.default)({
                    url,
                    method,
                    params,
                    headers,
                });
            }
            catch (error) {
                //   console.error("api ERROR", error);
                //mangadex api drilled error
                console.log((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data);
            }
        });
    }
    static getMangadexTokens() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("gmt");
            const creds = {
                grant_type: "password",
                username: process.env.MANGADEX_USERNAME,
                password: process.env.MANGADEX_PASSWORD,
                client_id: process.env.MANGADEX_CLIENT_ID,
                client_secret: process.env.MANGADEX_CLIENT_SECRET,
            };
            try {
                const res = yield (0, axios_1.default)({
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
            }
            catch (error) {
                console.log(error.data.errors);
            }
        });
    }
    static refreshMangadexTokens() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!this.refresh_token) {
                yield this.getMangadexTokens();
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
                const res = yield (0, axios_1.default)({
                    method: "POST",
                    url: "https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/token",
                    data: creds,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "User-Agent": process.env.USER_AGENT,
                    },
                });
                this.access_token = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.access_token;
                this.refresh_token = res === null || res === void 0 ? void 0 : res.data.refresh_token;
            }
            catch (error) {
                console.log(error.data.errors);
            }
        });
    }
    static getMangadexManga(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.request(`manga/${id}`);
            return res;
        });
    }
    static searchMangadexManga(title) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const res = yield this.request(`manga`, { title }).then((res) => { var _a; return (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.data; });
            console.log((_a = res[0]) === null || _a === void 0 ? void 0 : _a.attributes.altTitles);
            // const response = {};
            // if (res.length) {
            //   for (let i = 0; i < res.length; i++) {
            //     const id = res[i]?.id;
            //     const title = res[i]?.attributes?.title.en;
            //   }
            // }
            return res;
        });
    }
    //like this "2024-08-29T23:20:50"
    static getMangadexFeed(dateTime) {
        return __awaiter(this, void 0, void 0, function* () {
            // res?.data?.data gives chapter id then with data -> relationships for group and manganame
            const res = yield this.request(`user/follows/manga/feed`, {
                translatedLanguage: ["en"],
                order: {
                    updatedAt: "desc",
                    readableAt: "desc",
                    publishAt: "desc",
                },
                publishAt: dateTime,
                readableAt: dateTime,
                limit: 20,
            });
            // console.log(res?.data);
            // date time should look like this  2024-08-12T23:20:50
            // returns newest chapter maybe manga id and time of updates. proba want to compare last check is after last update to ping discord
            // create return type
            // console.log(res?.data?.data);
        });
    }
}
mangadexAPI.BASE_URL = process.env.MANGADEX_BASE_URL;
exports.default = mangadexAPI;

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
const express_1 = __importDefault(require("express"));
const corsConfig_1 = __importDefault(require("./src/configs/corsConfig"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
//middleware import
const errorHandler_1 = __importDefault(require("./src/middlewares/errorHandler"));
const mangadexAPI_1 = __importDefault(require("./src/API/mangadexAPI"));
// configures dotenv to work in your application
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
console.log(PORT);
//Middlewares
app.use((0, cors_1.default)(corsConfig_1.default));
app.use(express_1.default.json());
// app.use(  json())
app.get("/", (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield mangadexAPI_1.default.refreshMangadexTokens();
    yield mangadexAPI_1.default.getMangadexFeed("2024-08-29T23:20:50");
    // const res = await mangadexAPI.searchManga("Kichiku Eiyuu");
    // console.log("res", res?.data?.data);
    const manga = yield mangadexAPI_1.default.searchMangadexManga("hero");
    const out = defaultdict();
    response.status(200).send("Hello World");
}));
app.use(errorHandler_1.default);
app.listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
});

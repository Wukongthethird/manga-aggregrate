import API from "@/api/API";
import Download from "./download";
import axios from "axios";

const MangadexSingleChapterDownload = async (
  mangadexChapterId: string,
  chapterNumber: string,
  mangaTitle: string
) => {
  if (!mangadexChapterId) {
    return;
  }

  const mangaChapterPages = await API.getmangadexchapterpages(
    mangadexChapterId
  );

  if (!mangaChapterPages || mangaChapterPages?.data?.errors) {
    return;
  }

  if (mangaChapterPages?.data?.chapter?.data) {
    const baseURL = mangaChapterPages?.data.baseUrl;
    const hash = mangaChapterPages?.data?.chapter?.hash;

    const URLS = mangaChapterPages?.data?.chapter?.data.map((url: string) => {
      return `${baseURL}/data/${hash}/${url}`;
    });

    // const response = await axios.get(URLS[0], {
    //   responseType: "blob",
    // });
    // console.log("here", response.data);
    try {
      await Download(URLS, mangaTitle, chapterNumber);
    } catch (error) {}
  }
};
export default MangadexSingleChapterDownload;

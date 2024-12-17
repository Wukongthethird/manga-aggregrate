import API from "@/api/API";
import Download from "./Download";
import axios from "axios";
import JSZip from "jszip";
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

 

    await Download(URLS, mangaTitle, chapterNumber);
  }
};
export default MangadexSingleChapterDownload;

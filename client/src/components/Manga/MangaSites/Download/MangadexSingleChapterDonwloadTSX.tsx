import API from "@/api/API";
import React, { useRef, useState, useEffect } from "react";
import { Interface } from "readline";

type MangadexSingleChapterDonwloadProps = {
  chapterNumber: string;
  mangadexChapterId: string;
  mangaTitle: string;
};

interface mangadexChapterPages {
  result: string;
  baseUrl: string;
  chapter: {
    hash: string;
    data: string[];
    dataSaver: string[];
  };
}

interface error {
  status: string;
  detail: string;
}
interface mangadexChapterError {
  errors: error[];
}

const MangadexSingleChapterDonwload: React.FC<
  MangadexSingleChapterDonwloadProps
> = ({ chapterNumber, mangadexChapterId, mangaTitle }) => {
  if (!mangadexChapterId || mangaTitle) {
    return;
  }
  const [mangaChapterPages, setMangaChapterPages] = useState<
    mangadexChapterError | mangadexChapterPages
  >({
    result: "",
    baseUrl: "",
    chapter: {
      hash: "",
      data: [],
      dataSaver: [],
    },
  });

  useEffect(() => {
    const fetchPages = async () => {
      const mangaChapterPages = await API.getmangadexchapterpages(
        mangadexChapterId
      );
      if (mangaChapterPages?.data?.errors || mangaChapterPages?.data?.result) {
        setMangaChapterPages(mangaChapterPages.data);
      }
    };
    fetchPages();
  }, []);

  console.log(mangaChapterPages);
  return <div>Have a good coding</div>;
};
export default MangadexSingleChapterDonwload;

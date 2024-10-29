import React, { useState, useEffect } from "react";
import API from "@/api/API";
import MangaSite from "@/layout/MangaSite";
import { Box, Stack } from "@chakra-ui/react";
import MangaChapterList from "./MangaChapterList";
import MangaMetadata from "./MangaMetadata";
import MangaChapterRow from "./MangaChapterRow";

interface MangadexChapter {
  chapterId: string;
  link: string;
  chapterNumber: string;
  totalPages: number;
}

interface MangadexAltTitles {
  [key: string]: string;
}

interface MangadexMangaInfo {
  mangaId: string;
  altTitles?: MangadexAltTitles[];
  author: string[];
  coverArtImageURL?: string;
  title: {
    [key: string]: string;
  };
}

interface MangadexChapterListProps {
  mangaId: string;
}

interface MangadexManga {
  chapters: MangadexChapter[];
  manga: MangadexMangaInfo;
}

const MangadexChapterList: React.FC<MangadexChapterListProps> = ({
  mangaId,
}) => {
  const [mangadexMangaId, setMangadexMangaId] = useState<string>("");
  const [mangadexManga, setMangadexManga] = useState<MangadexManga>({
    chapters: [],
    manga: {
      mangaId: "",
      altTitles: [],
      author: [],
      coverArtImageURL: "",
      title: {},
    },
  });

  useEffect(() => {
    const fetchMangadexId = async () => {
      setLoading(true);
      try {
        const mangadexRes = await API.findmangaonmangadex(mangaId);

        if (mangadexRes && mangadexRes.data) {
          setMangadexMangaId(
            mangadexRes.data.mangadexMangaId
              ? mangadexRes.data.mangadexMangaId
              : ""
          );
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    fetchMangadexId();
  }, []);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchMangadexInfo = async () => {
      setLoading(true);
      if (mangadexMangaId) {
        try {
          const mangadexRes = await API.getmangadexpage(mangadexMangaId);

          if (mangadexRes && mangadexRes?.data) {
            // console.log("useEffect if", mangadexRes);
            setMangadexManga(
              mangadexRes.data
                ? mangadexRes.data
                : {
                    chapters: [],
                    manga: {
                      mangaId: "",
                      altTitles: [],
                      author: [],
                      coverArtImageURL: "",
                      title: {},
                    },
                  }
            );
          }
        } catch (error) {
          console.log(error);
        }
      }
      setLoading(false);
    };
    fetchMangadexInfo();
  }, [mangadexMangaId]);

  return (
    <MangaSite>
      <>
        {mangadexManga.manga.title && (
          <MangaMetadata
            coverArtImageURL={`https://uploads.mangadex.org/covers/${mangadexMangaId}/${mangadexManga.manga.coverArtImageURL}`}
            title={Object.values(mangadexManga.manga.title)[0] as string}
            author={mangadexManga.manga.author}
          />
        )}
      </>
      <>
        {mangadexManga.chapters && (
          <MangaChapterList chaptersList={mangadexManga.chapters} />
        )}
      </>
    </MangaSite>
  );
};
export default MangadexChapterList;

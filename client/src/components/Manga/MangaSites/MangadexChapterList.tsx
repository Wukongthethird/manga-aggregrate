import React, { useState, useEffect } from "react";
import API from "@/api/API";
import MangaSite from "@/layout/MangaSite";
import { Box, Skeleton, Stack } from "@chakra-ui/react";
import MangaChapterList from "./MangaChapterList";
import MangaMetadata from "./MangaMetadata";
import MangaChapterRow from "./MangaChapterRow";
import NotFound from "../NotFound";
import CouldNotFindMangaSite from "../CouldNotFindMangaSite";
import MangadexMultiChapterDownload from "./Download/MangadexMultiChapterDownload";

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
  link: string;
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
  // const [mangadexMangaId, setMangadexMangaId] = useState<string>("");
  const [mangadexManga, setMangadexManga] = useState<MangadexManga>({
    chapters: [],
    manga: {
      mangaId: "",
      altTitles: [],
      author: [],
      coverArtImageURL: "",
      title: {},
      link: "",
    },
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // useEffect(() => {
  //   const fetchMangadexId = async () => {
  //     // try {
  //     const mangadexRes = await API.findmangaonmangadex(mangaId);
  //     if (!mangadexRes) {
  //       setError("Something bad happened");
  //     }

  //     if (mangadexRes?.errors) {
  //       setError(`${mangadexRes?.errors[0]?.message}`);
  //     }

  //     if (mangadexRes && mangadexRes.data) {
  //       setMangadexMangaId(
  //         mangadexRes.data.mangadexMangaId
  //           ? mangadexRes.data.mangadexMangaId
  //           : ""
  //       );
  //     }
  //     // } catch (error) {
  //     //   console.log(error);
  //     // }
  //   };

  //   fetchMangadexId();
  // }, []);

  // useEffect(() => {
  //   const fetchMangadexInfo = async () => {
  //     if (mangadexMangaId) {
  //       // try {
  //       const mangadexRes = await API.getmangadexpage(mangadexMangaId);

  //       if (mangadexRes && mangadexRes?.data) {
  //         // console.log("useEffect if", mangadexRes);
  //         setMangadexManga(
  //           mangadexRes.data
  //             ? mangadexRes.data
  //             : {
  //                 chapters: [],
  //                 manga: {
  //                   mangaId: "",
  //                   altTitles: [],
  //                   author: [],
  //                   coverArtImageURL: "",
  //                   title: {},
  //                 },
  //               }
  //         );
  //       }
  //       // } catch (error) {
  //       //   console.log("error", error);
  //       // }
  //     }
  //     setLoading(false);
  //   };
  //   fetchMangadexInfo();
  // }, [mangadexMangaId]);

  useEffect(() => {
    const fetchMangadexInfo = async () => {
      // try {
      setLoading(true);
      const mangadexId = await API.findmangaonmangadex(mangaId);
      if (!mangadexId) {
        setError("Something bad happened");
      }

      if (mangadexId?.errors) {
        setError(`${mangadexId?.errors[0]?.message}`);
      }

      if (mangadexId?.data?.mangadexMangaId) {
        const mangadexRes = await API.getmangadexpage(
          mangadexId.data?.mangadexMangaId
        );

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
        // } catch (error) {
        //   console.log("error", error);
        // }
      }
      setLoading(false);
    };
    fetchMangadexInfo();
  }, []);
  console.log(mangadexManga);
  if (error) {
    return <CouldNotFindMangaSite />;
  }

  return (
    <>
      {loading ? (
        <>"fetching"..</>
      ) : (
        <>
          <MangaSite>
            <>
              {mangadexManga.manga.title && (
                <>
                  <MangaMetadata
                    coverArtImageURL={`https://uploads.mangadex.org/covers/${mangadexManga.manga.mangaId}/${mangadexManga.manga.coverArtImageURL}`}
                    title={
                      Object.values(mangadexManga.manga.title)[0] as string
                    }
                    author={mangadexManga.manga.author}
                    link={mangadexManga.manga.link}
                  />
                  <MangadexMultiChapterDownload />
                </>
              )}
            </>
            <>
              {mangadexManga.chapters && (
                <>
                  <MangaChapterList
                    chaptersList={mangadexManga.chapters}
                    mangaTitle={Object.values(mangadexManga.manga.title)[0]}
                  />
                </>
              )}
            </>
          </MangaSite>
        </>
      )}
    </>
  );
};
export default MangadexChapterList;

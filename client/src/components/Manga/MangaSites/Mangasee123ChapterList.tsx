import React, { useState, useEffect } from "react";
import API from "@/api/API";
import MangaSite from "@/layout/MangaSite";
import MangaChapterList from "./MangaChapterList";
import MangaMetadata from "./MangaMetadata";
import { Img } from "@chakra-ui/react";
import CouldNotFindMangaSite from "../CouldNotFindMangaSite";

type Mangasee123ChapterListProps = {
  mangaId: string;
};

interface Mangasee123Chapter {
  link: string;
  chapterNumber: string;
  date: number;
}

interface Mangasee123Info {
  site: string;
  author: string[];
  coverArtImageURL?: string;
  title: string;
}

interface Mangasee123Manga {
  manga: Mangasee123Info;
  chapters: Mangasee123Chapter[];
}

const Mangasee123ChapterList: React.FC<Mangasee123ChapterListProps> = ({
  mangaId,
}) => {
  const [mangasee123Link, setMangasee123Link] = useState<string>("");
  const [mangasee123Manga, setMangasee123Manga] = useState<Mangasee123Manga>({
    manga: {
      site: "",
      author: [],
      coverArtImageURL: "",
      title: "",
    },
    chapters: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchMangasee123Link = async () => {
      setLoading(true);

      const mangasee123Res = await API.findmangaonmangasee123(mangaId);

      if (!mangasee123Res) {
        setError("Something Bad Happened");
      }

      if (mangasee123Res?.errors) {
        setError(`${mangasee123Res?.errors[0]?.message}`);
      }

      if (mangasee123Res && mangasee123Res.data) {
        setMangasee123Link(
          mangasee123Res.data.mangasee123Link
            ? mangasee123Res.data.mangasee123Link
            : ""
        );
      }

      setLoading(false);
    };

    fetchMangasee123Link();
  }, []);

  // useEffect(() => {
  //   const fetchmangasee123Info = async () => {
  //     setLoading(true);
  //     if (mangasee123Link) {
  //       const mangasee123Res = await API.getmangasee123page(mangasee123Link);

  //       if (mangasee123Res && mangasee123Res?.data) {
  //         setMangasee123Manga(
  //           mangasee123Res.data
  //             ? mangasee123Res.data
  //             : {
  //                 manga: {
  //                   site: "",
  //                   author: [],
  //                   coverArtImageURL: "",
  //                   title: "",
  //                 },
  //                 chapters: [],
  //               }
  //         );
  //       }
  //     }
  //     setLoading(false);
  //   };
  //   fetchmangasee123Info();
  // }, [mangasee123Link]);

  useEffect(() => {
    const fetchmangasee123Info = async () => {
      setLoading(true);
      setLoading(true);

      const mangasee123Site = await API.findmangaonmangasee123(mangaId);

      if (!mangasee123Site) {
        setError("Something Bad Happened");
      }

      if (mangasee123Site?.errors) {
        setError(`${mangasee123Site?.errors[0]?.message}`);
      }

      if (mangasee123Site.data?.mangasee123Link) {
        const mangasee123Res = await API.getmangasee123page(
          mangasee123Site.data?.mangasee123Link
        );

        if (mangasee123Res?.data) {
          setMangasee123Manga(
            mangasee123Res.data
              ? mangasee123Res.data
              : {
                  manga: {
                    site: "",
                    author: [],
                    coverArtImageURL: "",
                    title: "",
                  },
                  chapters: [],
                }
          );
        }
      }

      setLoading(false);
    };
    fetchmangasee123Info();
  }, [mangasee123Link]);

  if (loading) {
    return <>fetching</>;
  }
  if (error) {
    return <CouldNotFindMangaSite />;
  }
  return (
    <MangaSite>
      <>
        {mangasee123Manga.manga.title && (
          <MangaMetadata
            coverArtImageURL={mangasee123Manga.manga.coverArtImageURL}
            title={mangasee123Manga.manga.title}
            author={mangasee123Manga.manga.author}
            link={mangasee123Manga.manga.site}
          />
        )}
      </>

      <>
        {mangasee123Manga.chapters && (
          <MangaChapterList
            chaptersList={mangasee123Manga.chapters}
            mangaTitle={mangasee123Manga.manga.title}
          />
        )}
      </>
    </MangaSite>
  );
};
export default Mangasee123ChapterList;

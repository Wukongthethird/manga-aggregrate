import React, { useState, useEffect } from "react";
import API from "@/api/API";

type MangadexChapterListProps = {
  mangaId: string;
};

const MangadexChapterList: React.FC<MangadexChapterListProps> = ({
  mangaId,
}) => {
  const [mangadexMangaId, setMangadexMangaId] = useState<string>("");

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

  useEffect(() => {
    const fetchMangadexInfo = async () => {
      setLoading(true);
      if (mangadexMangaId) {
        try {
          const mangadexRes = await API.getmangadexpage(mangadexMangaId);
          console.log("res", mangadexRes);
          // if (mangadexRes && mangadexRes.data) {
          //   setMangadexMangaId(
          //     mangadexRes.data.mangadexMangaId
          //       ? mangadexRes.data.mangadexMangaId
          //       : ""
          //   );
          // }
        } catch (error) {
          console.log(error);
        }
      }
      setLoading(false);
    };
    fetchMangadexInfo();
  }, [mangadexMangaId]);

  console.log("chapterlist", mangadexMangaId);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  return <div>Have a good mangadex</div>;
};
export default MangadexChapterList;

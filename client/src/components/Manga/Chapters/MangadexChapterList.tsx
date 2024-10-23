import React, { useState, useEffect } from "react";

type MangadexChapterListProps = {
  mangaId: string;
};

const MangadexChapterList: React.FC<MangadexChapterListProps> = ({
  mangaId,
}) => {
  const [mangadexMangaId, setMangadexMangaId] = useState<string>("");
  useEffect(() => {
    const fetchMangaUpdatesData = async () => {
      try {
        // const res = await API.getmangaupdatesmangainfo(mangaId);
        // if (res && res.data) {
        //   setMangaUpdatesInfo(res.data);
        // }
      } catch (error) {
        console.log(error);
      }
    };

    fetchMangaUpdatesData();
  }, []);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  return <div>Have a good mangadex</div>;
};
export default MangadexChapterList;

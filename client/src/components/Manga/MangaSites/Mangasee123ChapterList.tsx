import React, { useState, useEffect } from "react";
import API from "@/api/API";

type Mangasee123ChapterListProps = {
  mangaId: string;
};

const Mangasee123ChapterList: React.FC<Mangasee123ChapterListProps> = ({
  mangaId,
}) => {
  const [mangasee123Link, setMangasee123Link] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchMangasee123Link = async () => {
      setLoading(true);
      try {
        const mangasee123Res = await API.findmangaonmangasee123(mangaId);
        console.log(mangasee123Res);

        if (mangasee123Res && mangasee123Res.data) {
          setMangasee123Link(
            mangasee123Res.data.mangasee123Link
              ? mangasee123Res.data.mangasee123Link
              : ""
          );
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    fetchMangasee123Link();
  }, []);

  console.log("mangasee123Link", mangasee123Link);
  return <div>Have a good mangasee123</div>;
};
export default Mangasee123ChapterList;

import React, { useEffect, useState } from "react";
import API from "@/api/API";
import MangaSiteContainer from "./MangaSites/MangaSiteContainer";

type mangaInfoProps = {
  mangaId: string;
};

interface mangaUpdatesRes {
  mangaId: string;
  title: string;
  link: string;
  imageURL: {
    original: string;
    thumb: string;
  };
  altTitles: string[];
  artist: string[];
  author: string[];
}

export interface errorMessageInterface {
  status: string;
  detail: string;
}

export interface errorsInterface {
  errors: errorMessageInterface[];
}

const MangaInfo: React.FC<mangaInfoProps> = ({ mangaId }) => {
  console.log("mangaId", mangaId);
  const [mangaUpdatesInfo, setMangaUpdatesInfo] = useState<mangaUpdatesRes>({
    mangaId: "",
    title: "",
    link: "",
    imageURL: {
      original: "",
      thumb: "",
    },
    altTitles: [],
    artist: [],
    author: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchMangaUpdatesData = async () => {
      setLoading(true);
      try {
        const res = await API.getmangaupdatesmangainfo(mangaId);
        if (res && res.data) {
          setMangaUpdatesInfo(res.data);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    fetchMangaUpdatesData();
  }, []);

  if (loading) {
    return "...fetching data";
  }
  return (
    <>
      <div>thiggg</div>
      <MangaSiteContainer mangaId={mangaId} />
    </>
  );
};
export default MangaInfo;

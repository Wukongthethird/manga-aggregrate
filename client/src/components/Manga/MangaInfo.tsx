import React, { useState } from "react";

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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  console.log(mangaUpdatesInfo);
  return <div>Have a good coding</div>;
};
export default MangaInfo;

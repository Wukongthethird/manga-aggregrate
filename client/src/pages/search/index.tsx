import React from "react";

import SearchPage from "@/components/Search/SearchPage";

export interface searchMangaUpdatesInterface {
  mangaId: string;
  title: string;
  imageURL: string;
  link: string;
  description: string;
}

const Page: React.FC = () => {
  console.log("found");
  return (
    <>
      <SearchPage />
    </>
  );
};
export default Page;

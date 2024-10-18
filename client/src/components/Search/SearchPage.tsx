import React, { useState } from "react";
import SearchBar from "@/components/Search/SearchBar";
import { Flex, Box } from "@chakra-ui/react";
import SearchResults from "./SearchResults";

export interface searchMangaUpdatesInterface {
  totalHits: number;
  perPage: number;
  page: number;
  results: mangaUpdatesManga[];
}

export interface mangaUpdatesManga {
  mangaId: string;
  title: string;
  link: string;
  imageURL: string;
  description?: string;
  altTitles?: string[];
  author?: string[];
  artist?: string[];
}

//pass loading and errors to search bar render out results here
const SearchPage: React.FC = () => {
  const [searchResult, setSearchResult] = useState<mangaUpdatesManga[]>([]);
  const [totalHits, setTotalHits] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  console.log("search", searchResult);

  return (
    <Box alignContent={"center"}>
      <SearchBar
        setSearchResult={setSearchResult}
        setLoading={setLoading}
        setError={setError}
        setTotalHits={setTotalHits}
        setPerPage={setPerPage}
      />
      <Flex
        // bg="red.500"
        // height={"50px"}
        justifyContent={"center"}
        padding="6 12"
        justify={{ md: "space-between" }}
        align="center"
      >
        {searchResult && <SearchResults searchResult={searchResult} />}
      </Flex>
    </Box>
  );
};
export default SearchPage;

import React, { useState } from "react";
import SearchBar from "@/components/Search/SearchBar";
import { Flex, Box } from "@chakra-ui/react";
import SearchResults from "./SearchResults";
import API from "@/api/API";

export interface searchMangaUpdatesInterface {
  totalHits: number;
  perPage: number;
  page: string;
  results: mangaUpdatesMangaInterface[];
}

export interface mangaUpdatesMangaInterface {
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
  const [searchResult, setSearchResult] = useState<
    mangaUpdatesMangaInterface[]
  >([]);
  const [totalHits, setTotalHits] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(0);
  const [page, setPage] = useState<string>("1");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  // const [lockSearch,setLockSearch] = useState<boolean>(false)
  const [lockTerm, setLockTerm] = useState<string>("");

  const onSearchSubmit = async () => {
    setLoading(true);
    try {
      const res = await API.searchMangaUpdates(searchTerm, page);

      if (!res) {
        setError("server is down");
      } else if (res?.data?.errors) {
        setError("something is down on mangaUpdates");
      } else {
        setSearchResult(res.data.results);
        setTotalHits(res.data.totalHits);
        setPerPage(res.data.perPage);

        setLockTerm(searchTerm);
      }
    } catch (error) {
      console.log("SEARCHBARAPI ERROR", error);
      // setError(`${error}`)
    }
    setLoading(false);
  };

  const onPageSubmit = async () => {
    setLoading(true);
    try {
      const res = await API.searchMangaUpdates(lockTerm, page);

      if (!res) {
        setError("server is down");
      } else if (res?.data?.errors) {
        setError("something is down on mangaUpdates");
      } else {
        setSearchResult(res.data.results);
        setTotalHits(res.data.totalHits);
        setPerPage(res.data.perPage);
      }
    } catch (error) {
      console.log("SEARCHBARAPI ERROR", error);
      // setError(`${error}`)
    }
    setLoading(false);
  };

  return (
    <Box alignContent={"center"}>
      <SearchBar
        // setSearchResult={setSearchResult}
        // setLoading={setLoading}
        // setError={setError}
        // setTotalHits={setTotalHits}
        // setPerPage={setPerPage}

        setSearchTerm={setSearchTerm}
        onSubmit={onSearchSubmit}
      />

      {searchResult.length != 0 && (
        <Flex
          // bg="red.500"
          // height={"50px"}
          justifyContent={"center"}
          padding="6 12"
          justify={{ md: "space-between" }}
          align="center"
        >
          <SearchResults
            setPage={setPage}
            onSubmit={onPageSubmit}
            searchResult={searchResult}
            perPage={perPage}
            totalHits={totalHits}
            page={page}
          />
        </Flex>
      )}
    </Box>
  );
};

export default SearchPage;

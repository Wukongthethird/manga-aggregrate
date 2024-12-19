import React, { useState } from "react";
import SearchBar from "@/components/Search/SearchBar";
import { Flex, Box, Spinner, Center } from "@chakra-ui/react";
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
  const [lockTerm, setLockTerm] = useState<string>("");

  const onSearchSubmit = async (term: string) => {
    setLoading(true);
    try {
      const res = await API.searchMangaUpdates(term, "1");

      if (!res) {
        setError("server is down");
      } else if (res?.data?.errors) {
        setError("something is down on mangaUpdates");
      } else {
        setPage("1");
        setSearchResult(res.data.results);
        setTotalHits(res.data.totalHits);
        setPerPage(res.data.perPage);

        setLockTerm(term);
      }
    } catch (error) {
      console.log("SEARCHBARAPI ERROR", error);
      // setError(`${error}`)
    }
    setLoading(false);
  };

  const onPageSubmit = async () => {
    setLoading(true);
    let truePage = page;
    try {
      if (+page < 1) {
        truePage = "1";
      } else if (+page > Math.ceil(totalHits / perPage)) {
        truePage = `${Math.ceil(totalHits / perPage)}`;
      }
      const res = await API.searchMangaUpdates(lockTerm, truePage);

      if (!res) {
        setError("server is down");
      } else if (res?.data?.errors) {
        setError("something is down on mangaUpdates");
      } else {
        setSearchResult(res.data.results);
        setTotalHits(res.data.totalHits);
        setPerPage(res.data.perPage);
        setPage(truePage);
      }
    } catch (error) {
      console.log("SEARCHBARAPI ERROR", error);
      // setError(`${error}`)
    }
    setLoading(false);
  };

  return (
    <Box alignContent={"center"}>
      <SearchBar onSubmit={onSearchSubmit} />
      {loading && (
        <Center>
          <Spinner
            color="red.500"
            css={{ "--spinner-track-color": "colors.blue.200" }}
            w={100}
            h={100}
            borderWidth="12px"
          />
        </Center>
      )}
      {searchResult.length != 0 && !loading && (
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

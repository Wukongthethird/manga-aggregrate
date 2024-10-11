import React, { useState } from "react";
import SearchBar from "@/components/Search/SearchBar";
import { Flex, Box } from "@chakra-ui/react";
import SearchResults from "./SearchResults";

export interface searchMangaUpdatesInterface {
  mangaId: string;
  title: string;
  imageURL: string;
  link: string;
}

//pass loading and errors to search bar render out results here
const SearchPage: React.FC = () => {
  const [searchResult, setSearchResult] = useState<
    searchMangaUpdatesInterface[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  console.log("search", searchResult);

  return (
    <Box alignContent={"center"}>
      <SearchBar
        setSearchResult={setSearchResult}
        setLoading={setLoading}
        setError={setError}
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

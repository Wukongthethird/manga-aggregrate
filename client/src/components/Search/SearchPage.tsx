import React, { useState } from "react";
import SearchBar from "@/components/Search/SearchBar";
import { Flex, Box } from "@chakra-ui/react";

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

  return (
    <Flex
      bg="red.500"
      height={"50px"}
      padding="6 12"
      justify={{ md: "space-between" }}
      align="center"
    >
      <SearchBar
        setSearchResult={setSearchResult}
        setLoading={setLoading}
        setError={setError}
      />
    </Flex>
  );
};
export default SearchPage;

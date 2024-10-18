import React from "react";
import { Stack } from "@chakra-ui/react";
import SearchThumbnail from "./SearchThumbnail";
import { mangaUpdatesManga } from "./SearchPage";

type SearchResultProps = {
  searchResult: mangaUpdatesManga[];
};

const SearchResult: React.FC<SearchResultProps> = ({ searchResult }) => {
  return (
    <Stack width={"75%"} justify={"center"} mt={"20px"}>
      {searchResult.map((item) => {
        return (
          <SearchThumbnail
            key={item.mangaId}
            title={item.title}
            imageURL={item.imageURL}
            mangaId={item.mangaId}
            link={item.link}
          />
        );
      })}
    </Stack>
  );
};
export default SearchResult;

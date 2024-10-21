import React, { useState } from "react";
import { Stack, Input, Flex, Box } from "@chakra-ui/react";
import SearchThumbnail from "./SearchThumbnail";
import { mangaUpdatesManga } from "./SearchPage";

type SearchResultProps = {
  searchResult: mangaUpdatesManga[];
  totalHits: number;
  perPage: number;
  page: string;
  // lockedSearchTerm: string;
  setPage: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
};

const SearchResult: React.FC<SearchResultProps> = ({
  searchResult,
  totalHits,
  perPage,
  page,
  setPage,
  onSubmit,
}) => {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(event.target.value);
  };

  return (
    <Stack width={"75%"} justify={"center"} mt={"20px"}>
      <Flex>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <Input defaultValue={page} onChange={onChange} />
        </form>
        <Box>{Math.ceil(totalHits / perPage)}</Box>
      </Flex>

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

import React, { useState } from "react";
import { Stack, Input, Flex, Box, Text, SimpleGrid } from "@chakra-ui/react";
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
    <Stack width={"85%"} justify={"center"} mt={"20px"}>
      <Flex alignContent={"center"} textAlign={"center"}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <input
            style={{
              width: "35px",
              border: "1px solid",
              backgroundColor: "none",
            }}
            onChange={onChange}
            value={page}
            type="number"

            // min={1}
            // max={Math.ceil(totalHits / perPage)}
          />
        </form>
        <Text ml="2px">/</Text>
        <Text ml="2px">{Math.ceil(totalHits / perPage)}</Text>
      </Flex>
      <SimpleGrid columns={[1, 2]} gap={10}>
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
      </SimpleGrid>
    </Stack>
  );
};
export default SearchResult;

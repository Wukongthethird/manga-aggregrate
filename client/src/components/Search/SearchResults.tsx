import React, { useState } from "react";
import { Stack, Input, Flex, Box, Text, SimpleGrid } from "@chakra-ui/react";
import SearchThumbnail from "./SearchThumbnail";
import { mangaUpdatesManga } from "./SearchPage";

type SearchResultProps = {
  searchResult: mangaUpdatesManga[];

  // lockedSearchTerm: string;
};

const SearchResult: React.FC<SearchResultProps> = ({ searchResult }) => {
  return (
    <Flex
      // bg="red.500"
      // height={"50px"}
      justifyContent={"center"}
      padding="6 12"
      justify={{ md: "space-between" }}
      align="center"
    >
      <Stack width={"85%"} justify={"center"} mt={"20px"}>
        <SimpleGrid columns={[1, null, 2]} gap={10}>
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
    </Flex>
  );
};
export default SearchResult;

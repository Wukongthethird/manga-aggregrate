import { Input, Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import API from "@/api/API";
import { mangaUpdatesMangaInterface } from "./SearchPage";

type SearchBarProps = {
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
};
// props will contain mangalist
const SearchBar: React.FC<SearchBarProps> = ({ setSearchTerm, onSubmit }) => {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Flex
      justify={"space-evenly"}
      align={"center"}
      height="56px"
      borderRadius={4}
      width={"100%"}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <Input
          width={"600px"}
          required
          name="search"
          placeholder="search"
          onChange={onChange}
          fontSize="10pt"
          _placeholder={{ color: "gray.500" }}
          _hover={{ border: "1px solid", borderColor: "red.500" }}
          _focus={{
            outline: "none",
            bg: "white",
            borderColor: "red.500",
            border: "1px solid",
          }}
          bg="gray.100"
          borderColor={"gray.200"}
          height={"36px"}
          borderRadius={4}
          mr={4}
        />
      </form>
    </Flex>
  );
};
export default SearchBar;

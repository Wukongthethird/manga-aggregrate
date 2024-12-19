import { Input, Flex } from "@chakra-ui/react";
import React, { useState } from "react";

type SearchBarProps = {
  onSubmit: (term: string) => void;
};
// props will contain mangalist
const SearchBar: React.FC<SearchBarProps> = ({ onSubmit }) => {
  const [searchBar, setSearchBar] = useState<string>("");

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchBar(event.target.value);
  };

  const onSearchBarSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(searchBar);
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
          onSearchBarSubmit(event);
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

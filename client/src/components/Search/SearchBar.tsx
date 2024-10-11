import { Input, Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import API from "@/api/API";

export interface searchMangaUpdatesInterface {
  mangaId: string;
  title: string;
  imageURL: string;
  link: string;
}

type SearchBarProps = {
  setSearchResult: React.Dispatch<
    React.SetStateAction<searchMangaUpdatesInterface[]>
  >;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
};
// props will contain mangalist
const SearchBar: React.FC<SearchBarProps> = ({
  setSearchResult,
  setLoading,
  setError,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  //onsubmit probably should be handed from parent. requesting data onhome page about manga
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    try {
      const res = await API.searchMangaUpdates(searchTerm);
      console.log("here , res", res);
      if (!res) {
        setError("server is down");
      } else if (res?.data?.errors) {
        setError("something is down on mangaUpdates");
      } else {
        setSearchResult(res.data);
      }
    } catch (error) {
      console.log("SEARCHBARAPI ERROR", error);
      // setError(`${error}`)
    }
    setLoading(false);
  };
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
      <form onSubmit={onSubmit}>
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

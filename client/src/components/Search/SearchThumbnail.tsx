import { Flex, Stack, Image, Box, Text } from "@chakra-ui/react";
import React from "react";

type SearchThumbnail = {
  mangaId: string;
  title: string;
  imageURL: string;
  link: string;
};

//
// single manga item from mangadupdatexs mainly image and link
const SearchThumbnail: React.FC<SearchThumbnail> = ({
  mangaId,
  title,
  imageURL,
  link,
}) => {
  return (
    <Flex
      border="1px solid"
      bg="white"
      height={"400px"}
      _hover={{ bgColor: "gray.50" }}
    >
      <Stack spacing={1} direction={"row"} align={"center"}>
        <Box>
          <Image
            src={imageURL}
            alt="N/A"
            // borderRadius={"full"}
            boxSize={"100px"}
            mr={2}
          />
        </Box>
        <Box>
          <Text>{title}</Text>
          <Text>{link}</Text>
          {/* <Text>Go To Page</Text> */}
        </Box>
      </Stack>
    </Flex>
  );
};
export default SearchThumbnail;

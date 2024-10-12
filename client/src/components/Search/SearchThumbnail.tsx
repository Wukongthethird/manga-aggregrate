import { Flex, Stack, Image, Box, Text, AspectRatio } from "@chakra-ui/react";
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
      minH={"200px"}
      maxH={"200px"}
      _hover={{ bgColor: "gray.100" }}
      width={"100%"}
      display={"table"}
    >
      <Stack height={"100%"} direction={"row"} align={"center"}>
        <Box height={"100%"} width={"25%"}>
          <AspectRatio as="div" ratio={1 / 1}>
            <Image
              src={imageURL}
              alt="N/A"
              // borderRadius={"full"}
              //   boxSize={"250px"}
              // height={"100%"}
              // width={"100%"}
              objectFit={"cover"}
              mr={2}
            />
          </AspectRatio>
        </Box>
        <Box display={"table"}>
          <Text overflow={"hidden"}>{title}</Text>
          <Text overflow={"hidden"}>{link}</Text>
          {/* <Text>Go To Page</Text> */}
        </Box>
      </Stack>
    </Flex>
  );
};
export default SearchThumbnail;

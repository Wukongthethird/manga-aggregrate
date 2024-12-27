import { Flex, Stack, Image, Box, Text, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";

import { ExternalLinkIcon } from "@chakra-ui/icons";
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
      minH={"150px"}
      maxH={"150px"}
      _hover={{ bgColor: "gray.100" }}
      width={"100%"}
      display={"table"}
    >
      <Stack height={"100%"} direction={"row"} align={"center"}>
        <Box height={"100%"} width={"25%"}>
          <Image
            minH={"150px"}
            maxH={"150px"}
            minW={"150px"}
            maxW={"150px"}
            src={imageURL}
            alt="N/A"
            objectFit={"cover"}
            mr={2}
          />
        </Box>
        <Box maxWidth={"75%"}>
          <Box mt={0} maxH={"15%"}>
            <Text fontSize={"16px"} fontWeight={600} mt={0} overflow={"hidden"}>
              {title}
            </Text>
          </Box>

          <Box>
            <Link href={link} isExternal as={NextLink}>
              Get all Data on MangaUpdates
              <ExternalLinkIcon mx="2px" />
            </Link>
          </Box>
          <Box>
            <Link href={`/manga/${mangaId}`} as={NextLink}>
              Go To Page
            </Link>
          </Box>
        </Box>
      </Stack>
    </Flex>
  );
};
export default SearchThumbnail;

import React from "react";
import { Flex, Box, Text, Link } from "@chakra-ui/react";
import NextLink from "next/link";

type MangaChapterRowProps = {
  chapterNumber: string;
  link: string;
};

// add on downloader here?

const MangaChapterRow: React.FC<MangaChapterRowProps> = ({
  chapterNumber,
  link,
}) => {
  return (
    <Flex
      justifyContent={"space-between"}
      align={"center"}
      border={"1px solid"}
      maxW={{ base: "460px", md: "100%" }}
    >
      <Box>
        <Text fontSize={"14pt"} fontWeight={600}>
          {chapterNumber}
        </Text>
      </Box>
      <Box>
        <Link href={link} isExternal>
          <Text fontSize={"14pt"} fontWeight={600}>
            Read
          </Text>
        </Link>
      </Box>
    </Flex>
  );
};
export default MangaChapterRow;

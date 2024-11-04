import React from "react";
import { Flex, Box, Text, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import MangadexSingleChapterDownload from "./Download/MangadexSingleChapterDownload";
import Mangasee123SingleChapterDownload from "./Download/Mangasee123SingleChapterDownload";
type MangaChapterRowProps = {
  chapterNumber: string;
  link: string;
  mangadexChapterid?: string;
  mangaTitle: string;
};

// add on downloader here?

const MangaChapterRow: React.FC<MangaChapterRowProps> = ({
  chapterNumber,
  link,
  mangadexChapterid,
  mangaTitle,
}) => {
  return (
    <Flex
      justifyContent={"space-between"}
      align={"center"}
      border={"1px solid"}
      maxW={{ base: "460px", md: "100%" }}
      textAlign={"left"}
    >
      <Box>
        <Text fontSize={"14pt"} fontWeight={600}>
          {chapterNumber}
        </Text>
      </Box>
      <Flex align={"center"} justifyContent={"center"} textAlign={"left"}>
        <Box mr={4}>
          <Link href={link} isExternal>
            <Text fontSize={"14pt"} fontWeight={600}>
              Read
            </Text>
          </Link>
        </Box>
        {mangadexChapterid && (
          <Box
            cursor={"pointer"}
            onClick={() =>
              MangadexSingleChapterDownload(
                mangadexChapterid,
                chapterNumber,

                mangaTitle
              )
            }
          >
            <Text fontSize={"14pt"} fontWeight={600}>
              Download
            </Text>
          </Box>
        )}
        {link && !mangadexChapterid && (
          <Box
            cursor={"pointer"}
            onClick={() =>
              Mangasee123SingleChapterDownload(link, chapterNumber, mangaTitle)
            }
          >
            <Text fontSize={"14pt"} fontWeight={600}>
              Download
            </Text>
          </Box>
        )}
      </Flex>
    </Flex>
  );
};
export default MangaChapterRow;

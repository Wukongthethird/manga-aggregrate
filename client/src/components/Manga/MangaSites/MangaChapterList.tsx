import React from "react";
import MangaChapterRow from "./MangaChapterRow";
import { Box, Stack } from "@chakra-ui/react";

interface ChapterList {
  //   chapterId: mangadex;
  chapterNumber: string;
  link: string;
  //   totalPages: mangadex;
  // date:mangasee123
  //   [key: string]: string;
}

type MangaChapterListProps = {
  chaptersList: ChapterList[];
};

const MangaChapterList: React.FC<MangaChapterListProps> = ({
  chaptersList,
}) => {
  return (
    <Box
      maxH={"100%"}
      maxW={"100%"}
      //   display={"block"}
      //   overflowY={"auto"}
      border={"1px solid"}
    >
      <Stack>
        {chaptersList.map((item, ind) => {
          return (
            <MangaChapterRow
              key={`${item.chapterNumber}+${ind}`}
              chapterNumber={item.chapterNumber}
              link={item.link}
            />
          );
        })}
      </Stack>
    </Box>
  );
};
export default MangaChapterList;

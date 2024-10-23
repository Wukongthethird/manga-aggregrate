import { Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import TabItem from "./TabItem";
import MangadexChapterList from "./MangadexChapterList";
import Mangasee123ChapterList from "./Mangasee123ChapterList";

type ChapterContainerProps = {
  mangaId: string;
};

const siteTab: string[] = ["Mangadex", "Mangasee123"];

const ChapterContainer: React.FC<ChapterContainerProps> = ({ mangaId }) => {
  const [selectedTab, setSelectedTab] = useState(siteTab[0]);

  return (
    <Flex direction={"column"} bg="white" borderRadius={4} mt={10}>
      <Flex width={"100%"}>
        {siteTab.map((site, ind) => (
          <TabItem
            key={`${site} + ${ind}`}
            site={site}
            selected={siteTab[ind] === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === "Mangadex" && (
          <MangadexChapterList mangaId={mangaId} />
        )}
        {selectedTab === "Mangasee123" && (
          <Mangasee123ChapterList mangaId={mangaId} />
        )}
      </Flex>
    </Flex>
  );
};
export default ChapterContainer;

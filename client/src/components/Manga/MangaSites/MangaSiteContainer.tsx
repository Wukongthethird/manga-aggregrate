import { Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import TabItem from "./TabItem";
import MangadexChapterList from "./MangadexChapterList";
import Mangasee123ChapterList from "./Mangasee123ChapterList";

type MangaSiteContainerProps = {
  mangaId: string;
  link: string;
};

const siteTab: string[] = ["Mangadex", "Mangasee123"];

const MangaSiteContainer: React.FC<MangaSiteContainerProps> = ({ mangaId }) => {
  const [selectedTab, setSelectedTab] = useState(siteTab[0]);

  return (
    <Flex
      direction={"column"}
      bg="white"
      borderRadius={4}
      mt={10}
      // maxH={"1340px"}
      // height={"50%"}
    >
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

      {selectedTab === "Mangadex" && <MangadexChapterList mangaId={mangaId} />}
      {selectedTab === "Mangasee123" && (
        <Mangasee123ChapterList mangaId={mangaId} />
      )}
    </Flex>
  );
};
export default MangaSiteContainer;

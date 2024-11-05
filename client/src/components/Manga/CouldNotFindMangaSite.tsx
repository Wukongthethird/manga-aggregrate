import React from "react";
import { Flex } from "@chakra-ui/react";
type CouldNotFindMangaSiteProps = {
  message: string;
};

const CouldNotFindMangaSite: React.FC = () => {
  console.log("CouldNotFindMangaSite");
  return (
    <Flex
      direction={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      minHeight={"60vh"}
    >
      Can Not Locate Manga
    </Flex>
  );
};

export default CouldNotFindMangaSite;

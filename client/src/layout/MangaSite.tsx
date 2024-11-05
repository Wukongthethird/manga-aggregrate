import React from "react";
import { Box, Flex } from "@chakra-ui/react";

type MangaSiteProps = {
  children: React.ReactNode;
};

const MangaSite: React.FC<MangaSiteProps> = ({ children }) => {
  return (
    <Flex justify="center" p="16px 0px">
      <Flex
        width="95%"
        justify={"center"}
        maxWidth={"1400px"}
        padding={"20px 10px"}
        // height={"100%"}
        maxH={"700px"}
        // overflowY={"scroll"}
        bgColor={"red.100"}
      >
        {/* manga metadata */}
        <Box
          // direction={"column"}
          maxWidth={{ base: "0%", md: "35%" }}
          mr={{ base: 0, md: 6 }}
          overflow={{ base: "hidden", md: "none" }}
          float={"left"}
        >
          {children && children[0 as keyof typeof children]}
        </Box>
        {/* chapter list */}
        <Box
          // direction={"column"}
          // width={{ base: "100%", md: "100%" }}
          flexGrow={2}
          // maxH="100%"
          // maxH={"50%"}
          overflow={"scroll"}
        >
          <Box>{children && children[1 as keyof typeof children]}</Box>
        </Box>
      </Flex>
    </Flex>
  );
};
export default MangaSite;

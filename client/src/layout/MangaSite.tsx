import React from "react";
import { Box, Flex } from "@chakra-ui/react";

type MangaSiteProps = {
  children: React.ReactNode;
};

const MangaSite: React.FC<MangaSiteProps> = ({ children }) => {
  return (
    <Box>
      <Flex
        width="100%"
        justify={"center"}
        // maxWidth={"1400px"}
        maxH={"700px"}
        bgColor={"red.100"}
      >
        {/* manga metadata */}
        <Box
          pl={"5%"}
          // direction={"column"}
          maxWidth={{ base: "0%", md: "35%" }}
          // mr={{ base: 0, md: 6 }}
          overflow={{ base: "hidden", md: "none" }}
          // float={"left"}
        >
          {children && children[0 as keyof typeof children]}
        </Box>
        {/* chapter list */}
        <Box pr="5%" flexGrow={2} overflow={"scroll"}>
          <Box>{children && children[1 as keyof typeof children]}</Box>
        </Box>
      </Flex>
    </Box>
  );
};
export default MangaSite;

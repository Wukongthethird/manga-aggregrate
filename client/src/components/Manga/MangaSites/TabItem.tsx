import React from "react";
import { Flex, Text } from "@chakra-ui/react";

type TabItemProps = {
  site: string;
  selected: boolean;
  setSelectedTab: (value: string) => void;
};

const TabItem: React.FC<TabItemProps> = ({
  site,
  selected,
  setSelectedTab,
}) => {
  return (
    <Flex
      justify={"center"}
      align="center"
      flexGrow={1}
      p={"14px 0px"}
      fontWeight={800}
      cursor={"pointer"}
      _hover={{ bg: selected ? "" : "gray.100" }}
      color={selected ? "red.500" : "gray.500"}
      borderWidth={selected ? "0px 1px 2px 0px" : "0px 1px 1px 0px"}
      borderBottomColor={selected ? "red.500" : "gray.200"}
      borderRightColor={"gray.150"}
      bgColor={selected ? "red.100" : ""}
      onClick={() => setSelectedTab(site)}
    >
      <Text fontSize="12pt">{site}</Text>
    </Flex>
  );
};
export default TabItem;

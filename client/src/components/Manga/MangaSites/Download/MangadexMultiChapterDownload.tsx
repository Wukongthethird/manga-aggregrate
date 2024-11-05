import FloatingInput from "@/components/Components/FloatingInput";
import {
  Box,
  Button,
  Center,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import React, { useState } from "react";

type MangadexMultiChapterDownloadProps = {};

const MangadexMultiChapterDownload: React.FC<
  MangadexMultiChapterDownloadProps
> = () => {
  const [start, setStart] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Box
      //   alignItems={"center"}
      //   alignContent={"center"}
      //   justifyContent={"center"}
      textAlign={"center"}
      alignContent={"center"}
      alignItems={"center"}
    >
      {/* <Center> */}

      <Text mb={2}>Request Chapters For Download</Text>

      <Center>
        <FloatingInput labelText="Start" />
        <FloatingInput labelText="End" />
      </Center>
      <Button mt={2}>Download</Button>
      {/* </Center> */}
    </Box>
  );
};
export default MangadexMultiChapterDownload;

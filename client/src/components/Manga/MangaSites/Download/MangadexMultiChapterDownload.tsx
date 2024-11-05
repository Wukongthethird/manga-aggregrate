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
  const [formInput, setFormInput] = useState({
    start: "",
    end: "",
  });
  const [isFocusedStart, setIsFocusedStart] = useState(false);
  const [isFocusedEnd, setIsFocusedEnd] = useState(false);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const re = /^[0-9\b]+$/;
    if (!event.target.value || re.test(event.target.value)) {
      setFormInput((prev) => ({
        ...prev,
        [event.target.name]: event.target.value,
      }));
    }
  };

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
        <FormControl>
          <FormLabel
            htmlFor={"start"}
            position="absolute"
            top={isFocusedStart ? "-2px" : "10px"}
            left="12px"
            pb={2}
            fontSize={!formInput.start ? "md" : "sm"}
            transition="all 0.2s ease-in-out"
            color={isFocusedStart ? "blue.500" : "gray.500"}
            hidden={!isFocusedStart && !!formInput.start}
            textTransform={"uppercase"}
          >
            Start
          </FormLabel>

          <Input
            id={"start"}
            name={"start"}
            onFocus={() => setIsFocusedStart(true)}
            onBlur={() => setIsFocusedStart(false)}
            pt="20px"
            pb="15px"
            px="20px"
            h="50px"
            border="1px solid"
            borderColor="gray.300"
            _focus={{ borderColor: "blue.500" }}
            onChange={onChange}
            value={formInput.start}
          />
        </FormControl>
        <FormControl>
          <FormLabel
            htmlFor={"end"}
            position="absolute"
            top={isFocusedEnd ? "-2px" : "10px"}
            left="12px"
            pb={2}
            fontSize={!formInput.end ? "md" : "sm"}
            transition="all 0.2s ease-in-out"
            color={isFocusedEnd ? "blue.500" : "gray.500"}
            hidden={!isFocusedEnd && !!formInput.end}
            textTransform={"uppercase"}
          >
            End
          </FormLabel>

          <Input
            id={"end"}
            name={"end"}
            onFocus={() => setIsFocusedEnd(true)}
            onBlur={() => setIsFocusedEnd(false)}
            pt="20px"
            pb="15px"
            px="20px"
            h="50px"
            border="1px solid"
            borderColor="gray.300"
            _focus={{ borderColor: "blue.500" }}
            onChange={onChange}
            value={formInput.end}
          />
        </FormControl>
      </Center>
      <Button mt={2}>Download</Button>
      {/* </Center> */}
    </Box>
  );
};
export default MangadexMultiChapterDownload;

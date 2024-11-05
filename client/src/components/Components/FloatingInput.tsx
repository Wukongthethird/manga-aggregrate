import {
  Box,
  Text,
  Center,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";
import React, { useState } from "react";

type FloatingInputProps = {
  labelText: string;
};

const FloatingInput: React.FC<FloatingInputProps> = ({ labelText }) => {
  const [start, setStart] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  return (
    <FormControl>
      <FormLabel
        htmlFor="start"
        position="absolute"
        top={isFocused ? "-2px" : "10px"}
        left="12px"
        pb={2}
        fontSize={!start ? "md" : "sm"}
        transition="all 0.2s ease-in-out"
        color={isFocused ? "blue.500" : "gray.500"}
        hidden={!isFocused && !!start}
        textTransform={"uppercase"}
      >
        {labelText}
      </FormLabel>

      <Input
        id="start"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        pt="20px"
        pb="15px"
        px="20px"
        h="50px"
        border="1px solid"
        borderColor="gray.300"
        _focus={{ borderColor: "blue.500" }}
        onChange={(e) => setStart(e.target.value)}
      />
    </FormControl>
  );
};
export default FloatingInput;

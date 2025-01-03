import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import React, { useState } from "react";

type FloatingInputProps = {
  labelText: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  formId: string;
  state: any;
};

const FloatingInput: React.FC<FloatingInputProps> = ({
  labelText,
  onChange,
  formId,
  state,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <FormControl>
      <FormLabel
        htmlFor={formId}
        position="absolute"
        top={isFocused ? "-2px" : "10px"}
        left="12px"
        pb={2}
        fontSize={!state.formId ? "md" : "sm"}
        transition="all 0.2s ease-in-out"
        color={isFocused ? "blue.500" : "gray.500"}
        hidden={!isFocused && !!state.formId}
        textTransform={"uppercase"}
      >
        {labelText}
      </FormLabel>

      <Input
        id={formId}
        name={formId}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        pt="20px"
        pb="15px"
        px="20px"
        h="50px"
        border="1px solid"
        borderColor="gray.300"
        _focus={{ borderColor: "blue.500" }}
        onChange={onChange}
        value={state.formId}
      />
    </FormControl>
  );
};
export default FloatingInput;

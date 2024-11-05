import React from "react";
import { Flex, Link, Button } from "@chakra-ui/react";
import NextLink from "next/link";

type NotFoundProps = {
  message?: string;
};

const NotFound: React.FC<NotFoundProps> = ({ message }) => {
  return (
    <Flex
      direction={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      minHeight={"60vh"}
    >
      {message ? message : "There is no manga with that ID"}
      <Link href="/" as={NextLink}>
        <Button mt={4}>GO HOME</Button>
      </Link>
    </Flex>
  );
};

export default NotFound;

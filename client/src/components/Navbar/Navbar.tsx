import { Flex, Link } from "@chakra-ui/react";
import React from "react";

const Navbar: React.FC = () => {
  return (
    <Flex
      bg="red.400"
      height={"50px"}
      padding={"6 12"}
      justify={"space-between"}
    >
      <Flex align="center" width={{ base: "40px ", md: "auto" }}>
        <Link
          variant={""}
          height={"30px"}
          display={{ base: "none", sm: "flex" }}
          width={{ base: "70px", md: "110px" }}
          mr={2}
          _hover={{ textDecoration: "none" }}
          href="/"
        >
          Home
        </Link>
        <Link
          height={"30px"}
          display={{ base: "none", sm: "flex" }}
          width={{ base: "70px", md: "110px" }}
          mr={2}
          _hover={{ textDecoration: "none" }}
          href="/search"
        >
          Search
        </Link>
      </Flex>
    </Flex>
  );
};
export default Navbar;

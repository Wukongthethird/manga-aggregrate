import { Box, Button, Flex, Icon, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";

type SearchPaginationProps = {
  totalHits: number;
  perPage: number;
  page: string;
  setPage: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (goToPageNumber: string) => void;
};

// create somethign to render out the image it self
// create a pill for each infor I guess
const PagePill: React.FC = (pageNumber: number) => {
  return { pageNumber };
};

const pagesIndex = (start: number, end: number) => {
  return Array.from({ length: end - start + 1 }, (val, index) => index + start);
};

const ElipsisOrInput: React.FC = () => {
  return <>...</>;
};

const SearchPagination: React.FC<SearchPaginationProps> = ({
  totalHits,
  perPage,
  page,
  setPage,
  onSubmit,
}) => {
  // const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setPage(event.target.value);
  // };
  const ENDPAGE = Math.ceil(totalHits / perPage);
  const SIBLINGPAGENUMBER = 2;

  // if you are postion further up ahead
  const SHOWLEFTELIPSIS = +page > 1 + SIBLINGPAGENUMBER;
  // if you are postioned closer to the beggining
  const SHOWRIGHTELIPSIS = +page < ENDPAGE - SIBLINGPAGENUMBER;

  const onClickRight = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onSubmit((parseInt(page) + 1).toString());
    setPage((parseInt(page) + 1).toString());
  };

  const onClickLeft = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onSubmit((parseInt(page) - 1).toString());
    setPage((parseInt(page) - 1).toString());
  };
  // if (ENDPAGE <= 2 * SIBLINGPAGENUMBER + 1) {
  //   return range(1, ENDPAGE);
  // }
  if (ENDPAGE <= 2 * SIBLINGPAGENUMBER + 1) {
    return pagesIndex(1, ENDPAGE);
  }

  if (!SHOWLEFTELIPSIS && SHOWRIGHTELIPSIS) {
    return (
      <Flex>
        <Box>{pagesIndex(1, 2 * SIBLINGPAGENUMBER)}</Box>
        <Box>
          <ElipsisOrInput />
        </Box>{" "}
      </Flex>
    );
  }

  if (SHOWLEFTELIPSIS)
    return (
      <Flex justifyContent={"center"}>
        <Button
          onClick={(event) => {
            event.preventDefault();
            onClickLeft(event);
          }}
        >
          <Icon fontSize={22}>
            <SlArrowLeft />
          </Icon>
        </Button>
        {/* <form
        onSubmit={(event) => {
          event.preventDefault();

          onSubmit();
        }}
      >
        <input
          style={{
            width: "35px",
            border: "1px solid",
            backgroundColor: "none",
          }}
          onChange={onChange}
          value={page}
          type="number"
        />
      </form> */}
        {/* <Text ml="2px">/</Text> */}
        <Text _hover={{ bg: "gray.100" }} ml="2px">
          {ENDPAGE}
        </Text>
        <Button
          onClick={(event) => {
            event.preventDefault();
            onClickRight(event);
          }}
        >
          <Icon fontSize={22}>
            <SlArrowRight />
          </Icon>
        </Button>
      </Flex>
    );
};

// const searchPageBox: React.FC = ({ pageNumber }) => {};
export default SearchPagination;

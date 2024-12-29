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
// pagenumber is what
type PagePillProps = {
  pageNumberDisplay: number;
  setPage: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (goToPageNumber: string) => void;
};

type PagesIndexProps = {
  start: number;
  end: number;
  setPage: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (goToPageNumber: string) => void;
};

const PagePill: React.FC<PagePillProps> = ({
  pageNumberDisplay,
  setPage,
  onSubmit,
}) => {
  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onSubmit(pageNumberDisplay.toString());
    setPage(pageNumberDisplay.toString());
  };

  return (
    <Button variant={"ghost"} onClick={onClick}>
      {pageNumberDisplay}
    </Button>
  );
};

const PagesIndex: React.FC<PagesIndexProps> = ({
  start,
  end,
  setPage,
  onSubmit,
}) => {
  const range = end - +start + 1;

  const values = Array.from({ length: range }, (val, index) => +index + +start);

  return (
    <>
      <Flex>
        {values.map((val, idx) => {
          return (
            <PagePill
              key={`${val}+/+${idx}`}
              pageNumberDisplay={val}
              setPage={setPage}
              onSubmit={onSubmit}
            />
          );
        })}
      </Flex>
    </>
  );
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
  const ENDPAGE = Math.ceil(totalHits / perPage);
  const SIBLINGPAGENUMBER = 2;
  // if you are postion further up ahead
  const SHOWLEFTELIPSIS = +page - SIBLINGPAGENUMBER > 1 + SIBLINGPAGENUMBER;
  // if you are postioned closer to the beggining
  const SHOWRIGHTELIPSIS =
    +page + SIBLINGPAGENUMBER < ENDPAGE - SIBLINGPAGENUMBER;

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

  if (ENDPAGE == 1) {
    return;
  } else if (ENDPAGE <= 2 * SIBLINGPAGENUMBER + 1) {
    return PagesIndex(1, ENDPAGE);
  } else if (!SHOWLEFTELIPSIS && SHOWRIGHTELIPSIS) {
    return (
      <Flex>
        {/* {this is wrong need to fix later} */}
        <Box>
          <PagesIndex
            start={1}
            end={2 * SIBLINGPAGENUMBER}
            setPage={setPage}
            onSubmit={onSubmit}
          />
        </Box>
        <Box>
          <ElipsisOrInput />
        </Box>
        <PagePill
          pageNumberDisplay={ENDPAGE}
          setPage={setPage}
          onSubmit={onSubmit}
        />
      </Flex>
    );
  } else if (SHOWLEFTELIPSIS && !SHOWRIGHTELIPSIS) {
    return (
      <Flex>
        <Box>{1}</Box>
        <Box>
          <ElipsisOrInput />
        </Box>
        <Box>
          <PagesIndex
            start={+page - 2 * SIBLINGPAGENUMBER}
            end={ENDPAGE}
            setPage={setPage}
            onSubmit={onSubmit}
          />
        </Box>
      </Flex>
    );
  } else {
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
  }
};

// const searchPageBox: React.FC = ({ pageNumber }) => {};
export default SearchPagination;

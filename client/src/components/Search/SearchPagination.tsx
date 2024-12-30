import { Box, Button, Flex, Icon, Text, ScaleFade } from "@chakra-ui/react";
import React, { useState } from "react";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { HiDotsHorizontal } from "react-icons/hi";
import { BsThreeDots } from "react-icons/bs";

type SearchPaginationProps = {
  totalHits: number;
  perPage: number;
  page: string;
  setPage: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (goToPageNumber: string) => void;
};
// bgcolor = EDF2f7 white
// gray = 1a202C

// create somethign to render out the image it self
// create a pill for each infor I guess
// pagenumber is what
type PagePillProps = {
  page: number;
  pageNumberDisplay: number;
  setPage: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (goToPageNumber: string) => void;
};

type PagesIndexProps = {
  page: number;
  start: number;
  end: number;
  setPage: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (goToPageNumber: string) => void;
};

type ElipsisOrInputProps = {
  setPage: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (goToPageNumber: string) => void;
};

const PagePill: React.FC<PagePillProps> = ({
  page,
  pageNumberDisplay,
  setPage,
  onSubmit,
}) => {
  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onSubmit(pageNumberDisplay.toString());
    setPage(pageNumberDisplay.toString());
  };
  const ISSELECTED = pageNumberDisplay == page;

  return (
    <Button
      variant={ISSELECTED ? "solid" : "ghost"}
      bgColor={ISSELECTED ? "red.400" : ""}
      onClick={ISSELECTED ? () => {} : onClick}
      _hover={{ bgColor: "red.400" }}
    >
      {pageNumberDisplay}
    </Button>
  );
};

const PagesIndex: React.FC<PagesIndexProps> = ({
  page,
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
              page={page}
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

const ElipsisOrInput: React.FC<ElipsisOrInputProps> = ({
  setPage,
  onSubmit,
}) => {
  const [showElipsis, setShowElipsis] = useState<boolean>(true);
  const [numberInput, setNumberInput] = useState<string>("");
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNumberInput(event.target.value);
  };

  const onFocus = () => {
    setShowElipsis(false);
  };
  const onBlur = () => {
    setShowElipsis(true);
    setNumberInput("");
  };

  const goToPageSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(numberInput);
    onSubmit(numberInput);
  };

  if (showElipsis) {
    return (
      <Flex direction="column">
        <Box flex={1}>
          <Button
            _hover={{ bgColor: "red.400" }}
            bgColor={"gray.200"}
            onFocus={(event) => {
              event.preventDefault();
              onFocus();
            }}
            onBlur={onBlur}
          >
            <Icon fontSize={22} bottom={"0"}>
              <BsThreeDots />
            </Icon>
          </Button>
        </Box>
      </Flex>
    );
  }
  if (!showElipsis) {
    return (
      <Box bgColor={""} float={"left"} display={"inline-block"} bottom={"20px"}>
        <ScaleFade initialScale={0.9} in={!showElipsis}>
          <form onSubmit={goToPageSubmit} style={{ display: "inline-block" }}>
            {/* change this  styling*/}
            <input
              style={{
                width: "51.2px",
                height: "40px",
                border: "1px solid",
                borderRadius: "3px",
                backgroundColor: "#EDF2F7",
                display: "inline-block",
                font: "Nunito Sans",
              }}
              autoFocus
              onChange={handleInputChange}
              value={numberInput}
              type="number"
              onBlur={onBlur}
            />
          </form>
        </ScaleFade>
      </Box>
    );
  }
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
  const SHOWLEFTELIPSIS = +page - SIBLINGPAGENUMBER > SIBLINGPAGENUMBER;
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
  const leftArrowButton = (
    <Box>
      <Button
        _hover={{ bgColor: "red.400" }}
        bgColor={"gray.200"}
        onClick={(event) => {
          event.preventDefault();
          onClickLeft(event);
        }}
      >
        <Icon fontSize={22}>
          <SlArrowLeft />
        </Icon>
      </Button>
    </Box>
  );
  const rightArrowButton = (
    <Box>
      <Button
        _hover={{ bgColor: "red.400" }}
        bgColor={"gray.200"}
        onClick={(event) => {
          event.preventDefault();
          onClickRight(event);
        }}
      >
        <Icon fontSize={22}>
          <SlArrowRight />
        </Icon>
      </Button>
    </Box>
  );

  if (ENDPAGE == 1) {
    return;
  } else if (ENDPAGE <= 2 * SIBLINGPAGENUMBER + 1) {
    return PagesIndex(1, ENDPAGE);
  } else if (!SHOWLEFTELIPSIS && SHOWRIGHTELIPSIS) {
    return (
      <Flex
        flex={1}
        alignContent={"center"}
        textAlign={"center"}
        margin={"auto"}
        left={"500px"}
      >
        {leftArrowButton}
        <Box>
          <PagesIndex
            page={+page}
            start={1}
            end={2 * SIBLINGPAGENUMBER + 1}
            setPage={setPage}
            onSubmit={onSubmit}
          />
        </Box>
        <Box>
          <ElipsisOrInput setPage={setPage} onSubmit={onSubmit} />
        </Box>
        <PagePill
          page={+page}
          pageNumberDisplay={ENDPAGE}
          setPage={setPage}
          onSubmit={onSubmit}
        />
        {rightArrowButton}
      </Flex>
    );
  } else if (SHOWLEFTELIPSIS && !SHOWRIGHTELIPSIS) {
    return (
      <Flex>
        {leftArrowButton}
        <Box>
          <PagesIndex
            page={+page}
            start={1}
            end={2 * SIBLINGPAGENUMBER + 1}
            setPage={setPage}
            onSubmit={onSubmit}
          />
        </Box>
        <Box>
          <ElipsisOrInput setPage={setPage} onSubmit={onSubmit} />
        </Box>
        <Box>
          <PagesIndex
            page={+page}
            start={+page - 2 * SIBLINGPAGENUMBER}
            end={ENDPAGE}
            setPage={setPage}
            onSubmit={onSubmit}
          />
        </Box>
        {rightArrowButton}
      </Flex>
    );
  } else {
    return (
      <Flex justifyContent={"center"}>
        {leftArrowButton}
        <PagePill
          page={+page}
          pageNumberDisplay={1}
          setPage={setPage}
          onSubmit={onSubmit}
        />

        <Box>
          <ElipsisOrInput setPage={setPage} onSubmit={onSubmit} />
        </Box>
        <Box>
          <PagesIndex
            page={+page}
            start={+page - SIBLINGPAGENUMBER}
            end={+page + SIBLINGPAGENUMBER}
            setPage={setPage}
            onSubmit={onSubmit}
          />
        </Box>
        <Box>
          <ElipsisOrInput setPage={setPage} onSubmit={onSubmit} />
        </Box>
        <PagePill
          page={+page}
          pageNumberDisplay={ENDPAGE}
          setPage={setPage}
          onSubmit={onSubmit}
        />

        {rightArrowButton}
      </Flex>
    );
  }
};

// const searchPageBox: React.FC = ({ pageNumber }) => {};
export default SearchPagination;

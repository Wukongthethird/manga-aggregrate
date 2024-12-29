import { Box, Button, Flex, Icon, Text } from "@chakra-ui/react";
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
      <Button
        onFocus={(event) => {
          event.preventDefault();
          onFocus();
        }}
        onBlur={onBlur}
      >
        <Icon fontSize={22}>
          <BsThreeDots />
        </Icon>
      </Button>
    );
  }
  if (!showElipsis) {
    return (
      <Box>
        <form onSubmit={goToPageSubmit}>
          {/* change this  styling*/}
          <input
            style={{
              width: "35px",
              border: "1px solid",
              backgroundColor: "none",
            }}
            autoFocus
            onChange={handleInputChange}
            value={numberInput}
            type="number"
            onBlur={onBlur}
          />
        </form>
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

  if (ENDPAGE == 1) {
    return;
  } else if (ENDPAGE <= 2 * SIBLINGPAGENUMBER + 1) {
    return PagesIndex(1, ENDPAGE);
  } else if (!SHOWLEFTELIPSIS && SHOWRIGHTELIPSIS) {
    return (
      <Flex>
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
  } else if (SHOWLEFTELIPSIS && !SHOWRIGHTELIPSIS) {
    return (
      <Flex>
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
        <Box>{1}</Box>
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

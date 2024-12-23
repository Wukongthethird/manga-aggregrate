import { Box, Button, Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";

type SearchPaginationProps = {
  totalHits: number;
  perPage: number;
  page: string;
  setPage: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (goToPageNumber: string) => void;
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
        {Math.ceil(totalHits / perPage)}
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

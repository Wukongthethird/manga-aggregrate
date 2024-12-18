import React, { useEffect, useState } from "react";
import API from "@/api/API";
import MangaSiteContainer from "./MangaSites/MangaSiteContainer";
import NotFound from "./NotFound";
import { Box, Flex, Text, Image, Link, Icon, Spinner } from "@chakra-ui/react";
import { FaRegStar } from "react-icons/fa6";

type mangaInfoProps = {
  mangaId: string;
};

interface mangaUpdatesRes {
  mangaId: string;
  title: string;
  link: string;
  imageURL: {
    original: string;
    thumb: string;
  };
  rating: string;
  altTitles: string[];
  artist: string[];
  author: string[];
}

export interface errorMessageInterface {
  status: string;
  detail: string;
}

export interface errorsInterface {
  errors: errorMessageInterface[];
}

const MangaInfo: React.FC<mangaInfoProps> = ({ mangaId }) => {
  const [mangaUpdatesInfo, setMangaUpdatesInfo] = useState<mangaUpdatesRes>({
    mangaId: "",
    title: "",
    link: "",
    imageURL: {
      original: "",
      thumb: "",
    },
    rating: "",
    altTitles: [],
    artist: [],
    author: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchMangaUpdatesData = async () => {
      setLoading(true);
      // try {
      const res = await API.getmangaupdatesmangainfo(mangaId);
      if (res && res?.errors) {
        setError(`${res?.errors[0]?.detail}`);
      }
      if (res && res?.data) {
        setMangaUpdatesInfo(res?.data);
      }
      // } catch (error) {
      //   console.log("err", error);
      // }
      setLoading(false);
    };

    fetchMangaUpdatesData();
  }, []);
  console.log("here", mangaUpdatesInfo.author);

  if (loading) {
    return (
      <Spinner
        color="red.500"
        css={{ "--spinner-track-color": "colors.blue.200" }}
        w={100}
        h={100}
        borderWidth="12px"
      />
    );
  } else if (error) {
    return <NotFound message={error} />;
  }

  return (
    <Box alignContent={"center"}>
      <Flex mb={4}>
        {mangaUpdatesInfo.imageURL.original && (
          <Image
            maxW={"175px"}
            maxH={"250px"}
            src={mangaUpdatesInfo.imageURL.original}
          />
        )}

        <Box ml={10}>
          <Flex alignItems={"center"}>
            <Text fontWeight={700}>{mangaUpdatesInfo.title}</Text>
            <Flex
              justifyContent="center"
              alignItems="center"
              verticalAlign="center"
            >
              <Text fontWeight={500} ml={5}>
                {mangaUpdatesInfo.rating}
              </Text>

              <Icon verticalAlign="center" fontSize={18}>
                <FaRegStar />
              </Icon>
            </Flex>
          </Flex>
          <Text fontWeight={700}>{"Author:    "}</Text>
          <Text fontWeight={500}>
            {mangaUpdatesInfo.author &&
              mangaUpdatesInfo.author.map((val, ind) => {
                return <Text key={val + ind}>{`${val}    `}</Text>;
              })}
          </Text>
          <Link
            href={mangaUpdatesInfo.link}
            isExternal
            style={{ textDecoration: "none" }}
            _hover={{
              textColor: "red.400",
            }}
          >
            <Text>More Info ...</Text>
          </Link>
        </Box>
      </Flex>

      <MangaSiteContainer mangaId={mangaId} link={mangaUpdatesInfo.link} />
    </Box>
  );
};
export default MangaInfo;

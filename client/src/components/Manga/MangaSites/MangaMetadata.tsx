import React from "react";
import { Flex, Box, Stack, Image, Text, Link } from "@chakra-ui/react";

type MangaMetadataProps = {
  coverArtImageURL?: string;
  title?: string;
  author?: string[];
  link: string;
};

const MangaMetadata: React.FC<MangaMetadataProps> = ({
  coverArtImageURL,
  title,
  author,
  link,
}) => {
  console.log("author", author);
  return (
    <Stack>
      <Image maxW={"75%"} maxH={"75%"} src={coverArtImageURL} />

      <Box>
        <Text fontWeight={700}>{title}</Text>
      </Box>
      <Box>
        <Text fontWeight={600}>Author</Text>
        <Box fontWeight={500}>
          {author &&
            author.map((val, ind) => {
              return <Text key={val + ind}>{`${val}`}</Text>;
            })}
        </Box>
      </Box>
      <Box>
        <Link
          href={link}
          isExternal
          style={{ textDecoration: "none" }}
          _hover={{
            textColor: "blue.400",
          }}
        >
          <Text>Visit Site</Text>
        </Link>
      </Box>
    </Stack>
  );
};
export default MangaMetadata;

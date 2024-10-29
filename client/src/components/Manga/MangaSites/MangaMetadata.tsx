import React from "react";
import { Flex, Box, Stack, Image, Text } from "@chakra-ui/react";

type MangaMetadataProps = {
  coverArtImageURL?: string;
  title?: string;
  author?: string[];
};

const MangaMetadata: React.FC<MangaMetadataProps> = ({
  coverArtImageURL,
  title,
  author,
}) => {
  return (
    <Stack>
      <Image maxW={"75%"} maxH={"75%"} src={coverArtImageURL} />

      <Box>
        <Text fontWeight={700}>{title}</Text>
      </Box>
      <Box>
        <Text fontWeight={500}>{author && author[0]}</Text>
      </Box>
    </Stack>
  );
};
export default MangaMetadata;

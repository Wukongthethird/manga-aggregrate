import {
  Box,
  Button,
  Center,
  Text,
  FormControl,
  FormLabel,
  Input,
  Spinner,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { MangadexChapter } from "../MangadexChapterList";
import JSZip from "jszip";
import API from "@/api/API";
import axios from "axios";

type MangadexMultiChapterDownloadProps = {
  chapterList: MangadexChapter[];
  title: string;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const MangadexMultiChapterDownload: React.FC<
  MangadexMultiChapterDownloadProps
> = ({ chapterList, title }) => {
  const [formInput, setFormInput] = useState({
    start: "",
    end: "",
  });

  const [isFocusedStart, setIsFocusedStart] = useState<boolean>(false);
  const [isFocusedEnd, setIsFocusedEnd] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const re = /^[0-9\b]+$/;
    if (!event.target.value || re.test(event.target.value)) {
      setFormInput((prev) => ({
        ...prev,
        [event.target.name]: event.target.value,
      }));
    }
  };
  const onSubmit = async (
    event: React.MouseEventHandler<HTMLButtonElement>
  ) => {
    // event.preventDefault();
    setError("");
    if (!formInput.start || !formInput.end) {
      return;
    }
    if (+formInput.start < 0 || +formInput.end <= 0) {
      setError("No Negative Chapters");
      return;
    }
    if (+formInput.start >= +formInput.end) {
      setError("Start Chapter has to be less than End Chapter");
      return;
    }
    const downloadQueue = [];
    const zip = new JSZip();
    for (const chapter of chapterList) {
      if (
        parseInt(chapter.chapterNumber) >= parseInt(formInput.start) &&
        parseInt(chapter.chapterNumber) <= parseInt(formInput.end)
      ) {
        downloadQueue.push(chapter);
      }
    }
    setIsDownloading(true);
    try {
      for (const chapter of downloadQueue) {
        const mangadexRes = await API.getmangadexchapterpages(
          chapter.chapterId
        );
        if (!mangadexRes) {
          setError("download has failed");
          setFormInput({
            start: "",
            end: "",
          });
          setIsDownloading(false);
          return;
        }
        if (mangadexRes?.data?.chapter?.data) {
          const baseURL = mangadexRes?.data.baseUrl;
          const hash = mangadexRes?.data?.chapter?.hash;

          const URLS = mangadexRes?.data?.chapter?.data.map((url: string) => {
            return `${baseURL}/data/${hash}/${url}`;
          });

          const promises = URLS.map(async (url: string, index: number) => {
            const response = await axios.get(url, {
              responseType: "blob",
            });

            const blob = response.data;
            //name of file
            zip
              ?.folder(`${title} chapter ${chapter.chapterNumber}`)
              ?.file(
                `${title} chapter ${chapter.chapterNumber}-${index + 1}.${
                  blob.type.split("/")[1]
                }`,
                blob
              );
          });

          const finished = await Promise.all(promises);

          if (!finished) {
            setFormInput({
              start: "",
              end: "",
            });
            setIsDownloading(false);
            setError("something bad happened");
            return;
          }
          await delay(70);
        }
      }
      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = `${title} ${formInput.start} - ${Math.min(
        +chapterList[0].chapterNumber,
        +formInput.end
      )}`;
      // Programmatically click the link to trigger the download
      document.body.appendChild(link);
      link.click();
      // Clean up and remove the link
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error: any) {
      setError("Something bad Happened");
    }

    setFormInput({
      start: "",
      end: "",
    });
    setIsDownloading(false);
  };

  return (
    <Box
      //   alignItems={"center"}
      //   alignContent={"center"}
      //   justifyContent={"center"}
      textAlign={"center"}
      alignContent={"center"}
      alignItems={"center"}
    >
      {/* <Center> */}

      <Text mb={2}>Request Chapters For Download</Text>
      {isDownloading ? (
        <Spinner
          color="red.500"
          css={{ "--spinner-track-color": "colors.blue.200" }}
          w={50}
          h={50}
          borderWidth="12px"
        />
      ) : (
        <>
          <Center>
            <FormControl>
              <FormLabel
                htmlFor={"start"}
                position="absolute"
                top={isFocusedStart ? "-2px" : "10px"}
                left="12px"
                pb={2}
                fontSize={!formInput.start ? "md" : "sm"}
                transition="all 0.2s ease-in-out"
                color={isFocusedStart ? "blue.500" : "gray.500"}
                hidden={!isFocusedStart && !!formInput.start}
              >
                Start
              </FormLabel>

              <Input
                id={"start"}
                name={"start"}
                onFocus={() => setIsFocusedStart(true)}
                onBlur={() => setIsFocusedStart(false)}
                pt="20px"
                pb="15px"
                px="20px"
                h="50px"
                border="1px solid"
                borderColor="gray.300"
                _focus={{ borderColor: "blue.500" }}
                onChange={onChange}
                value={formInput.start}
              />
            </FormControl>
            <FormControl>
              <FormLabel
                htmlFor={"end"}
                position="absolute"
                top={isFocusedEnd ? "-2px" : "10px"}
                left="12px"
                pb={2}
                fontSize={!formInput.end ? "md" : "sm"}
                transition="all 0.2s ease-in-out"
                color={isFocusedEnd ? "blue.500" : "gray.500"}
                hidden={!isFocusedEnd && !!formInput.end}
              >
                End
              </FormLabel>

              <Input
                id={"end"}
                name={"end"}
                onFocus={() => setIsFocusedEnd(true)}
                onBlur={() => setIsFocusedEnd(false)}
                pt="20px"
                pb="15px"
                px="20px"
                h="50px"
                border="1px solid"
                borderColor="gray.300"
                _focus={{ borderColor: "blue.500" }}
                onChange={onChange}
                value={formInput.end}
              />
            </FormControl>
          </Center>

          <Button mt={2} onClick={onSubmit}>
            Download
          </Button>
        </>
      )}
      {error && <Text>{error}</Text>}
    </Box>
  );
};
export default MangadexMultiChapterDownload;

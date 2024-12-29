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
import { Mangasee123Chapter } from "../Mangasee123ChapterList";
import JSZip = require("jszip");
import API from "@/api/API";
import axios from "axios";

type Mangasee123MultiChapterDownloadProps = {
  chapterList: Mangasee123Chapter[];
  title: string;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const Mangasee123MultiChapterDownload: React.FC<
  Mangasee123MultiChapterDownloadProps
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
  const onSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
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
        const mangaChapterPages = await API.getmangasee123chapterpages(
          chapter.link,
          title,
          chapter.chapterNumber
        );

        if (!mangaChapterPages || mangaChapterPages?.data?.errors) {
          setError("download has failed");
          setFormInput({
            start: "",
            end: "",
          });
          setIsDownloading(false);
          return;
        }
        if (!mangaChapterPages?.data) {
          setFormInput({
            start: "",
            end: "",
          });
          setIsDownloading(false);
          setError("something bad happened");
          return;
        }
        try {
          const promises = mangaChapterPages.data.map(
            async (element: any, index: number) => {
              const buffer = new Uint8Array(element.data);
              const blob1 = new Blob([buffer], { type: "image/png" });
              const url = URL.createObjectURL(blob1);
              const response = await axios.get(url, {
                responseType: "blob",
              });
              if (!response) {
                return;
              }
              const blob2 = response.data;

              zip
                ?.folder(`${title} chapter ${chapter.chapterNumber}`)
                ?.file(
                  `${title} chapter${chapter.chapterNumber}-${index + 1}.${
                    blob2.type.split("/")[1]
                  }`,
                  blob2
                );
            }
          );
          if (!promises) {
            setFormInput({
              start: "",
              end: "",
            });
            setIsDownloading(false);
            setError("something bad happened");
            return;
          }

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
        } catch (error) {
          setFormInput({
            start: "",
            end: "",
          });
          setIsDownloading(false);
          setError("something bad happened");
          return;
        }
      }
      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = `${title} ${formInput.start} - ${formInput.end}`;
      // Programmatically click the link to trigger the download
      document.body.appendChild(link);
      link.click();
      // Clean up and remove the link
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.log("outerblocl", error);
      setError("Something bad Happened");
      return;
    }
    setFormInput({
      start: "",
      end: "",
    });
    setIsDownloading(false);
  };

  return (
    <Box textAlign={"center"} alignContent={"center"} alignItems={"center"}>
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
export default Mangasee123MultiChapterDownload;

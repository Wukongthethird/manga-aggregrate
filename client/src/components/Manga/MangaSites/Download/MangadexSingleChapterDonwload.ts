import API from "@/api/API";
import React from "react";
import jsZip from "jszip";
import axios from "axios";

type MangadexSingleChapterDonwloadProps = {
  chapterNumber: string;
  mangadexChapterId: string;
  mangaTitle: string;
};

const MangadexSingleChapterDonwload = async (
  mangadexChapterId: string,
  chapterNumber: string,
  mangaTitle: string
) => {
  if (!mangadexChapterId) {
    return;
  }

  const mangaChapterPages = await API.getmangadexchapterpages(
    mangadexChapterId
  );

  if (!mangaChapterPages || mangaChapterPages?.data?.errors) {
    return;
  }

  if (mangaChapterPages?.data?.chapter?.data) {
    const baseURL = mangaChapterPages?.data.baseUrl;
    const hash = mangaChapterPages?.data?.chapter?.hash;
    const zip = new jsZip();

    const promises = mangaChapterPages.data.chapter.data.map(
      async (url: string, index: string) => {
        // console.log(`${baseURL}/${hash}/${url}`);
        const response = await axios.get(`${baseURL}/data/${hash}/${url}`, {
          responseType: "blob",
        });
        const blob = response.data;

        // await Promise.all(promises);
        //name of file
        zip.file(
          `${mangaTitle} chapter${chapterNumber}-${index + 1}.${
            blob.type.split("/")[1]
          }`,
          blob
        );
      }
    );
    await Promise.all(promises);

    const content = await zip.generateAsync({ type: "blob" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = `${mangaTitle} ${chapterNumber}`;

    // Programmatically click the link to trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up and remove the link
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    // const aLink = (
    //   <a href={URL.createObjectURL(content)} download={"trial.zip"}></a>
    // );

    // document.body.appendChild(aLink);
    // aLink.click();

    // // Clean up and remove the link
    // document.body.removeChild(aLink);
    // URL.revokeObjectURL(aLink.href);
    // saveAs(content, 'images.zip');
  }
  //   for (const page of mangaChapterPages.data.chapter.data) {
  //     const fileName = page.split("-")[0];
  //   }
  // }
  // if()
  // const fileStream = streamSaver.createWriteStream("filename.txt", {
  //   // size: uInt8.byteLength, // (optional filesize) Will show progress
  //   writableStrategy: undefined, // (optional)
  //   readableStrategy: undefined, // (optional)
  // });
};
export default MangadexSingleChapterDonwload;

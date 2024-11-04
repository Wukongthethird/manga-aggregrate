import API from "@/api/API";
import Download from "./download";
import axios from "axios";
import JSZip from "jszip";

const Mangasee123SingleChapterDownload = async (
  mangasee123chapterlink: string,
  chapterNumber: string,
  mangaTitle: string
) => {
  if (!mangasee123chapterlink) {
    return;
  }
  const mangaChapterPages = await API.getmangasee123chapterpages(
    mangasee123chapterlink,
    mangaTitle,
    chapterNumber
  );

  // if (!mangaChapterPages || mangaChapterPages?.data?.errors) {
  //   return;
  // }

  const zip = new JSZip();

  if (mangaChapterPages?.data.length) {
    try {
      const promises = mangaChapterPages.data.map(
        async (element: any, index: number) => {
          const buffer = new Uint8Array(element.data);
          const blob1 = new Blob([buffer], { type: "image/png" });
          const url = URL.createObjectURL(blob1);
          const response = await axios.get(url, {
            responseType: "blob",
          });
          const blob2 = response.data;
          zip.file(
            `${mangaTitle} chapter${chapterNumber}-${index + 1}.${
              blob2.type.split("/")[1]
            }`,
            blob2
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
      // Your byte data here
    } catch (error) {}
  }
};

export default Mangasee123SingleChapterDownload;

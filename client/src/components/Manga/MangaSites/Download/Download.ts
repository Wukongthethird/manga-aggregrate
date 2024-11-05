import API from "@/api/API";
import jsZip from "jszip";
import axios from "axios";
import { url } from "inspector";

const Download = async (
  URLS: string[],
  mangaTitle: string,
  chapterNumber: string
) => {
  if (!URLS) {
    return;
  }
  const zip = new jsZip();
  const imgs = [] as any;
  try {
    const promises = URLS.map(async (url: string, index: number) => {
      const response = await axios.get(url, {
        responseType: "blob",
      });
      const blob = response.data;
      //name of file
      zip.file(
        `${mangaTitle} chapter${chapterNumber}-${index + 1}.${
          blob.type.split("/")[1]
        }`,
        blob
      );
    });
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
  } catch (error) {}
};

export default Download;

import React from "react";
import { useRouter } from "next/router";
import API from "@/api/API";
import MangaInfo from "@/components/Manga/mangaInfo";

// type MangaPageProps = {

// };

const Page: React.FC = () => {
  const router = useRouter();
  const mangaId = router.query;

  return (
    <div>{typeof mangaId === "string" && <MangaInfo mangaId={mangaId} />}</div>
  );
};
export default Page;

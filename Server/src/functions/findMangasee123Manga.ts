import searchMangasee123Author from "../webscraper/mangasee123/searchMangasee123Author";

const findMangasee123Manga = async (
  authors: string[],
  mangaTitles: string[]
): Promise<void | string> => {
  const mangaTitlesSet: Set<string> = new Set();
  for (const t of mangaTitles) {
    mangaTitlesSet.add(t.toLowerCase().trim());
  }

  for (const author of authors) {
    const mangasee123AuthorResults = await searchMangasee123Author(
      author.toLowerCase()
    );

    // prob need to check this better
    if (mangasee123AuthorResults.hasOwnProperty("error")) {
      console.log("here");
      return;
    }
    if (Array.isArray(mangasee123AuthorResults)) {
      for (const aRes of mangasee123AuthorResults) {
        if (mangaTitlesSet.has(aRes.title.toLowerCase())) {
          for (const aResAuthor of aRes.author) {
            if (aResAuthor.toLowerCase() === author.toLowerCase()) {
              return aRes.mangaLink;
            }
          }
        } else {
          for (const mTitles of mangaTitlesSet) {
            if (
              mTitles.startsWith(aRes.title.toLowerCase()) ||
              aRes.title.toLowerCase().startsWith(mTitles)
            ) {
              return aRes.mangaLink;
            }
          }
        }
      }
    }
  }
};

export default findMangasee123Manga;

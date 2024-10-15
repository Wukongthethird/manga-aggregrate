"use strict";

// type of autho results in mangadex
const filterMangadexAuthorManga = (
  mangaTitles: string[],
  listOfAuthorManga: any
) => {
  const mangaTitlesSet = new Set();
  for (const titles of mangaTitles) {
    if (titles.match(/[a-zA-Z0-9]/g)) {
      mangaTitlesSet.add(titles.toLowerCase());
    }
  }

  //   const mangaNames = [];
  for (const authorWorks of listOfAuthorManga) {
    const mTitle = Object.values(authorWorks.title)[0] as string;

    if (mTitle.toLowerCase() in mangaTitlesSet) {
      return authorWorks.mangaId;
    }
    // mangaNames.push(mTitle.toLowerCase());
    for (const altTitle of authorWorks.altTitle) {
      const currentTitle = Object.values(altTitle)[0] as string;
      if (currentTitle.match(/[a-zA-Z0-9]/g)) {
        if (currentTitle.toLowerCase()) {
          return authorWorks.mangaId;
        }
      }
    }
  }

  //   console.log(mangaTitlesSet, mangaNames);
};

export default filterMangadexAuthorManga;

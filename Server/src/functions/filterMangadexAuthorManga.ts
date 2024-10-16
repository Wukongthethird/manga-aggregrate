"use strict";

import mangadexAPI from "../API/mangadexAPI";

// type of autho results in mangadex
const filterMangadexAuthorManga = async (
  authors: string[],
  mangaTitles: string[]
  //   listOfAuthorManga: any
) => {
  let matchedMangadexId;

  // typescript this later
  const mangaTitlesSet = new Set();
  for (const t of mangaTitles) {
    mangaTitlesSet.add(t.toLowerCase());
  }

  let listOfAuthorManga = [] as any;
  for (const author of authors) {
    const mangadexAuthorResults = await mangadexAPI.searchAuthor(
      author.toLowerCase()
    );

    for (const aRes of mangadexAuthorResults) {
      // revisit this maybe i dont wan

      if (author.toLowerCase() === aRes?.name.toLowerCase()) {
        listOfAuthorManga.push(...aRes.mangaList);
      }
    }
  }

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
  // return null if nothing
  //   console.log(mangaTitlesSet, mangaNames);
};

export default filterMangadexAuthorManga;

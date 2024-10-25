"use strict";

import mangadexAPI from "../API/mangadexAPI";
import { mangadexMangaInterface } from "../API/mangadexAPI";

// type of autho results in mangadex
const filterMangadexAuthorManga = async (
  authors: string[],
  mangaTitles: string[]
  //   listOfAuthorManga: any
): Promise<void | string> => {
  // let matchedMangadexId;

  // typescript this later
  const mangaTitlesSet: Set<string> = new Set();
  for (const t of mangaTitles) {
    mangaTitlesSet.add(t.toLowerCase());
  }
  try {
    let listOfAuthorManga: mangadexMangaInterface[] = [];
    for (const author of authors) {
      const mangadexAuthorResults = await mangadexAPI.searchAuthor(
        author.toLowerCase()
      );

      if (Array.isArray(mangadexAuthorResults)) {
        for (const aRes of mangadexAuthorResults) {
          if (author.toLowerCase() === aRes?.name.toLowerCase()) {
            listOfAuthorManga.push(...aRes.mangaList);
          }
        }
      }
    }

    if (listOfAuthorManga) {
      for (const authorWorks of listOfAuthorManga) {
        if (authorWorks.title) {
          const mTitle = Object.values(authorWorks.title)[0] as string;
          if (mangaTitlesSet.has(mTitle.toLowerCase())) {
            return authorWorks.mangaId;
          }
        }

        // mangaNames.push(mTitle.toLowerCase());
        if (authorWorks.altTitles) {
          for (const altTitle of authorWorks.altTitles) {
            const currentTitle = Object.values(altTitle)[0] as string;
            // maybe jsut do a match on all titles instead of english

            if (currentTitle.match(/[a-zA-Z0-9]/g)) {
              // console.log("alt title", currentTitle);
              if (mangaTitlesSet.has(currentTitle.toLowerCase())) {
                console.log("not here yet", currentTitle);
                return authorWorks.mangaId;
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export default filterMangadexAuthorManga;

"use strict";

import mangadexAPI from "../API/mangadexAPI";
import { mangadexMangaInterface } from "../API/mangadexAPI";

// type of autho results in mangadex
// info is from mangaupdates
const filterMangadexAuthorManga = async (
  authors: string[],
  mangaTitles: string[],
  publicationYear: string | undefined,
  status: string | undefined
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
          console.log(aRes);
          if (author.toLowerCase() === aRes?.name.toLowerCase()) {
            listOfAuthorManga.push(...aRes.mangaList);
          }
        }
      }
    }

    if (listOfAuthorManga) {
      for (const authorWorks of listOfAuthorManga) {
        // console.log(
        //   " search",
        //   "mu",
        //   publicationYear,
        //   "MU:",
        //   status,
        //   authorWorks
        // );
        if (
          publicationYear &&
          authorWorks.publicationYear &&
          publicationYear != authorWorks.publicationYear
        ) {
          continue;
        }
        if (
          status &&
          authorWorks.status &&
          ((status && authorWorks.status != "completed") ||
            (!status && authorWorks.status == "completed"))
        ) {
          continue;
        }

        if (authorWorks.title) {
          const mTitle = Object.values(authorWorks.title)[0] as string;

          if (mangaTitlesSet.has(mTitle.toLowerCase())) {
            return authorWorks.mangaId;
          }
        }

        // mangaNames.push(mTitle.toLowerCase());
        if (authorWorks.altTitles) {
          for (const altTitle of authorWorks.altTitles) {
            // console.log(altTitle);
            const currentTitle = Object.values(altTitle)[0] as string;
            // maybe jsut do a match on all titles instead of english
            // console.log("current", currentTitle);
            if (currentTitle.match(/[a-zA-Z0-9]/g)) {
              // console.log("alt title", currentTitle);
              if (mangaTitlesSet.has(currentTitle.toLowerCase())) {
                // console.log("altTitle");
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

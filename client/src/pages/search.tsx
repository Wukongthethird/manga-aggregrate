import React, {useState} from 'react';

import SearchPage from '@/components/Search/SearchPage';

export interface searchMangaUpdatesInterface {
    mangaId: string;
    title: string;
    imageURL: string;
    link: string;
  }

const search= () => {
    return (<><SearchPage/></>)
}
export default search;
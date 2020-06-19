import React from 'react';
import { SearchBar } from '@foodmedicine/components';
import { environment } from '../../environments/environment';

export default function SearchPage() {
  async function onSearch(query: string): Promise<string> {
    const ret = await fetch(environment.baseApiUrl + `/search?q=${query}`)
    return ""
  }
  return <SearchBar onSearch={onSearch} />;
}

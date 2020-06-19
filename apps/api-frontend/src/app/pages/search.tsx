import React, { useState } from 'react';
import { SearchBar } from '@foodmedicine/components';
import { environment } from '../../environments/environment';
import { ParsedArticleParagraphStandalone } from '@foodmedicine/interfaces';
import './search.css';

function SingleResult(props: { paragraph: ParsedArticleParagraphStandalone }) {
  return (
    <div
      className="single-result-container"
      aria-label="search-result"
      onClick={() => window.open(props.paragraph.head.xmlFullTextDownloadLink)}
    >
      <h4 aria-label="paper's title">{props.paragraph.head.title}</h4>
      <p aria-label="correlated paragraph">...{props.paragraph.body}...</p>
      <hr />
    </div>
  );
}

export default function SearchPage() {
  const [searchResults, setResults] = useState<
    ParsedArticleParagraphStandalone[]
  >([]);
  async function onSearch(query: string): Promise<void> {
    const ret = await fetch(environment.baseApiUrl + `/search?q=${query}`);
    const body = await ret.json();
    setResults(body as ParsedArticleParagraphStandalone[]);
  }
  return (
    <>
      {' '}
      <SearchBar<void> onSearch={onSearch} />
      <div className="results-container">
        {searchResults.map((result) => (
          <SingleResult paragraph={result} />
        ))}
      </div>
    </>
  );
}

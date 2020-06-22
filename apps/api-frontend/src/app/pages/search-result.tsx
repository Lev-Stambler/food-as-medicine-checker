import React, { useState } from 'react';
import { environment } from '../../environments/environment';
import { ParsedArticleParagraphStandalone } from '@foodmedicine/interfaces';
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader';
import './search-result.css';

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

export default function Results(props: { query: string }) {
  const [searchResults, setResults] = useState<
    ParsedArticleParagraphStandalone[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string>(null);
  async function onSearch(query: string): Promise<void> {
    setIsLoading(true);
    try {
      const ret = await fetch(environment.baseApiUrl + `/search?q=${query}`);
      const body = await ret.json();
      setIsLoading(false);
      setResults(body as ParsedArticleParagraphStandalone[]);
    } catch (e) {
      setIsLoading(false);
      setErrMsg('An error occured in loading');
    }
  }
  return (
    <div className="results-container">
      <div className="loading-container">
        <ClimbingBoxLoader size={15} color={'#123abc'} loading={isLoading} />
      </div>
      {searchResults.map((result) => (
        <SingleResult paragraph={result} />
      ))}
    </div>
  );
}

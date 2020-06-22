import React from 'react';
import { SearchBar } from '@foodmedicine/components';
import { useHistory } from 'react-router-dom';
import './search.css';

export default function SearchPage() {
  const history = useHistory();
  function onSearch(query: string) {
    history.push(`/results/${encodeURIComponent(query)}`);
    // history.push(`/results/${encodeURIComponent(query)}`);
  }
  return (
    <>
      <SearchBar<void> onSearch={onSearch} />
    </>
  );
}

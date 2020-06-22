import React from 'react';
import { SearchBar } from '@foodmedicine/components';
import { useHistory } from 'react-router-dom';
import { ReactComponent as Logo } from '../logo.svg';
import './search.css';
import { onSearch } from './onsearch';

export default function SearchPage() {
  const history = useHistory();
  return (
    <>
      <header className="flex">
        <Logo width="125" height="125" />
        <h1>
          Welcome to Schopal, a search engine abstraction for finding details
          within open source scholarly research!
        </h1>
      </header>
      <SearchBar<void> onSearch={(query) => onSearch(query, history)} />
    </>
  );
}

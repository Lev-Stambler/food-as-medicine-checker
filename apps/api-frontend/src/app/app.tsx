import React from 'react';

import './app.css';

import { ReactComponent as Logo } from './logo.svg';
import SearchPage from './pages/search'

export const App = () => {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./app.css file.
   */
  return (
    <div className="app">
      <header className="flex">
        <Logo width="125" height="125" />
        <h1>
          Welcome to Schopal, a search engine abstraction for finding details
          within open source scholarly research!
        </h1>
      </header>
      <main>
        <SearchPage />
      </main>
    </div>
  );
};

export default App;

import React from 'react';

import './app.css';

import TablePage from './pages/table';
import star from './star.svg';

import { Route, Link } from 'react-router-dom';

export const App = () => {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./app.css file.
   */
  return (
    <div className="app">
      <header className="flex">
        <h1>Welcome to Food as Medicine Check</h1>
      </header>

      <TablePage />
    </div>
  );
};

export default App;

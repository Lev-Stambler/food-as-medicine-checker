import React from 'react';

import './app.css';

import { ReactComponent as Logo } from './logo.svg';
import TablePage from './pages/table'
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
        <Logo width="75" height="75" />
        <h1>Welcome to Food as Medicine Check</h1>
      </header>
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page-2">Page 2</Link>
          </li>
        </ul>
      </div>
      <TablePage />
      {/* <Route
        path="/"
        exact
        render={TablePage}
      /> */}
      {/* <Route
        path="/page-2"
        exact
        render={() => (
          <div>
            <Link to="/">Click here to go back to root page.</Link>
          </div>
        )}
      /> */}
    </div>
  );
};

export default App;

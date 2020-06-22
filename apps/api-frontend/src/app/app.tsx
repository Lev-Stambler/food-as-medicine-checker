import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import history from './history';

import './app.css';

import { ReactComponent as Logo } from './logo.svg';
import SearchPage from './pages/search';
import ResultsPage from './pages/search-result';

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
        <Router>
          <Switch>
            <Route path="/" exact component={SearchPage} />
            <Route path="results/:query" component={ResultsPage} />
          </Switch>
        </Router>
      </main>
    </div>
  );
};

export default App;

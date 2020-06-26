import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import './app.css';

import SearchPage from './pages/search-pages/search';
import ResultsPage from './pages/search-pages/search-result';

export const App = () => {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./app.css file.
   */
  return (
    <div className="app">
      <main>
        <Router>
          <Switch>
            <Route path="/" exact component={SearchPage} />
            <Route path="/results/" component={ResultsPage} />
          </Switch>
        </Router>
      </main>
    </div>
  );
};

export default App;

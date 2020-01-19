// Modules
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';

// Components
import Header from './shared/header/header.index';
import PageHome from './pages/page.home/page.home.index';
import PageHousingList from './pages/page.housingList/page.housingList.index';
import PageHousingSingle from './pages/page.housingSingle/page.housingSingle.index';

// Assets
import './styles/styles.scss'

// Utils
import theme from './shared/MaterialTheme'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Header/>
        <Switch>
          <Route path="/" exact>
            <PageHome/>
          </Route>

          <Route path="/housings/:id">
            <PageHousingSingle/>
          </Route>

          <Route path="/housings" exact>
            <PageHousingList/>
          </Route>

        </Switch>
      </div>
    </ThemeProvider>
  );
}

export default App;

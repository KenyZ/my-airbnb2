// Modules
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import {withRouter} from 'react-router-dom'

// Components
import Header from './shared/header/header.index';
import PageHome from './pages/page.home/page.home.index';
import PageHousingList from './pages/page.housingList/page.housingList.index';
import PageHousingSingle from './pages/page.housingSingle/page.housingSingle.index';
import PageSignin from './pages/page.signin/page.signin.index';
import PageFavorites from './pages/page.favorites/page.favorites.index';

// Assets
import './styles/styles.scss'

// Utils
import theme from './shared/MaterialTheme'
import SecretRoute from './shared/SecretRoute';


const PAGES_WITH_NO_HEADER = ["/signin"]

function App(props) {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        {!PAGES_WITH_NO_HEADER.includes(props.location.pathname) && <Header/>}
        <Switch>
          <Route path="/" exact>
            <PageHome/>
          </Route>

          <Route path="/signin">
            <PageSignin/>
          </Route>

          <Route path="/housings/:id">
            <PageHousingSingle/>
          </Route>

          <Route path="/housings" exact>
            <PageHousingList/>
          </Route>

          <SecretRoute path="/favorites">
            <PageFavorites/>
          </SecretRoute>

        </Switch>
      </div>
    </ThemeProvider>
  );
}

export default withRouter(App);

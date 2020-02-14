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
import DateRangePicker from './shared/DateRangePicker';

// Assets
import './styles/styles.scss'

// Utils
import theme from './shared/MaterialTheme'
import PageSignin from './pages/page.signin/page.signin.index';


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

        </Switch>
      </div>
    </ThemeProvider>
  );
}

export default withRouter(App);

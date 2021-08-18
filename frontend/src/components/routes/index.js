import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import Home from '../../pages/home';
import Profile from '../../pages/profile';
import Header from '../header';
import Footer from '../footer';

const Routes = () => {
    return (
        <Router>
            <Header />
            <Switch>
                <Route path='/' exact component={Home} />
                <Route path='/profile' exact component={Profile} />
                <Redirect to='/' />
            </Switch>
            <Footer />
        </Router>
    );
};

export default Routes;

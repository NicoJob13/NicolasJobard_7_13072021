import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import Home from '../../pages/home';
import Profile from '../../pages/profile';

const index = () => {
    return (
        <Router>
            <Switch>
                <Route path='/' exact component={Home} />
                <Route path='/profile' exact component={Profile} />
                <Redirect to='/' />
            </Switch>
        </Router>
    )
};

export default index;

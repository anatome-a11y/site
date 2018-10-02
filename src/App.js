import React, { Component, Fragment } from 'react';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import {AppContext} from './context'

import ListAnatom from './Anatom'
import FormAnatom from './Anatom/Form'


class App extends Component {
    state = {

    }

    render() {
        const {onSetAppState, loading, isLogged, onOpenSnackbar} = this.props
        return (
            <AppContext.Provider value={{
                onSetAppState, 
                loading, 
                isLogged,
                onOpenSnackbar
            }}>
                <Router>
                    <Route exact path="/" component={ListAnatom} />
                    <Route exact path="/roteiro/cadastrar" component={FormAnatom} />
                </Router>
            </AppContext.Provider>
        )
    }

}

export default App;

import React, { Component, Fragment } from 'react';

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import {AppContext} from './context'

import ListAnatom from './Anatom'
import ListPecas from './Anatom/ListaPeca'
import FormAnatom from './Anatom/Form'
import FormMapeamento from './Anatomp'


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
                    <Switch>
                        <Route exact path="/" component={ListAnatom} />
                        <Route exact path="/roteiro/cadastrar" component={FormAnatom} />                        
                        <Route exact path="/roteiro/editar/:id" component={FormAnatom} />
                        <Route exact path="/mapeamento/cadastrar" component={FormMapeamento} />                        
                        <Route exact path="/mapeamento/editar/:id" component={FormMapeamento} />                        
                        <Route exact path="/pecas" component={ListPecas} />
                    </Switch>
            </AppContext.Provider>
        )
    }

}

export default App;

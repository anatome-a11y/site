import React, { Component, Fragment } from 'react';

import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";

import {AppContext} from './context'

import ListAnatom from './Anatom'
import ListPecas from './Anatom/ListaPeca'
import FormAnatom from './Anatom/Form'
import FormRoteiro from './Roteiro'
import FormMapeamento from './Anatomp'
import FormPeca from './Peca'

//
import TelaCorrecao from './TelaCorrecao'
import TelaConfig from './TelaConfig'
import TelaLogin from './Login'


class App extends Component {
    state = {

    }

    render() {
        const {onSetAppState, loading, isLogged, onOpenSnackbar, erros} = this.props
        return (
            <AppContext.Provider value={{
                onSetAppState,
                loading,
                isLogged,
                onOpenSnackbar,
                erros,
                onPush: this.onPush
            }}>
                    <Switch>
                        <Route exact path="/" component={ListAnatom} />
                        <Route exact path="/roteiro/cadastrar" component={FormAnatom} />
                        <Route exact path="/roteiro/editar/:id" component={FormRoteiro} />
                        <Route exact path="/mapeamento/cadastrar" component={FormMapeamento} />
                        <Route exact path="/mapeamento/editar/:id" component={FormMapeamento} />
                        <Route exact path="/peca/cadastrar" component={FormPeca} />
                        <Route exact path="/peca/editar/:id" component={FormPeca} />
                        <Route exact path="/pecas" component={ListPecas} />

                        <Route exact path="/correcao/:id" component={TelaCorrecao} />
                        <Route exact path="/config" component={TelaConfig} />
                        <Route exact path="/login" component={TelaLogin} />

                    </Switch>
            <Redirect to='/login' />
            </AppContext.Provider>
        )
    }


    onPush = path => this.props.history.push(path)

}

export default App;

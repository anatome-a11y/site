import React, { Component } from 'react';

import _Roteiro from '../Roteiro'

import { withAppContext } from '../context';

const Roteiro = withAppContext(_Roteiro)

class Form extends Component {


    state = {

    }
   

    render() {
        return (
            <div style={{padding: 24}}>
                <h2 style={{textAlign: 'center'}}>Cadastro de roteiro de aprendizagem</h2>
                <Roteiro />                
            </div>
        )
    }

}


export default withAppContext(Form)
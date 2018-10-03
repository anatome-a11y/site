import React, { Component } from 'react';

import {Button} from 'antd'

import _Roteiro from '../Roteiro'
import _Mapeamento from '../Anatomp'

import { withAppContext } from '../context';

const Roteiro = withAppContext(_Roteiro)
const Mapeamento = withAppContext(_Mapeamento)

class Form extends Component {


    state = {
        partesRoteiro: []
    }
   

    render() {
        const {partesRoteiro} = this.state;
        return (
            <div style={{padding: 24}}>
                <h2 style={{textAlign: 'center'}}>Etapa 1: Roteiro de aprendizagem</h2>
                <Roteiro onChangePartes={p => this.setState({partesRoteiro: p})} /> 
                <h2 style={{textAlign: 'center', marginTop: 25}}>Etapa 2: Mapeamento das peças físicas</h2>
                <Mapeamento partesRoteiro={partesRoteiro} />
                <div style={{ textAlign: 'center', marginTop: 15, marginBottom: 30 }}>
                    <Button type='primary' icon='check' onClick={() => {}} size='large'>Salvar Roteiro mapeado</Button>
                </div>                 
            </div>
        )
    }

}


export default withAppContext(Form)
import React, { Component, Fragment } from 'react';

import { Collapse, Button } from 'antd';


import Header from '../components/Header'
import FormGeral from './FormGeral'
import FormPecas from './FormPecas'
import FormTeoria from './FormTeoria'
const Panel = Collapse.Panel;

class Roteiro extends Component {

    state = {
        model: {
            nome: '',
            curso: '',
            disciplina: '',
            proposito: '', 
            partes: []           
        },
        erros: {
            msgs: [],
            campos: []
        }, 
        activeKey: 'geral',       
    }


    render() {

        const {model, erros, activeKey} = this.state;
        

        return (
            <div>
                <Collapse accordion activeKey={activeKey} onChange={this.onChangePanel} >
                    <Panel header={<Header error={this.checkError(['nome', 'curso', 'disciplina', 'proposito'])} contentQ={<p>....</p>} title="Criação de roteiro" />} key='geral'>
                        <FormGeral erros={erros} onChange={this.onChange} {...model} />
                        <div style={{textAlign: 'right'}}>
                            <Button type='primary' onClick={() => this.onChangePanel('partes')}>Pŕoximo</Button>
                        </div>
                    </Panel>
                    <Panel header={<Header error={this.checkError(['partes'])} contentQ={<p>....</p>} title="Seleção de partes" />} key='partes'>
                        <FormPecas erros={erros} onChange={this.onChange} {...model} />
                        <div style={{textAlign: 'right'}}>
                            <Button type='primary' onClick={() => this.onChangePanel('teoria')}>Pŕoximo</Button>
                        </div>                    
                    </Panel>
                    <Panel header={<Header contentQ={<p>....</p>} title="Seleção de conteúdo teórico" />} key='teoria'>
                        <FormTeoria erros={erros} onChange={this.onChange} {...model} />
                    </Panel>
                </Collapse>
                <div style={{textAlign: 'center', marginTop: 15}}>
                    <Button type='primary' onClick={this.onSave} size='large'>Salvar roteiro</Button>
                </div>
            </div>            
        )
    }


    onChange = field => value => this.setState({ model: { ...this.state.model, [field]: value } })

    onChangePanel = activeKey => {
        this.setState({ activeKey })
    }

    checkError = campos => this.state.erros.campos.find(c => campos.indexOf(c) != -1) != undefined    
}

export default Roteiro
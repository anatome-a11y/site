import React, { Component, Fragment } from 'react';

import { Collapse, Button } from 'antd';

import { listaIdiomas, listaRegiao, listaSistema } from '../utils/mock'

import request from '../utils/request'

import FormPeca from './FormPeca'
import FormPartes from './FormPartes';
import FormTeoria from './FormTeoria';


import Header from '../components/Header'

const uuidv4 = require('uuid/v4');
const Panel = Collapse.Panel;

const _modelConteudoTeorico = {
    id: uuidv4(),
    partes: [],
    midias: [],
    plural: '',
    singular: ''
}



class Peca extends Component {


    state = {
        model: {
            nome: '',
            idioma: '',
            sistema: '',
            regiao: '',
            partes: [],
            conteudoTeorico: [{..._modelConteudoTeorico}]
        },
        options: {
            listaSistema,
            listaRegiao,
            listaIdiomas,
        },
        erros: {
            msgs: [],
            campos: []
        },
        activeKey: 'geral',
        loading: false,
        clickUID: uuidv4()
    }

    componentDidMount() {

    }


    render() {
        const { model, options, erros, activeKey, clickUID } = this.state;
        return (
            <div>
                <Collapse accordion activeKey={activeKey} onChange={this.onChangePanel} >
                    <Panel header={<Header error={this.checkError(['nome', 'idioma', 'regiao', 'sistema'])} contentQ={<p>Conteúdos trabalhados em várias disciplinas</p>} title="Criação e edição de peça genérica" />} key='geral'>
                        <FormPeca {...model} {...options} erros={erros} onChange={this.onChange} />
                        <div style={{textAlign: 'right'}}>
                            <Button type='primary' onClick={() => this.onChangePanel('partes')}>Pŕoximo</Button>
                        </div>
                    </Panel>
                    <Panel header={<Header error={this.checkError(['partes'])} contentQ={<p>Seleção dos conteúdos das peças genéricas que são trabalhados em uma disciplina</p>} title="Inclusão de conteúdo prático" />} key='partes'>
                        <FormPartes onRemoveParte={this.onRemoveParte} clickUID={clickUID} {...model} erros={erros} onChange={this.onChange} onChangeParte={this.onChangeParte} />
                        <div style={{textAlign: 'right'}}>
                            <Button type='primary' onClick={() => this.onChangePanel('teoria')}>Pŕoximo</Button>
                        </div>                    
                    </Panel>
                    <Panel header={<Header contentQ={<p>Roteiro com Peças Anatômicas Interativa (com localização já mapeada nas peças)</p>} title="Inclusão de conteúdo teórico (informações teóricas) às partes" />} key='teoria'>
                        <FormTeoria {...model} erros={erros} onAddConteudoTeorico={this.onAddConteudoTeorico} onChange={this.onChange} onChangeConteudoTeorico={this.onChangeConteudoTeorico} />
                    </Panel>
                </Collapse>
                <div style={{textAlign: 'center', marginTop: 15}}>
                    <Button type='primary' onClick={this.onSave} size='large'>Salvar peça</Button>
                </div>
            </div>
        )
    }

    onChangePanel = activeKey => {
        const newState = activeKey == 'teoria' ? {clickUID: uuidv4()} : {};
        this.setState({ activeKey, ...newState })
    }

    checkError = campos => this.state.erros.campos.find(c => campos.indexOf(c) != -1) != undefined

    onChange = field => value => this.setState({ model: { ...this.state.model, [field]: value } })

    onChangeConteudoTeorico = (field, idx) => value => {
        const {model} = this.state;

        this.setState({
            model: {
                ...model,
                conteudoTeorico: [
                    ...model.conteudoTeorico.slice(0, idx),
                    { ...model.conteudoTeorico[idx], [field]: value },
                    ...model.conteudoTeorico.slice(idx + 1),
                ]
            }
        })          
    }

    onRemoveParte = id => () => {
        const { onOpenSnackbar } = this.props;
        const { model } = this.state;

        const isUsed = model.conteudoTeorico.find(ct => ct.partes.indexOf(id) != -1)

        if(isUsed){
            onOpenSnackbar('Não é possível excluir partes associadas a algum conteúdo teórico', 'warning');
        }else{
            this.setState({
                model: {
                    ...model,
                    partes: model.partes.filter(p => p.id != id),
                }
            })             
        }


               
    }

    onChangeParte = (idx, nome) => {
        const { model } = this.state;

        this.setState({
            model: {
                ...model,
                partes: [
                    ...model.partes.slice(0, idx),
                    { ...model.partes[idx], nome },
                    ...model.partes.slice(idx + 1),
                ]
            }
        })
    }

    onAddConteudoTeorico = (isNew = false) => () => {
        const { conteudoTeorico } = this.state.model;

        if(isNew){
            this.onChange('conteudoTeorico')([
                {..._modelConteudoTeorico, id: uuidv4()},
                ...conteudoTeorico,            
            ])
        }else{
            this.onChange('conteudoTeorico')([
                {..._modelConteudoTeorico, partes: [...conteudoTeorico[0].partes], id: uuidv4()},
                ...conteudoTeorico,            
            ])            
        }

    }    


    onValidate = () => {
        const { nome, idioma, sistema, regiao, partes } = this.state.model;
        let campos = [], msgs = []

        if(nome == ''){
            campos = [...campos, 'nome'];
            msgs = [...msgs, 'Campo obrigatório'];
        }

        if(idioma == ''){
            campos = [...campos, 'idioma'];
            msgs = [...msgs, 'Campo obrigatório'];
        }  
        
        if(sistema == ''){
            campos = [...campos, 'sistema'];
            msgs = [...msgs, 'Campo obrigatório'];
        }  
        
        if(regiao == ''){
            campos = [...campos, 'regiao'];
            msgs = [...msgs, 'Campo obrigatório'];
        }  
        
        if(partes.length == 0){
            campos = [...campos, 'partes'];
            msgs = [...msgs, 'Inclua ao menos uma parte à peça'];            
        }

        return {campos, msgs}
    }

    onSave = () => {
        const { onRequest, onOpenSnackbar } = this.props;
        const { model } = this.state;

        const erros = this.onValidate();

        if(erros.campos.length > 0){
            this.setState({erros})
            return false;
        }

        this.setState({loading: true})
        const toPost = {
            ...model, 
            conteudoTeorico: model.conteudoTeorico.map(ct => ({
                ...ct,
                midias: ct.midias.map(({original, ...resto}) => ({...resto}))
            }))
        }

        const midias = model.conteudoTeorico.map(ct => ct.midias.map(({original}) => original))
        
        onRequest(request('/api/pecas', 'POST', toPost))
            .then(ret => {
                onOpenSnackbar('Peça salva com sucesso!', 'success')
            })
            .catch(e => {
                onOpenSnackbar('Não foi possível salvar a peça')
                console.error(e)
            })
            .finally(() => {
                this.setState({loading: false})
            })
    }

}


export default Peca
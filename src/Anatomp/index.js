import React, { Component, Fragment } from 'react';

import { Collapse, Button, Modal, List, Icon } from 'antd';

import { request } from '../utils/data'

import FormGeral from './FormGeral'
import FormPecasFisicas from './FormPecasFisicas';
import FormMapa from './FormMapa';


import Header from '../components/Header'

const uuidv4 = require('uuid/v4');
const Panel = Collapse.Panel;
const Item = List.Item;

const _modelLocalizacao = {
    pecaFisica: '',
    anterior: '',
    posterior: '',
    latDir: '',
    latEsq: '',
    medDir: '',
    medEsq: '',
    superior: '',
    inferior: '',    
}


const _modelPecaFisica = {
    id: uuidv4(),
    nome: '',
    descricao: ''
}

const _modelMapa = {
    parte: null,
    numero: '',
    localizacao: [],
    pecasFisicas:[]
}


class Anatomp extends Component {


    state = {
        model: {
            nome: '',
            roteiro: '',
            instituicao: '',
            pecasFisicas: [{..._modelPecaFisica}],
            mapa: []
        },
        options: {
            listaRoteiros: [],
        },
        erros: {
            msgs: [],
            campos: []
        },
        activeKey: 'geral',
        loading: false,
    }

    componentDidMount() {
        const { onOpenSnackbar, model } = this.props;
        const { options } = this.state;

        // if(model){
        //     this.setState({model: {
        //         ...model, 
        //         partes: [],
        //         conteudo: {
        //             selected: [],
        //             unselected: []
        //         }
        //     }})
        // }        

        request('roteiro', { method: 'GET' })
            .then(r => {
                if (r.status == 200) {
                    this.setState({                    
                        options: {
                            ...options,
                            listaRoteiros: r.data
                        }
                    })
                } else {
                    throw r.error
                }
            })
            .catch(e => {
                const msg = typeof e === 'string' ? e : 'Falha ao obter os dados da peça';
                onOpenSnackbar(msg)
                console.error(e)
            })
            .finally(() => this.setState({loading: false}))
    }


    render() {
        const { model, options, erros, activeKey, loading } = this.state;
        return (
            <div>
                <Collapse accordion activeKey={activeKey} onChange={this.onChangePanel} >
                    <Panel header={<Header loading={loading} error={this.checkError(['nome', 'roteiro', 'instituicao'])} contentQ={<p>...</p>} title="1 - Informações gerais da An@tom-P" />} key='geral'>
                        <FormGeral {...model} {...options} erros={erros} onChange={this.onChange} onSelectRoteiro={this.onSelectRoteiro} />
                        <div style={{ textAlign: 'right' }}>
                            <Button type='primary' size='large' onClick={() => this.onChangePanel('partes')}>Próximo</Button>
                        </div>
                    </Panel>
                    <Panel header={<Header loading={loading} error={this.checkError(['pecasFisicas'])} contentQ={<p>...</p>} title="2 - Informações das peças físicas" />} key='pecaFisica'>
                        <FormPecasFisicas {...model} erros={erros} onChange={this.onChange} onAddPecaFisica={this.onAddPecaFisica} onChangePecaFisica={this.onChangePecaFisica} />
                        <div style={{ textAlign: 'right', marginTop: 15 }}>
                            <Button type='primary' size='large' onClick={() => this.onChangePanel('teoria')}>Próximo</Button>
                        </div>
                    </Panel>
                    <Panel header={<Header loading={loading} error={this.checkError(['mapa'])} contentQ={<p>...</p>} title="3 - Mapeamento do conteúdo digital para as peças físicas" />} key='mapeamento'>
                        <FormMapa {...model} erros={erros} onChange={this.onChange} onChangeMapa={this.onChangeMapa} />
                        <div style={{ textAlign: 'right', marginTop: 15 }}>
                            <Button loading={loading} type='primary' onClick={this.onSave} size='large' disabled={loading}>Salvar An@tom-P</Button>
                        </div>
                    </Panel>
                </Collapse>
            </div>
        )
    }

    onSelectRoteiro = id => {
        const {model} = this.state;
        const {onOpenSnackbar} = this.props;

        this.setState({loading: true, model: {...model, roteiro: id}})
        request(`roteiro/${id}/partes`)
        .then(r => {
            if(r.status == 200){
                this.setState({
                    model: {
                        ...this.state.model,
                        mapa: r.data.map(p => ({
                            ..._modelMapa,
                            parte: p
                        }))
                    }
                })
            }else{
                throw r.error
            }
        })
        .catch(e => {
            onOpenSnackbar('Ocorreu um erro na busca de partes')
        })
        .finally(() => this.setState({loading: false}))
    }

    onChangePecaFisica = (field, idx) => value => {
        const { model } = this.state;

        this.setState({
            model: {
                ...model,
                pecasFisicas: [
                    ...model.pecasFisicas.slice(0, idx),
                    { ...model.pecasFisicas[idx], [field]: value },
                    ...model.pecasFisicas.slice(idx + 1),
                ]
            }
        })
    }    

    onAddPecaFisica = () => {
        const { pecasFisicas } = this.state.model;

        this.onChange('pecasFisicas')([
            { ..._modelPecaFisica, id: uuidv4() },
            ...pecasFisicas,
        ])
    }  
    
    onChangeMapa = (field, idx) => value => {
        const { model } = this.state;

        this.setState({
            model: {
                ...model,
                mapa: [
                    ...model.mapa.slice(0, idx),
                    { ...model.mapa[idx], [field]: value },
                    ...model.mapa.slice(idx + 1),
                ]
            }
        })
    }        

    onChangePanel = activeKey => {
        this.setState({ activeKey })
    }

    checkError = campos => this.state.erros.campos.find(c => campos.indexOf(c) != -1) != undefined

    onChange = field => value => this.setState({ model: { ...this.state.model, [field]: value } })

    onRemoveParte = id => () => {
        const { onOpenSnackbar } = this.props;
        const { model } = this.state;

        const isUsed = model.conteudoTeorico.find(ct => ct.partes.indexOf(id) != -1)

        if (isUsed) {
            onOpenSnackbar('Não é possível excluir partes associadas a algum conteúdo teórico', 'warning');
        } else {
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


    onValidate = () => {
        const { nome, roteiro, instituicao, pecasFisicas } = this.state.model;
        let campos = [], msgs = []

        if (nome == '') {
            campos = [...campos, 'nome'];
            msgs = [...msgs, 'Campo obrigatório'];
        }

        if (roteiro == '') {
            campos = [...campos, 'roteiro'];
            msgs = [...msgs, 'Campo obrigatório'];
        }

        if (instituicao == '') {
            campos = [...campos, 'instituicao'];
            msgs = [...msgs, 'Campo obrigatório'];
        }

        if (pecasFisicas.length == 0) {
            campos = [...campos, 'regiao'];
            msgs = [...msgs, 'Adicione ao menos um peça física'];
        }

        return { campos, msgs }
    }

    onSave = () => {
        const { onOpenSnackbar, onSetAppState } = this.props;
        const { model } = this.state;

        const erros = this.onValidate();

        if (erros.campos.length > 0) {
            this.setState({ erros })
            return false;
        }

        this.setState({ loading: true })
        const body = {
            ...model,
            conteudoTeorico: model.conteudoTeorico.map(ct => ({
                ...ct,
                midias: ct.midias.map(({ original, ...resto }) => ({ ...resto }))
            }))
        }

        const _request = model.hasOwnProperty('_id') ? request(`peca/${model._id}`, { method: 'PUT', body: JSON.stringify(body) }) : request('peca', { method: 'POST', body: JSON.stringify(body) })

        _request
            .then(ret => {
                if (ret.status == 200) {
                    onOpenSnackbar(`O conteúdo digital da peça ${model.nome} foi salvo com sucesso!`, 'success')
                    onSetAppState({ current: 'inicio' })
                } else {
                    throw 'Não foi possível salvar o conteúdo digital da peça.'
                }
            })
            .catch(e => {
                onOpenSnackbar('Não foi possível salvar a peça')
                console.error(e)
            })
            .finally(() => {
                this.setState({ loading: false })
            })
    }

}


export default Anatomp
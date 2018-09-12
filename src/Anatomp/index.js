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

const _modelReferenciaRelativa = {
    _id: uuidv4(),
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
    _id: uuidv4(),
    nome: '',
    descricao: ''
}

const _modelLocalizacao = {
    _id: uuidv4(),
    numero: '',
    referenciaRelativa: {..._modelReferenciaRelativa},
    pecaFisica: ''
}

const _modelMapa = {
    parte: null,
    localizacao: [{..._modelLocalizacao}],
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

        if(model){
            this.setState({model: {
                ...model,
                roteiro: model.roteiro._id,
                mapa: model.mapa.map(m => ({...m, localizacao: m.localizacao.map(l => ({...l, pecaFisica: l.pecaFisica._id}))}))
            }})
        }        

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
                <Collapse className='shadow2' accordion activeKey={activeKey} onChange={this.onChangePanel} >
                    <Panel header={<Header loading={loading} error={this.checkError(['nome', 'roteiro', 'instituicao'])} contentQ={<p>...</p>} title="An@tom-P (Peças anatômicas interativas)" />} key='geral'>
                        <FormGeral {...model} {...options} erros={erros} onChange={this.onChange} onSelectRoteiro={this.onSelectRoteiro} />
                        <div style={{ textAlign: 'right' }}>
                            <Button type='primary' size='large' onClick={() => this.onChangePanel('partes')}>Próximo</Button>
                        </div>
                    </Panel>
                    <Panel header={<Header loading={loading} error={this.checkError(['pecasFisicas'])} contentQ={<p>...</p>} title="Inclusão das informações das peças anatômicas físicas" />} key='pecaFisica'>
                        <FormPecasFisicas {...model} erros={erros} onChange={this.onChange} onAddPecaFisica={this.onAddPecaFisica} onDeletePecaFisica={this.onDeletePecaFisica} onChangePecaFisica={this.onChangePecaFisica} />
                        <div style={{ textAlign: 'right', marginTop: 15 }}>
                            <Button type='primary' size='large' onClick={() => this.onChangePanel('mapeamento')}>Próximo</Button>
                        </div>
                    </Panel>
                    <Panel header={<Header loading={loading} error={this.checkError(['mapa'])} contentQ={<p>...</p>} title="Mapeamento do conteúdo digital para as peças físicas" />} key='mapeamento'>
                        <FormMapa {...model} erros={erros} onChange={this.onChange} onChangeMapa={this.onChangeMapa} onAddPecaFisica={this.onAddPecaFisicaAoMapa} onRemovePecaFisica={this.onRemovePecaFisicaDoMapa} />
                        <div style={{ textAlign: 'right', marginTop: 15 }}>
                            <Button loading={loading} type='primary' onClick={this.onSave} size='large'>Salvar An@tom-P</Button>
                        </div>
                    </Panel>
                </Collapse>
            </div>
        )
    }

    onSelectRoteiro = _id => {
        const {model, options} = this.state;
        const {onOpenSnackbar} = this.props;

        const roteiro = options.listaRoteiros.find(r => r._id == _id)

        this.setState({
            model: {
                ...this.state.model,
                roteiro: _id, 
                nome: roteiro.nome,
                mapa: roteiro.partes.map(p => ({
                    ..._modelMapa,
                    parte: p,
                    localizacao: [{
                        ..._modelLocalizacao,
                        _id: uuidv4(),
                        referenciaRelativa: {
                            ..._modelReferenciaRelativa,
                            _id: uuidv4()
                        }
                    }]
                }))
            }
        })
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
            { ..._modelPecaFisica, _id: uuidv4() },
            ...pecasFisicas,
        ])
    }  

    onAddPecaFisicaAoMapa = idx => () => {
        const { model } = this.state;

        this.setState({
            model: {
                ...model,
                mapa: [
                    ...model.mapa.slice(0, idx),
                    { 
                        ...model.mapa[idx], 
                        localizacao: [
                            {..._modelLocalizacao, _id: uuidv4()},
                            ...model.mapa[idx].localizacao
                        ] 
                    },
                    ...model.mapa.slice(idx + 1),
                ]
            }
        })        
    }

    onDeletePecaFisica = idx => () => {
        const { pecasFisicas } = this.state.model;
        
        if(pecasFisicas.length == 1){
            this.onChange('pecasFisicas')([
                { ..._modelPecaFisica, _id: uuidv4() },
            ])            
        }else{
            this.onChange('pecasFisicas')([
                ...pecasFisicas.slice(0, idx),
                ...pecasFisicas.slice(idx+1),
            ])            
        }
    }     

    onRemovePecaFisicaDoMapa = (idx, idxLoc) => () => {
        const { model } = this.state;

        this.setState({
            model: {
                ...model,
                mapa: [
                    ...model.mapa.slice(0, idx),
                    { 
                        ...model.mapa[idx], 
                        localizacao: [
                            ...model.mapa[idx].localizacao.slice(0, idxLoc),
                            ...model.mapa[idx].localizacao.slice(idxLoc+1),
                        ] 
                    },
                    ...model.mapa.slice(idx + 1),
                ]
            }
        })        
    }    
    
    onChangeMapa = (field, idx, idxLoc) => value => {
        const { model } = this.state;

        this.setState({
            model: {
                ...model,
                mapa: [
                    ...model.mapa.slice(0, idx),
                    { 
                        ...model.mapa[idx], 
                        localizacao: [
                            ...model.mapa[idx].localizacao.slice(0, idxLoc),
                            {...model.mapa[idx].localizacao[idxLoc], [field]: value},
                            ...model.mapa[idx].localizacao.slice(idxLoc+1),
                        ] 
                    },
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

    onRemoveParte = _id => () => {
        const { onOpenSnackbar } = this.props;
        const { model } = this.state;

        const isUsed = model.conteudoTeorico.find(ct => ct.partes.indexOf(_id) != -1)

        if (isUsed) {
            onOpenSnackbar('Não é possível excluir partes associadas a algum conteúdo teórico', 'warning');
        } else {
            this.setState({
                model: {
                    ...model,
                    partes: model.partes.filter(p => p._id != _id),
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
        const { nome, roteiro, instituicao, pecasFisicas, mapa } = this.state.model;
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
            campos = [...campos, 'pecasFisicas'];
            msgs = [...msgs, 'Adicione ao menos um peça física'];
        }else{
            if(pecasFisicas.find(p => p.nome.trim() == "")){
                campos = [...campos, 'pecasFisicas'];
                msgs = [...msgs, 'Informe o nome de todas as peças físicas'];                
            }
        }

        const hasError = mapa.find(m => {

            if(m.localizacao.find(l => l.numero == '' || l.pecaFisica.trim() == '')){
                return true
            }

            return false;
        })

        if (hasError) {
            campos = [...campos, 'mapa'];
            msgs = [...msgs, 'Preencha todos os campos obrigatórios'];
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
            mapa: model.mapa.map(m => ({...m, parte: m.parte._id}))
        }

        const _request = model.hasOwnProperty('_id') ? request(`anatomp/${model._id}`, { method: 'PUT', body: JSON.stringify(body) }) : request('anatomp', { method: 'POST', body: JSON.stringify({...body, _id: uuidv4()}) })

        _request
            .then(ret => {
                if (ret.status == 200) {
                    onOpenSnackbar(`O mapeamento ${model.nome} foi salvo com sucesso!`, 'success')
                    onSetAppState({ current: 'inicio' })
                } else {
                    throw ret.error
                }
            })
            .catch(e => {
                onOpenSnackbar('Não foi possível salvar o mapeamento do roteiro')
                console.error(e)
            })
            .finally(() => {
                this.setState({ loading: false })
            })
    }

}


export default Anatomp
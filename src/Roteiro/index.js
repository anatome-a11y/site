import React, { Component, Fragment } from 'react';

import { Collapse, Button } from 'antd';


import Header from '../components/Header'
import FormGeral from './FormGeral'
import FormPecas from './FormPecas'
import FormTeoria from './FormTeoria'

import { request } from '../utils/data'

const uuidv4 = require('uuid/v4');
const Panel = Collapse.Panel;

class Roteiro extends Component {

    state = {
        model: {
            _id: null,
            nome: '',
            curso: '',
            disciplina: '',
            proposito: '',
            partes: [],
            conteudo: {
                selected: [],
                unselected: []
            }
        },
        erros: {
            msgs: [],
            campos: []
        },
        activeKey: 'geral',
        pecas: [],
        conteudoExpandido: [],
        loading: true
    }

    componentDidMount() {
        const { onOpenSnackbar, model } = this.props;

        if(model){
            this.setState({model: {
                ...model, 
                partes: [],
                conteudo: {
                    selected: [],
                    unselected: []
                }
            }})
        }        

        request('peca', { method: 'GET' })
            .then(r => {
                if (r.status == 200) {
                    const conteudoExpandido = [].concat.apply([], r.data.map(p => {
                        return p.conteudoTeorico.map(ct => {
                            const _idsPartes = ct.partes.map(pp => pp._id)
                            const partesOriginais = p.partes.filter(pt => _idsPartes.indexOf(pt._id) != -1);
                            return {...ct, frases: [ct.plural, ct.singular], partesOriginais}
                        })
                    }))

                    const _idsConteudos = model ? model.conteudos.map(c => c._id) : []
                    const _model = model ? {model: {
                        ...model,
                        partes: model.partes.map(p => p._id),
                        conteudo: {
                            selected: conteudoExpandido.filter(c => _idsConteudos.indexOf(c._id) != -1),
                            unselected: [],
                            originais: {
                                selected: conteudoExpandido.filter(c => _idsConteudos.indexOf(c._id) != -1),
                                unselected: [],
                            }
                        }
                    }} : {}
                    this.setState({
                        conteudoExpandido,  
                        ..._model,                                              
                        pecas: r.data.map(p => ({
                            title: p.nome,
                            value: p._id,
                            key: p._id,
                            children: p.partes.map(pp => ({
                                title: pp.nome,
                                value: pp._id,
                                key: pp._id
                            }))
                        }))
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

        const { model, erros, activeKey, pecas, conteudoExpandido, loading } = this.state;
        
        return (
            <div>
                <Collapse className='shadow2' accordion activeKey={activeKey} onChange={this.onChangePanel} >
                    <Panel header={<Header loading={loading} error={this.checkError(['nome', 'curso', 'disciplina', 'proposito'])} contentQ={<p>....</p>} title="Roteiro de aprendizagem" />} key='geral'>
                        <FormGeral erros={erros} onChange={this.onChange} {...model} />
                        <div style={{ textAlign: 'right' }}>
                            <Button type='primary' size='large' onClick={() => this.onChangePanel('partes')}>Próximo</Button>
                        </div>
                    </Panel>
                    <Panel header={<Header loading={loading} error={this.checkError(['partes'])} contentQ={<p>....</p>} title="Seleção de peças e partes anatômicas" />} key='partes'>
                        <FormPecas pecas={pecas} erros={erros} onChange={this.onChange} {...model} />
                        <div style={{ textAlign: 'right' }}>
                            <Button type='primary' size='large' onClick={() => this.onChangePanel('teoria')}>Próximo</Button>
                        </div>
                    </Panel>
                    <Panel header={<Header loading={loading} error={this.checkError(['conteudo'])} contentQ={<p>....</p>} title="Seleção de informações teóricas" />} key='teoria'>
                        <FormTeoria erros={erros} onChange={this.onChangeConteudoRoteiro} {...model.conteudo} partes={model.partes} conteudoExpandido={conteudoExpandido} />
                        <div style={{ textAlign: 'right', marginTop: 15 }}>
                            <Button loading={loading} disabled={loading} type='primary' onClick={this.onSave} size='large'>Salvar roteiro</Button>
                        </div>
                    </Panel>
                </Collapse>
            </div>
        )
    }

    onChangeConteudoRoteiro = state => {
        const {model} = this.state;
        this.setState({
            model: {
                ...model,
                conteudo: {
                    ...model.conteudo,
                    ...state
                }
            }
        })
    }


    onChange = field => value => {
        this.setState({ model: { ...this.state.model, [field]: value } })        
    }

    onChangePanel = activeKey => {
        this.setState({ activeKey })
    }

    checkError = campos => this.state.erros.campos.find(c => campos.indexOf(c) != -1) != undefined


    onValidate = () => {
        const { nome, curso, disciplina, proposito, conteudo, partes } = this.state.model;
        let campos = [], msgs = []

        if (nome == '') {
            campos = [...campos, 'nome'];
            msgs = [...msgs, 'Campo obrigatório'];
        }

        if (curso == '') {
            campos = [...campos, 'curso'];
            msgs = [...msgs, 'Campo obrigatório'];
        }

        if (disciplina == '') {
            campos = [...campos, 'disciplina'];
            msgs = [...msgs, 'Campo obrigatório'];
        }

        if (proposito == '') {
            campos = [...campos, 'proposito'];
            msgs = [...msgs, 'Campo obrigatório'];
        }

        if (partes.length == 0) {
            campos = [...campos, 'partes'];
            msgs = [...msgs, 'Inclua ao menos uma parte no roteiro'];
        }        

        if (conteudo.selected.length == 0) {
            campos = [...campos, 'conteudo'];
            msgs = [...msgs, 'Inclua ao menos um conteúdo no roteiro'];
        }

        return { campos, msgs }
    }    
    
    onSave = () => {
        
        const { onOpenSnackbar, onSetAppState } = this.props;
        const { model } = this.state;

        const erros = this.onValidate();

        if (erros.campos.length > 0) {
            onOpenSnackbar('Verifique os erros de validação!')
            this.setState({ erros })
            return false;
        }

        this.setState({ loading: true })
        const body = {
            ...model,
            conteudos: model.conteudo.selected.map(ct => (ct._id))
        }

        const _request = model._id != null ? request(`roteiro/${model._id}`, { method: 'PUT', body: JSON.stringify(body) }) : request('roteiro', { method: 'POST', body: JSON.stringify({...body, _id: uuidv4()}) })

        _request
            .then(ret => {
                if (ret.status == 200) {
                    onOpenSnackbar(`O roteiro ${model.nome} foi salvo com sucesso!`, 'success')
                    onSetAppState({ current: 'inicio' })
                } else {
                    throw ret.error
                }
            })
            .catch(e => {
                const msg = typeof e === 'string' ? e : 'Não foi possível salvar este roteiro'
                onOpenSnackbar(msg)
                console.error(e)
            })
            .finally(() => {
                this.setState({ loading: false })
            })
    }    
}

export default Roteiro
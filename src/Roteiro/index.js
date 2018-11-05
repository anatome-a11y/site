import React, { Component, Fragment } from 'react';

import { Collapse, Button } from 'antd';


import Header from '../components/Header'
import FormGeral from './FormGeral'
import FormPecas from './FormPecas'
import FormTeoria from './FormTeoria'

import { request } from '../utils/data'
const Panel = Collapse.Panel;

class Roteiro extends Component {

    state = {
        model: {
            _id: null,
            nome: '',
            idioma: '1',
            curso: '',
            disciplina: '',
            partes: [],
            conteudo: {
                selected: [],
            }
        },
        pecas: [],
        pecasFlat: [],
        conteudoExpandido: [],
    }

    componentDidMount() {
        const { onOpenSnackbar, model } = this.props;

        if(model){
            this.setState({model: {
                ...model, 
                partes: [],
                conteudo: {
                    selected: [],
                    original: [],
                    filtrado: []
                }
            }})
        }     

        this.props.onSetAppState({loading: true})
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
                            original: conteudoExpandido,
                            filtrado: conteudoExpandido,
                        }
                    }} : {}
                    this.setState({
                        conteudoExpandido,  
                        ..._model,  
                        pecasFlat: [].concat.apply([], r.data.map(p => p.partes)),                                         
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
            .finally(() => this.props.onSetAppState({loading: false}))
    }


    componentWillUpdate(nextProps, nextState){
        if((JSON.stringify(this.state.model) != JSON.stringify(nextState.model)) && this.props.onChange){
            this.props.onChange(nextState.model)
        }
    }


    render() {
        const {erros, loading} = this.props;
        const { model, pecas, conteudoExpandido } = this.state;
        
        return (
            <div style={{padding: 24}}>
                <h2 className='section' style={{ textAlign: 'center', marginTop: 50 }}>{this.props.match ? 'Alteração de roteiro digital' : 'Cadastro de roteiro digital'}</h2>  
                <Collapse bordered={false} defaultActiveKey={['geral', 'partes', 'teoria']} >
                    <Panel className='anatome-panel' header={<Header loading={loading} error={this.checkError(['nome', 'curso', 'disciplina'])} contentQ={<p>....</p>} title="Informações gerais do roteiro" />} key='geral'>
                        <FormGeral erros={erros} onChange={this.onChange} {...model} />
                    </Panel>
                    <Panel className='anatome-panel' header={<Header loading={loading} error={this.checkError(['partes'])} contentQ={<p>....</p>} title="Seleção de peças e partes anatômicas" />} key='partes'>
                        <FormPecas pecas={pecas} erros={erros} onChange={this.onChange} {...model} />
                    </Panel>
                    <Panel className='anatome-panel' header={<Header loading={loading} error={this.checkError(['conteudo'])} contentQ={<p>....</p>} title="Seleção de informações teóricas" />} key='teoria'>
                        <FormTeoria erros={erros} onChange={this.onChangeConteudoRoteiro} {...model.conteudo} partes={model.partes} conteudoExpandido={conteudoExpandido} />                  
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
        if(field == 'partes'){
            this.props.onChangePartes(this.state.pecasFlat.filter(p => value.indexOf(p._id) != -1))
        }
        this.setState({ model: { ...this.state.model, [field]: value } })        
    }

    checkError = campos => this.props.erros.campos.find(c => campos.indexOf(c) != -1) != undefined
   
}

export default Roteiro
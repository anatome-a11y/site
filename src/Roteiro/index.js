import React, { Component, Fragment } from 'react';

import { Collapse, Button } from 'antd';


import Header from '../components/Header'
import FormGeral from './FormGeral'
import FormPecas from './FormPecas'
import FormTeoria from './FormTeoria'

import { request, Maybe } from '../utils/data'
import { withAppContext } from '../context';

import { onSave as onSaveRoteiro } from '../Roteiro/utils';


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
            generalidades: [],
            conteudo: {
                selected: [],
            },
        },
        pecas: [],
        pecasFlat: [],
        conteudoExpandido: [],
        somentePratica: false
    }

    componentDidMount() {
        const model = Maybe(this.props.history).bind(h => h.location).bind(l => l.state).maybe(false, s => s.model);

        if(model){
            this.setState({
                somentePratica: model.conteudos.length == 0,
                model: {
                    ...model, 
                    idioma: model.idioma._id,
                    partes: [],
                    conteudo: {
                        selected: [],
                        original: [],
                        filtrado: []
                    }
                }                
            })
        }     

        this.onGetData(false)
    }


    componentWillUpdate(nextProps, nextState){
        if((JSON.stringify(this.state.model) != JSON.stringify(nextState.model)) && this.props.onChange){
            this.props.onChange({...nextState.model, somentePratica: nextState.somentePratica})
        }
    }

    componentWillUnmount(){
        this.props.onSetAppState({erros: {campos: [], msgs: []}})
    }    


    render() {
        const {erros, loading} = this.props;
        const { model, pecas, conteudoExpandido, somentePratica } = this.state;
        
        return (
            <div style={{padding: 24}}>
                <h2 className='section' style={{ textAlign: 'center', marginTop: 30 }}>{this.props.match ? 'Alteração do conteúdo do roteiro' : 'Cadastro de conteúdo do roteiro'}</h2>  
                <div style={{ textAlign: 'right', marginBottom: 5 }}>
                    <Button onClick={() => this.props.onPush('/')} size='small' type='primary' ghost>Voltar para página inicial</Button>
                </div>                
                <Collapse bordered={false} defaultActiveKey={['geral', 'partes', 'teoria']} >
                    <Panel className='anatome-panel' header={<Header loading={loading} error={this.checkError(['idioma', 'nome', 'curso', 'disciplina'])} contentQ={<p>....</p>} title="Informações gerais do roteiro" />} key='geral'>
                        <FormGeral somentePratica={somentePratica} onChangeSomentePratica={this.onChangeSomentePratica} onOpenSnackbar={this.props.onOpenSnackbar} erros={erros} onChange={this.onChange} {...model} />
                    </Panel>
                    <Panel className='anatome-panel' header={<Header loading={loading} error={this.checkError(['partes'])} contentQ={<p>....</p>} title="Conhecimento Prático (CP)" />} key='partes'>
                        <FormPecas onUpdatePecas={this.onGetData} pecas={pecas} erros={erros} onChange={this.onChange} {...model} />
                    </Panel>
                    {!somentePratica && <Panel className='anatome-panel' header={<Header loading={loading} error={this.checkError(['conteudo'])} contentQ={<p>....</p>} title="Conhecimento Teórico (CT)" />} key='teoria'>
                        <FormTeoria erros={erros} onChange={this.onChangeConteudoRoteiro} {...model.conteudo} partes={model.partes} conteudoExpandido={conteudoExpandido} />                  
                    </Panel>}
                </Collapse>
                {
                    this.props.match && (
                        <div style={{textAlign: 'center'}}>
                            <Button style={{ marginRight: 5 }} icon='rollback' onClick={() => this.props.onPush('/')} size='large'>Voltar</Button>
                            <Button type='primary' icon='check' onClick={this.onSubmit} size='large'>Salvar roteiro</Button>
                        </div>
                    )
                }
            </div>
        )
    }

    onChangeSomentePratica = somentePratica => this.setState({somentePratica}, () => {
        if(this.props.onChange){
            this.props.onChange({...this.state.model, somentePratica})            
        }
    })

    onSubmit = () => {
        const {somentePratica} = this.state;
        onSaveRoteiro(this.props.onOpenSnackbar, this.props.onSetAppState, {...this.state.model, somentePratica}, ret => {
            this.props.onOpenSnackbar(`O roteiro ${this.state.model.nome} foi salvo com sucesso!`, 'success');            
            this.props.onPush('/')
        })
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
        if(field == 'partes' && !this.props.match){
            this.props.onChangePartes(this.state.pecasFlat.filter(p => value.indexOf(p._id) != -1))
        }
        this.setState({ model: { ...this.state.model, [field]: value } })        
    }

    checkError = campos => this.props.erros.campos.find(c => campos.indexOf(c) != -1) != undefined

    onGetData = (isAddPeca = true) => {
        const { onOpenSnackbar, onAddPeca, history } = this.props;
        const model = Maybe(history).bind(h => h.location).bind(l => l.state).maybe(false, s => s.model);        

        if(isAddPeca && onAddPeca){
            this.props.onAddPeca()
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
                        idioma: model.idioma._id,
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
   
}

Roteiro.defaultProps = {
    onAddPeca: false
}

export default withAppContext(Roteiro)

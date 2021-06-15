import React, { Component, Fragment } from 'react';

import { Collapse, Button, Modal, List, Icon } from 'antd';

import { listaIdiomas, listaRegiao, listaSistema } from '../utils/mock'

import { request, Maybe } from '../utils/data'

import FormPeca from './FormPeca'
import FormPartes from './FormPartes';
import FormTeoria from './FormTeoria';


import Header from '../components/Header'
import { withAppContext } from '../context';

const { v4: uuidv4 } = require('uuid');
const Panel = Collapse.Panel;
const Item = List.Item;

const getModelConteudoTeorico = () => ({
    _id: uuidv4(),
    partes: [],
    midias: [],
    plural: '',
    singular: ''
})


class Peca extends Component {

    buttons = {
        submit: {
            key: 'btn-submit',
            type: 'primary',
            children: 'Salvar',
            size: 'large',
            onClick: () => this.onSave()
        },
        cancelar: {
            key: 'btn-cancelar',
            children: 'Cancelar',
            size: 'large',
            onClick: () => this.props.onClose(false)
        },
        pendencias: {
            key: 'btn-verificar-pend',
            children: 'Verificar pendências',   
            type: 'primary',
            ghost: true,                     
            onClick: () => this.onCheckPendencias()
        }
    }

    state = {
        model: {
            _id: null,
            nome: '',
            sistema: '1',
            regiao: '1',
            partes: [],
            conteudoTeorico: [getModelConteudoTeorico()],
            generalidades: []
            
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
        pendencias: [],
        open: false,
        somentePratica: false,
    }

    componentDidMount() {
        const { history, onSetButtons, onSetAppState } = this.props;
        const model = Maybe(history).bind(h => h.location).bind(l => l.state).maybe(false, s => s.model);
        
        if (model) {
            this.setState({ model: {
                ...model, 
                regiao: model.regiao._id,
                sistema: model.sistema._id,
                conteudoTeorico: model.conteudoTeorico.map(ct => ({...ct, partes: ct.partes.map(p => p._id)}))
            }})
        }

        if(onSetButtons){
            onSetButtons([
                {...this.buttons.cancelar},
                {...this.buttons.submit}
            ]) 
        } 
        
        onSetAppState({loading: false})
    }


    render() {
        const { model, options, erros, open, pendencias, somentePratica } = this.state;
        const {loading} = this.props;

        const title = this.props.modo == 'assoc' ? false : (this.props.match.params.id ? 'Alteração do conteúdo da peça' : 'Cadastro de conteúdo da peça')
        return (
            <div style={{padding: title ? 24 : 0}}>
                {title && <h2 className='section' style={{ textAlign: 'center', marginTop: 30 }}>{title}</h2>}  
                {title && <div style={{ textAlign: 'right', marginBottom: 5 }}>
                    <Button style={{marginRight: 5}} onClick={() => this.props.history.push('/pecas')} size='small' type='primary' ghost>Voltar para a lista de peças</Button>
                </div> }                     
                <Collapse  bordered={false} defaultActiveKey={['geral', 'partes', 'teoria']} >
                    <Panel className='anatome-panel' header={<Header loading={loading} error={this.checkError(['nome', 'regiao', 'sistema'])} contentQ={<p>Conteúdos trabalhados em várias disciplinas</p>} title="Conteúdo da peça" />} key='geral'>
                        <FormPeca {...model} {...options} onOpenSnackbar={this.props.onOpenSnackbar} somentePratica={somentePratica} erros={erros} onChange={this.onChange} onChangeSomentePratica={this.onChangeSomentePratica} />
                    </Panel>
                    <Panel className='anatome-panel' header={<Header loading={loading} error={this.checkError(['partes'])} contentQ={<p>Seleção dos conteúdos das peças que são trabalhados em uma disciplina</p>} title="Conhecimento Prático (CP)" />} key='partes'>
                        <FormPartes onRemoveParte={this.onRemoveParte} somentePratica={somentePratica} {...model} erros={erros} onChange={this.onChange} onChangeParte={this.onChangeParte} />
                    </Panel>
                    {!somentePratica && <Panel className='anatome-panel' header={<Header loading={loading} contentQ={<p>Roteiro com Peças Anatômicas Interativa (com localização já mapeada nas peças)</p>} title="Conhecimento Teórico (CT)" />} key='teoria'>
                        <FormTeoria {...model} onOpenSnackbar={this.props.onOpenSnackbar} erros={erros} onDeleteConteudoTeorico={this.onDeleteConteudoTeorico} onAddConteudoTeorico={this.onAddConteudoTeorico} onChange={this.onChange} onChangeConteudoTeorico={this.onChangeConteudoTeorico} />
                    </Panel>}
                </Collapse>
                {title && <div style={{ textAlign: 'center', marginTop: 15, marginBottom: 30 }}>
                <Button style={{ marginRight: 5 }} icon='rollback' onClick={() => this.props.onPush('/pecas')} size='large'>Voltar</Button>
                    <Button type='primary' icon='check' onClick={this.onSave} size='large'>Salvar conteúdo da peça</Button>
                </div>}                
                <Modal
                    title='Lista de pendências'
                    visible={open}
                    cancelText='Fechar'
                    onCancel={this.onClose}
                    okButtonProps={{style: {display: 'none'}}}
                >
                    <div>
                        {pendencias.length > 0 && <span style={{fontWeight: 'bold'}}>Partes não associadas a um conteúdo teórico:</span>}
                    <List
                        size="small"
                        locale={{ emptyText: 'Nenhuma pendência foi encontrada' }}
                        dataSource={pendencias}
                        renderItem={item => (<Item><Icon style={{marginTop: 3, marginRight: 10, color: 'red'}} type="warning" /> {item.nome}</Item>)}
                    />                        
                    </div>
                </Modal>
            </div>
        )
    }
     

    onChangeSomentePratica = somentePratica => this.setState({somentePratica})

    onClose = () => this.setState({open: false})

    onCheckPendencias = () => {
        const { conteudoTeorico, partes } = this.state.model;

        const pt = partes.map(p => p._id);
        const ctFlat = [].concat.apply([], conteudoTeorico.map(ct => ct.partes));
        const ctUnique = ctFlat.filter((item, pos) => ctFlat.indexOf(item) == pos);

        const ids = pt.filter(i => ctUnique.indexOf(i) < 0);

        const pendencias = partes.filter(p => ids.indexOf(p._id) != -1);

        this.setState({ pendencias, open: true })
    }


    checkError = campos => this.state.erros.campos.find(c => campos.indexOf(c) != -1) != undefined

    onChange = field => value => this.setState({ model: { ...this.state.model, [field]: value } })

    onChangeConteudoTeorico = (field, idx) => value => {
        const { model } = this.state;

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

    onAddConteudoTeorico = (isNew = false) => () => {
        const { conteudoTeorico } = this.state.model;

        if (isNew) {
            this.onChange('conteudoTeorico')([
                ...conteudoTeorico,
                { ...getModelConteudoTeorico(), _id: uuidv4() },                
            ])
        } else {
            this.onChange('conteudoTeorico')([
                ...conteudoTeorico,
                { ...getModelConteudoTeorico(), partes: [...conteudoTeorico[conteudoTeorico.length-1].partes], _id: uuidv4() },                
            ])
        }
        window.scrollTo(0,document.body.scrollHeight);
    }
   

    onDeleteConteudoTeorico = idx => () => {
        const { conteudoTeorico } = this.state.model;
        
        if(conteudoTeorico.length == 1){
            this.onChange('conteudoTeorico')([getModelConteudoTeorico()])            
        }else{
            this.onChange('conteudoTeorico')([
                ...conteudoTeorico.slice(0, idx),
                ...conteudoTeorico.slice(idx+1),
            ])            
        }
    } 


    onValidate = () => {
        const { nome, sistema, regiao, partes } = this.state.model;
        let campos = [], msgs = []

        if (nome == '') {
            campos = [...campos, 'nome'];
            msgs = [...msgs, 'Campo obrigatório'];
        }

        if (sistema == '') {
            campos = [...campos, 'sistema'];
            msgs = [...msgs, 'Campo obrigatório'];
        }

        if (regiao == '') {
            campos = [...campos, 'regiao'];
            msgs = [...msgs, 'Campo obrigatório'];
        }

        if (partes.length == 0) {
            campos = [...campos, 'partes'];
            msgs = [...msgs, 'Inclua ao menos uma parte à peça'];
        }

        return { campos, msgs }
    }

    onSave = () => {
        const { onOpenSnackbar, onSetAppState, onClose, onPush } = this.props;
        const { model } = this.state;

        const erros = this.onValidate();

        if (erros.campos.length > 0) {
            this.setState({ erros })
            onOpenSnackbar('Verique os erros de validação!')
            return false;
        }
        onOpenSnackbar('Salvando conteúdo da peça... Aguarde...', 'loading')
        onSetAppState({ loading: true })
        const body = {
            ...model,
            conteudoTeorico: model.conteudoTeorico.map(ct => ({
                ...ct,
                midias: ct.midias.map(({ original, ...resto }) => ({ ...resto }))
            }))
        }

        const _request = model._id != null ? request(`peca/${model._id}`, { method: 'PUT', body: JSON.stringify(body) }) : request('peca', { method: 'POST', body: JSON.stringify({...body, _id: uuidv4()}) })

        _request
            .then(ret => {
                if (ret.status == 200) {
                    onOpenSnackbar(`O conteúdo da peça ${model.nome} foi salvo com sucesso!`, 'success')
                    onSetAppState({ current: 'inicio' })
                    if(onClose){
                        onClose(true)
                    }else{
                        onPush('/pecas')
                    }
                    
                } else {
                    throw 'Não foi possível salvar o conteúdo da peça.'
                }
            })
            .catch(e => {
                onOpenSnackbar('Não foi possível salvar a peça')
                console.error(e)
            })
            .finally(() => {
                onSetAppState({ loading: false })
            })
    }

}

Peca.defaultProps = {
    onClose: false
}


export default withAppContext(Peca)
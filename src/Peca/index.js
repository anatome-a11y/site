import React, { Component, Fragment } from 'react';

import { Collapse, Button, Modal, List, Icon } from 'antd';

import { listaIdiomas, listaRegiao, listaSistema } from '../utils/mock'

import { request } from '../utils/data'

import FormPeca from './FormPeca'
import FormPartes from './FormPartes';
import FormTeoria from './FormTeoria';


import Header from '../components/Header'
import { withAppContext } from '../context';

const uuidv4 = require('uuid/v4');
const Panel = Collapse.Panel;
const Item = List.Item;

const _modelConteudoTeorico = {
    _id: uuidv4(),
    partes: [],
    midias: [],
    plural: '',
    singular: ''
}

class Peca extends Component {

    buttons = {
        submit: {
            key: 'btn-submit',
            type: 'primary',
            children: 'Salvar',
            size: 'large',
            onClick: () => this.onSave()
        },
        next: mode => ({
            key: 'btn-next-'+mode,
            type: 'primary',
            children: 'Pŕoximo',
            ghost: true,
            onClick: () => this.onChangePanel(mode)
        }),
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
            idioma: '1',
            sistema: '',
            regiao: '',
            partes: [],
            conteudoTeorico: [{ ..._modelConteudoTeorico }]
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
        loading: false,
        pendencias: [],
        open: false,
        somentePratica: false,
        clickUID: uuidv4(),
        activeKey: 'geral'
    }

    componentDidMount() {
        const { model, onSetButtons } = this.props;
        if (model) {
            this.setState({ model: {
                ...model, 
                conteudoTeorico: model.conteudoTeorico.map(ct => ({...ct, partes: ct.partes.map(p => p._id)}))
            }})
        }

        if(onSetButtons){
            onSetButtons([
                {...this.buttons.cancelar},
                {...this.buttons.submit}
            ]) 
        }       
    }


    render() {
        const { model, options, erros, loading, open, pendencias, somentePratica, clickUID } = this.state;

        const title = this.props.modo == 'assoc' ? false : (this.props.match.params.id ? 'Alteração de peça genérica' : 'Cadastro de peça genérica')
        return (
            <div style={{padding: title ? 24 : 0}}>
                {title && <h2 className='section' style={{ textAlign: 'center', marginTop: 50 }}>{title}</h2>}  
                {title && <div style={{ textAlign: 'right', marginBottom: 5 }}>
                    <Button style={{marginRight: 5}} onClick={() => this.props.history.push('/pecas')} size='small' type='primary' ghost>Voltar para peças</Button>
                </div> }                     
                <Collapse  bordered={false} defaultActiveKey={['geral', 'partes', 'teoria']} >
                    <Panel className='anatome-panel' header={<Header loading={loading} error={this.checkError(['nome', 'idioma', 'regiao', 'sistema'])} contentQ={<p>Conteúdos trabalhados em várias disciplinas</p>} title="Conteúdo digital da peça genérica" />} key='geral'>
                        <FormPeca {...model} {...options} somentePratica={somentePratica} erros={erros} onChange={this.onChange} onChangeSomentePratica={this.onChangeSomentePratica} />
                    </Panel>
                    <Panel className='anatome-panel' header={<Header loading={loading} error={this.checkError(['partes'])} contentQ={<p>Seleção dos conteúdos das peças genéricas que são trabalhados em uma disciplina</p>} title="Inclusão de conteúdo prático - Nome das partes anatômicas" />} key='partes'>
                        <FormPartes onRemoveParte={this.onRemoveParte} somentePratica={somentePratica} clickUID={clickUID} {...model} erros={erros} onChange={this.onChange} onChangeParte={this.onChangeParte} />
                    </Panel>
                    {!somentePratica && <Panel className='anatome-panel' header={<Header loading={loading} contentQ={<p>Roteiro com Peças Anatômicas Interativa (com localização já mapeada nas peças)</p>} title="Inclusão de conteúdo teórico - Informações teóricas associadas às partes anatômicas" />} key='teoria'>
                        <FormTeoria {...model} onOpenSnackbar={this.props.onOpenSnackbar} erros={erros} onDeleteConteudoTeorico={this.onDeleteConteudoTeorico} onAddConteudoTeorico={this.onAddConteudoTeorico} onChange={this.onChange} onChangeConteudoTeorico={this.onChangeConteudoTeorico} />
                    </Panel>}
                </Collapse>
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

    onChangePanel = activeKey => {
        const newState = activeKey == 'teoria' ? { clickUID: uuidv4() } : {};
        this.setState({ activeKey, ...newState })
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
                { ..._modelConteudoTeorico, _id: uuidv4() },                
            ])
        } else {
            this.onChange('conteudoTeorico')([
                ...conteudoTeorico,
                { ..._modelConteudoTeorico, partes: [...conteudoTeorico[0].partes], _id: uuidv4() },                
            ])
        }
    }

    onDeleteConteudoTeorico = idx => () => {
        const { conteudoTeorico } = this.state.model;
        
        if(conteudoTeorico.length == 1){
            this.onChange('conteudoTeorico')([
                { ..._modelConteudoTeorico, _id: uuidv4() },
            ])            
        }else{
            this.onChange('conteudoTeorico')([
                ...conteudoTeorico.slice(0, idx),
                ...conteudoTeorico.slice(idx+1),
            ])            
        }
    }    


    onValidate = () => {
        const { nome, idioma, sistema, regiao, partes } = this.state.model;
        let campos = [], msgs = []

        if (nome == '') {
            campos = [...campos, 'nome'];
            msgs = [...msgs, 'Campo obrigatório'];
        }

        if (idioma == '') {
            campos = [...campos, 'idioma'];
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
        const { onOpenSnackbar, onSetAppState, onClose } = this.props;
        const { model } = this.state;

        const erros = this.onValidate();

        if (erros.campos.length > 0) {
            this.setState({ erros })
            onOpenSnackbar('Verique os erros de validação!')
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

        const _request = model._id != null ? request(`peca/${model._id}`, { method: 'PUT', body: JSON.stringify(body) }) : request('peca', { method: 'POST', body: JSON.stringify({...body, _id: uuidv4()}) })

        _request
            .then(ret => {
                if (ret.status == 200) {
                    onOpenSnackbar(`O conteúdo digital da peça ${model.nome} foi salvo com sucesso!`, 'success')
                    onSetAppState({ current: 'inicio' })
                    onClose(true)
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


export default withAppContext(Peca)
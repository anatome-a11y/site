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
    descricao: '',
    pecaGenerica: ''
}

const _modelLocalizacao = {
    _id: uuidv4(),
    numero: '',
    referenciaRelativa: { ..._modelReferenciaRelativa },
    pecaFisica: ''
}

const _modelMapa = {
    parte: null,
    localizacao: [{ ..._modelLocalizacao }],
}


class Anatomp extends Component {


    state = {
        model: {
            nome: this.props.nome,
            roteiro: this.props.roteiro,
            instituicao: '',
            pecasFisicas: [{ ..._modelPecaFisica }],
            mapa: []
        },
        options: {
            listaRoteiros: [],
            listaPecasGenericas: []
        },
    }

    componentDidMount() {
        const { onOpenSnackbar, model, partesRoteiro } = this.props;
        const { options } = this.state;

        this.onSelectRoteiro(partesRoteiro)
        this.props.onSetAppState({ loading: true });

        Promise.all([
            request('peca', { method: 'GET' }),
            request('roteiro', { method: 'GET' }),
        ])
            .then(([p, roteiros]) => {
                if (p.status == 200 && roteiros.status == 200) {
                    const _model = model ? {
                        model: {
                            ...model,
                            roteiro: model.roteiro._id,
                            mapa: model.mapa.map(m => ({ ...m, localizacao: m.localizacao.map(l => ({ ...l, pecaFisica: l.pecaFisica._id })) }))
                        }
                    } : {};

                    this.setState({
                        ..._model,
                        options: {
                            ...options,
                            listaRoteiros: roteiros.data,
                            listaPecasGenericas: p.data
                        }
                    })
                } else {
                    throw p.error
                }
            })
            .catch(e => {
                const msg = typeof e === 'string' ? e : 'Falha ao obter os dados da peça';
                onOpenSnackbar(msg)
                console.error(e)
            })
            .finally(() => this.props.onSetAppState({ loading: false }))
    }

   

    componentWillReceiveProps(next) {
        if (JSON.stringify(this.props.partesRoteiro) != JSON.stringify(next.partesRoteiro)) {
            this.onSelectRoteiro(next.partesRoteiro)
        }

        if(this.props.sinalPeca != next.sinalPeca){
            this.onGetPecas()
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if ((JSON.stringify(this.state.model) != JSON.stringify(nextState.model)) && this.props.onChange) {
            this.props.onChange(nextState.model)
        }
    }


    render() {
        const { erros, loading } = this.props;
        const { model, options } = this.state;

        const title = this.props.modo == 'assoc' ? 'Associação de peça física' : (this.props.match.params.id ? 'Alteração de mapeamento' : 'Cadastro de mapeamento')

        return (
            <div style={{ padding: 24 }}>
                <h2 className='section' style={{ textAlign: 'center', marginTop: this.props.modo == 'assoc' ? 0 : 50 }}>{title}</h2>
                <Collapse bordered={false} defaultActiveKey={['geral', 'pecaFisica', 'mapeamento']} >
                    <Panel className='anatome-panel' header={<Header loading={loading} error={this.checkError(['nome', 'roteiro', 'instituicao'])} contentQ={<p>...</p>} title="An@tom-P (Peças anatômicas interativas)" />} key='geral'>
                        <FormGeral
                            {...model}
                            {...options}
                            erros={erros}
                            onChange={this.onChange}
                            modo={this.props.modo}
                            onSelectRoteiro={this.onSelectRoteiro}
                        />
                    </Panel>
                    <Panel className='anatome-panel' header={<Header loading={loading} error={this.checkError(['pecasFisicas'])} contentQ={<p>...</p>} title="Inclusão das informações das peças anatômicas físicas" />} key='pecaFisica'>
                        <FormPecasFisicas
                            {...model}
                            {...options}
                            isEdit={model.hasOwnProperty('_id')}
                            erros={erros}
                            onChange={this.onChange}
                            onAddPecaFisica={this.onAddPecaFisica}
                            onDeletePecaFisica={this.onDeletePecaFisica}
                            onChangePecaFisica={this.onChangePecaFisica}
                            onBlurPecaFisica={this.onBlurPecaFisica}
                        />
                        <div style={{ textAlign: 'right', marginBottom: 20, marginRight: 16 }}>
                            <Button style={{ marginRight: 5 }} onClick={this.onAddPecaFisica} type='primary' ghost icon='plus'>Peça física</Button>
                        </div>
                    </Panel>
                    <Panel className='anatome-panel' header={<Header loading={loading} error={this.checkError(['mapa'])} contentQ={<p>...</p>} title="Mapeamento do conteúdo digital para as peças físicas" />} key='mapeamento'>
                        <FormMapa
                            {...model}
                            erros={erros}
                            onChange={this.onChange}
                            onChangeMapa={this.onChangeMapa}
                            onAddPecaFisica={this.onAddPecaFisicaAoMapa}
                            onRemovePecaFisica={this.onRemovePecaFisicaDoMapa}
                        />
                    </Panel>
                </Collapse>
            </div>
        )
    }

    onGetPecas() {
        const { onOpenSnackbar } = this.props;
        const { options } = this.state;

        request('peca', { method: 'GET' })
            .then(p => {
                if (p.status == 200) {

                    this.setState({
                        options: {
                            ...options,
                            listaPecasGenericas: p.data
                        }
                    })
                } else {
                    throw p.error
                }
            })
            .catch(e => {
                const msg = typeof e === 'string' ? e : 'Falha ao obter os dados da peça';
                onOpenSnackbar(msg)
                console.error(e)
            })
            .finally(() => this.props.onSetAppState({ loading: false }))
    }     

    onSelectRoteiro = (partes, model) => {

        this.setState({
            model: {
                ...this.state.model,
                ...model,
                mapa: partes.map(p => ({
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
            ...pecasFisicas,
            { ..._modelPecaFisica, _id: uuidv4() },
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
                            { ..._modelLocalizacao, _id: uuidv4() },
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

        if (pecasFisicas.length == 1) {
            this.onChange('pecasFisicas')([
                { ..._modelPecaFisica, _id: uuidv4() },
            ])
        } else {
            this.onChange('pecasFisicas')([
                ...pecasFisicas.slice(0, idx),
                ...pecasFisicas.slice(idx + 1),
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
                            ...model.mapa[idx].localizacao.slice(idxLoc + 1),
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
                            { ...model.mapa[idx].localizacao[idxLoc], [field]: value },
                            ...model.mapa[idx].localizacao.slice(idxLoc + 1),
                        ]
                    },
                    ...model.mapa.slice(idx + 1),
                ]
            }
        })
    }

    onBlurPecaFisica = () => {
        if(!this.state.model.hasOwnProperty('_id')){
            const {mapa, pecasFisicas} = this.state.model;

            const pgUtilizadas = pecasFisicas.map(pf => pf.pecaGenerica);
            const pgUtilizadasUnicas = pgUtilizadas.filter(function(item, pos) {
                return pgUtilizadas.indexOf(item) == pos;
            })

            const pecasGenericas = pgUtilizadasUnicas.map(idPG => {
                const dadosPecaGenerica = this.state.options.listaPecasGenericas.find(pg => pg._id == idPG);
                return {partes: [], ...dadosPecaGenerica, pecasFisicas: pecasFisicas.filter(pf => pf.pecaGenerica == idPG)}
            });

            const _mapa = mapa.map(m => {
                const pecaGenerica = pecasGenericas.find(pg => pg.partes.find(p => p._id == m.parte._id) != undefined);

                if(pecaGenerica){
                    return {
                        ...m,
                        localizacao: pecaGenerica.pecasFisicas.map(pf => ({
                            ..._modelLocalizacao,
                            pecaFisica: pf._id,
                            _id: uuidv4(),
                            referenciaRelativa: {
                                ..._modelReferenciaRelativa,
                                _id: uuidv4()
                            }
                        }))
                    }
                }else{
                    return m
                }
            })  

            this.setState({ model: {...this.state.model, mapa: _mapa} })
        }        
    }

    checkError = campos => this.props.erros.campos.find(c => campos.indexOf(c) != -1) != undefined

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

}

Anatomp.defaultProps = {
    partesRoteiro: [],
    modo: '',
    nome: '',
    roteiro: '',
    sinalPeca: ''
}


export default Anatomp
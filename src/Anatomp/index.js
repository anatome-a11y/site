import React, { Component, Fragment } from 'react';

import { Collapse, Button, Modal, List, Icon } from 'antd';

import { request, Maybe } from '../utils/data'

import FormGeral from './FormGeral'
import FormPecasFisicas from './FormPecasFisicas';
import FormMapa from './FormMapa';

import { withAppContext } from '../context';
import Header from '../components/Header';

import { onSave as onSaveAnatomp } from '../Anatomp/utils';

const { v4: uuidv4 } = require('uuid');
const Panel = Collapse.Panel;
const Item = List.Item;

const getModelReferenciaRelativa = () => ({
    _id: uuidv4(),
    referenciaParaReferenciado: '',
    referenciadoParaReferencia: '',
    referencia: null,
})


const _modelPecaFisica = {
    _id: uuidv4(),
    nome: '',
    descricao: '',
    pecaGenerica: '',
    midias: [],
}

const getModelLocalizacao = () => ({
    _id: uuidv4(),
    numero: '',
    referenciaRelativa: getModelReferenciaRelativa(),
    pecaFisica: ''
})

const getModelPonto = () => ({
    _id: uuidv4(),
    label: '',
    parte: null,
    x: '',
    y: '',
})

const _modelMapa = {
    parte: null,
    localizacao: [getModelLocalizacao()],
    pontos: [getModelPonto()]
}


class Anatomp extends Component {


    state = {
        model: {
            nome: this.props.nome,
            roteiro: this.props.roteiro,
            instituicao: '',
            pecasFisicas: [{ ..._modelPecaFisica, _id: uuidv4() }],
            mapa: [],
            generalidades: [],
            tipoPecaMapeamento: 'pecaDigital',
        },
        options: {
            listaRoteiros: [],
            listaPecasGenericas: []
        },
    }

    componentDidMount() {
        const { onOpenSnackbar, partesRoteiro, onChange, onSetAppState, history } = this.props;
        const { options } = this.state;

        const model = Maybe(history).bind(h => h.location).bind(l => l.state).maybe(false, s => s.model);

        if (onChange) {
            onChange(this.state.model)
        }

        this.onSelectRoteiro(partesRoteiro)
        onSetAppState({ loading: true });

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
                            mapa: model.mapa.map(m => ({ ...m, localizacao: m.localizacao.map(l => ({ ...l, pecaFisica: l.pecaFisica._id, referenciaRelativa: { ...l.referenciaRelativa, referencia: l.referenciaRelativa.referencia == null ? null : l.referenciaRelativa.referencia._id } })) }))
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
            .finally(() => onSetAppState({ loading: false }))
    }



    componentWillReceiveProps(next) {
        if (JSON.stringify(this.props.partesRoteiro) != JSON.stringify(next.partesRoteiro)) {
            this.onSelectRoteiro(next.partesRoteiro)
        }

        if (this.props.sinalPeca != next.sinalPeca) {
            this.onGetPecas()
        }
    }


    componentWillUpdate(nextProps, nextState) {
        if ((JSON.stringify(this.state.model) != JSON.stringify(nextState.model)) && this.props.onChange) {
            this.props.onChange(nextState.model)
        }
    }


    componentWillUnmount() {
        this.props.onSetAppState({ erros: { campos: [], msgs: [] } })
    }


    render() {
        const { erros, loading, modo, match } = this.props;
        const { model, options } = this.state;

        const title = modo == 'assoc' ? 'Associação de peça física' : (match.params.id ? 'Alteração de roteiro setado' : 'Cadastro de roteiro setado')

        return (
            <div style={{ padding: 24 }}>
                <h2 className='section' style={{ textAlign: 'center', marginTop: modo == 'assoc' ? 0 : 30 }}>{title}</h2>
                {modo != 'assoc' && <div style={{ textAlign: 'right', marginBottom: 5 }}>
                    <Button onClick={() => this.props.history.push('/')} size='small' type='primary' ghost>Voltar para página inicial</Button>
                </div>}
                <Collapse bordered={false} defaultActiveKey={['geral', 'pecaFisica', 'mapeamento']} >
                    <Panel className='anatome-panel' header={<Header loading={loading} error={this.checkError(['nome', 'roteiro', 'instituicao'])} contentQ={<p>...</p>} title="Informações gerais do roteiro setado" />} key='geral'>
                        <FormGeral
                            {...model}
                            {...options}
                            erros={erros}
                            onChange={this.onChange}
                            modo={modo}
                            onOpenSnackbar={this.props.onOpenSnackbar}
                            isEdit={Maybe(match).bind(m => m.params).bind(p => p.id).maybe(false, i => true)}
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
                            onOpenSnackbar={this.props.onOpenSnackbar}
                            onChangeMidia={this.onChangeMidia}
                            onAddPecaFisica={this.onAddPecaFisica}
                            onDeletePecaFisica={this.onDeletePecaFisica}
                            onChangePecaFisica={this.onChangePecaFisica}
                            onBlurPecaFisica={this.onBlurPecaFisica}
                        />
                        <div style={{ textAlign: 'right', marginBottom: 20, marginRight: 16 }}>
                            <Button style={{ marginRight: 5 }} onClick={this.onAddPecaFisica} type='primary' ghost icon='plus'>Peça física</Button>
                        </div>
                    </Panel>
                    <Panel className='anatome-panel' header={<Header loading={loading} error={this.checkError(['mapa'])} contentQ={<p>...</p>} title="Associação entre o nome e a localização da parte na peça" />} key='mapeamento'>
                        <FormMapa
                            {...model}
                            erros={erros}
                            onChange={this.onChange}
                            onChangeMapa={this.onChangeMapa}
                            onChangeMapaCompleto={this.onChangeMapaCompleto}
                            onAddPecaFisica={this.onAddPecaFisicaAoMapa}
                            onRemovePecaFisica={this.onRemovePecaFisicaDoMapa}
                            onOpenSnackbar={this.props.onOpenSnackbar}
                            onChangePecaFisica={this.onChangePecaFisica}
                        />
                    </Panel>
                </Collapse>
                {
                    modo != 'assoc' && (
                        <div style={{ textAlign: 'center' }}>
                            <Button style={{ marginRight: 5 }} icon='rollback' onClick={() => this.props.onPush('/')} size='large'>Voltar</Button>
                            <Button type='primary' icon='check' onClick={this.onSubmit} size='large'>Salvar roteiro setado</Button>
                        </div>
                    )
                }
            </div>
        )
    }

    onSubmit = () => {
        onSaveAnatomp(this.props.onOpenSnackbar, this.props.onSetAppState, this.state.model, ret => {
            this.props.onOpenSnackbar(`O roteiro setado ${this.state.model.nome} foi salvo com sucesso!`, 'success');
            this.props.onPush('/')
        })
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

        const roteiro = this.state.options.listaRoteiros.find(r => r._id == model.roteiro)
        const extra = roteiro ? {
            options: {
                ...this.state.options,
                listaPecasGenericas: roteiro.pecasGenericas
            }
        } : {};


        this.setState({
            model: {
                ...this.state.model,
                ...model,
                mapa: partes.map(p => ({
                    ..._modelMapa,
                    parte: p,
                    localizacao: [{
                        ...getModelLocalizacao(),
                        referenciaRelativa: getModelReferenciaRelativa()
                    }]
                }))
            },
            ...extra
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
                            getModelLocalizacao(),
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

    onChangeMapa = (field, idx, idxLoc, extraProps) => value => {

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
                            { ...model.mapa[idx].localizacao[idxLoc], ...extraProps, [field]: value },
                            ...model.mapa[idx].localizacao.slice(idxLoc + 1),
                        ]
                    },
                    ...model.mapa.slice(idx + 1),
                ]
            }
        })
    }

    onChangeMapaCompleto = (mapaNovo) => {
        const { model } = this.state;
        this.setState({
            model: {
                ...model,
                mapa: mapaNovo
            }
        })
    }

    onChangeMapaCompleto = (mapaNovo) => {
        const { model } = this.state;
        this.setState({
            model: {
                ...model,
                mapa: mapaNovo
            }
        })
    }

    onBlurPecaFisica = () => {
        if (!this.state.model.hasOwnProperty('_id')) {
            const { mapa, pecasFisicas } = this.state.model;

            const pgUtilizadas = pecasFisicas.map(pf => pf.pecaGenerica);
            const pgUtilizadasUnicas = pgUtilizadas.filter(function (item, pos) {
                return pgUtilizadas.indexOf(item) == pos;
            })

            const pecasGenericas = pgUtilizadasUnicas.map(idPG => {
                const dadosPecaGenerica = this.state.options.listaPecasGenericas.find(pg => pg._id == idPG);
                return { partes: [], ...dadosPecaGenerica, pecasFisicas: pecasFisicas.filter(pf => pf.pecaGenerica == idPG) }
            });

            const _mapa = mapa.map(m => {
                const pecaGenerica = pecasGenericas.find(pg => pg.partes.find(p => p._id == m.parte._id) != undefined);

                if (pecaGenerica) {
                    return {
                        ...m,
                        localizacao: pecaGenerica.pecasFisicas.map(pf => ({
                            ...getModelLocalizacao(),
                            pecaFisica: pf._id,
                            referenciaRelativa: getModelReferenciaRelativa()
                        }))
                    }
                } else {
                    return m
                }
            })

            this.setState({ model: { ...this.state.model, mapa: _mapa } })
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


export default withAppContext(Anatomp)
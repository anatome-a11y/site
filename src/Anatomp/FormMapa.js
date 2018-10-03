import React, { Component, Fragment } from 'react';

import { List, Tooltip, Button, Input, Icon, Select, Modal, InputNumber } from 'antd'
import { filter } from '../utils/data'

import FormLocalizacao from './FormLocalizacao'

const uuidv4 = require('uuid/v4');
const { Option } = Select;

const { Item } = List;



class FormMapa extends Component {

    state = {
        loading: false,
        open: false,
        toEditRefRel: {
            model: {},
            idx: '',
            idxLoc: ''
        }
    }

    render() {
        const { loading, open, toEditRefRel } = this.state;
        const { onChangeMapa, mapa, pecasFisicas, onAddPecaFisica, onRemovePecaFisica } = this.props;

        return (
            <Fragment>
                <List
                    rowKey='_id'
                    size="small"
                    bordered={true}
                    locale={{ emptyText: 'Nenhum roteiro foi selecionado' }}
                    dataSource={mapa}
                    renderItem={(item, idx) => (
                        <Item key={item._id} actions={[
                            <Tooltip title='Adicionar peça física'><Button type='primary' ghost onClick={onAddPecaFisica(idx)} icon='plus' shape='circle' /></Tooltip>
                        ]}>
                            <div style={_style.item}>
                                <div style={{ width: '20%', marginRight: 5 }}>{item.parte.nome}</div>
                                <div style={{ width: '80%' }}>
                                    <List
                                        rowKey='_id'
                                        size="small"
                                        bordered={false}
                                        locale={{ emptyText: 'Nenhuma peça física foi adicionada' }}
                                        dataSource={item.localizacao}
                                        renderItem={(itemLoc, idxLoc) => (
                                            <Item key={itemLoc._id} actions={[
                                                <Tooltip title='Localização Relativa'><Button type='primary' ghost onClick={this.onOpenRefRel(itemLoc.referenciaRelativa, idx, idxLoc)} icon='compass' shape='circle' /></Tooltip>,
                                                <Tooltip title='Excluir'><Button type='primary' ghost onClick={onRemovePecaFisica(idx, idxLoc)} icon='delete' shape='circle' /></Tooltip>
                                            ]}>
                                                <div style={_style.item}>
                                                    <div style={{ width: 'calc(100% - 155px)', marginRight: 5 }}>
                                                        <Select
                                                            notFoundContent='Nenhuma peça física foi adicionada'
                                                            style={{ width: '100%' }}
                                                            placeholder="Peça física"
                                                            value={itemLoc.pecaFisica}
                                                            optionFilterProp="children"
                                                            filterOption={filter}
                                                            onChange={onChangeMapa('pecaFisica', idx, idxLoc)}
                                                        >
                                                            {(pecasFisicas.length == 1 && pecasFisicas[0].nome == '') ? null : pecasFisicas.map(({ nome, _id }) => <Option value={_id} key={_id}>{nome}</Option>)}
                                                        </Select>
                                                    </div>
                                                    <div style={{ width: 150 }}>
                                                        <InputNumber style={{ width: '100%' }} value={itemLoc.numero} onChange={onChangeMapa('numero', idx, idxLoc)} min={0} placeholder={`Nº da etiqueta`} />
                                                    </div>
                                                </div>
                                            </Item>)}
                                    />
                                </div>
                            </div>
                        </Item>)}
                />
                <Modal
                    title='Localização'
                    visible={open}
                    okText='Salvar'
                    onOk={this.onAppyChangeRefRel}
                    cancelText='Cancelar'
                    onCancel={this.onClose}
                >
                    <FormLocalizacao {...toEditRefRel} onChange={this.onChangeRefRel} />
                </Modal>
            </Fragment>
        )
    }


    onChangeRefRel = field => value => {
        const { toEditRefRel } = this.state;

        this.setState({
            toEditRefRel: {
                ...toEditRefRel,
                model: {
                    ...toEditRefRel.model,
                    [field]: value
                }
            }
        })
    }


    onAppyChangeRefRel = () => {
        const { toEditRefRel } = this.state;
        const { idx, idxLoc, model } = toEditRefRel;

        this.props.onChangeMapa('referenciaRelativa', idx, idxLoc)({ ...model });
        this.setState({
            open: false,
            toEditRefRel: {
                model: {},
                idx: '',
                idxLoc: ''
            }
        })
    }

    onOpenRefRel = (model, idx, idxLoc) => () => {

        this.setState({
            open: true,
            toEditRefRel: { model, idx, idxLoc }
        })
    }


    onClose = () => this.setState({ open: false })
}


const _style = {
    item: {
        display: 'flex',
        padding: 0,
        margin: 0,
        width: '100%'
    },
    textos: { display: 'flex', alignItems: 'center', flexDirection: 'column', width: '60%', marginRight: 5 }
}

export default FormMapa;
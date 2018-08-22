import React, { Component, Fragment } from 'react';

import { List, Tooltip, Button, Input, Icon, Select, Modal } from 'antd'
import { filter } from '../utils/data'

const uuidv4 = require('uuid/v4');
const { Option } = Select;

const { Item } = List;





class FormMapa extends Component {

    state = {
        loading: false,
        open: false
    }

    render() {
        const { loading, open } = this.state;
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
                            <Tooltip title='Adicionar peça física'><Button onClick={onAddPecaFisica(idx)} icon='plus' shape='circle' /></Tooltip>
                        ]}>
                            <div style={_style.item}>
                                <div style={{ width: '20%', marginRight: 5 }}>{item.parte.nome}</div>
                                <div style={{ width: '80%'}}>
                                    <List
                                        rowKey='_id'
                                        size="small"
                                        bordered={false}
                                        locale={{ emptyText: 'Nenhuma peça física foi adicionada' }}
                                        dataSource={item.localizacao}
                                        renderItem={(itemLoc, idxLoc) => (
                                            <Item key={itemLoc._id} actions={[
                                                <Tooltip title='Localização Relativa'><Button onClick={this.onOpen} icon='compass' shape='circle' /></Tooltip>,
                                                <Tooltip title='Excluir'><Button onClick={onRemovePecaFisica(idx, idxLoc)} icon='delete' shape='circle' /></Tooltip>
                                            ]}>
                                                <div style={_style.item}>
                                                    <div style={{ width: '70%', marginRight: 5 }}>
                                                        <Select
                                                            notFoundContent='Nenhuma peça física foi encontrada'
                                                            style={{ width: '100%' }}
                                                            placeholder="Peça física"
                                                            value={itemLoc.pecaFisica}
                                                            optionFilterProp="children"
                                                            filterOption={filter}
                                                            onChange={onChangeMapa('pecaFisica', idx, idxLoc)}
                                                        >
                                                            {pecasFisicas.map(({ nome, _id }) => <Option value={_id} key={_id}>{nome}</Option>)}
                                                        </Select>
                                                    </div>
                                                    <div style={{ width: '30%'}}>
                                                        <Input type='number' value={itemLoc.numero} onChange={e => onChangeMapa('numero', idx, idxLoc)(e.target.value)} placeholder={`Nº da etiqueta`} />
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
                    onOk={() => { }}
                    cancelText='Cancelar'
                    onCancel={this.onClose}
                >
                    <div>Nesta modal fica o formulário de localização. Como uma parte pode estar (ou deve poder estar)  em mais de uma peça física, a localização é feita para cada peça física adicionada</div>
                </Modal>
            </Fragment>
        )
    }


    onOpen = () => this.setState({ open: true })

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
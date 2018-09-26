import React, { Component, Fragment } from 'react';

import { List, Tooltip, Button, Input, Icon, Select } from 'antd'
import {filter} from '../utils/data'

const uuidv4 = require('uuid/v4');

const { Item } = List;
const { Option } = Select;





class FormPecasFisicas extends Component {

    state = {
        loading: false
    }

    render() {
        const { loading } = this.state;
        const { onChangePecaFisica, isEdit, partes, onAddPecaFisica, pecasFisicas, onDeletePecaFisica, listaPecasGenericas } = this.props;

        return (
            <Fragment>
                <div style={{ marginBottom: 10, textAlign: 'right' }}>
                    <Button style={{ marginRight: 5 }} onClick={onAddPecaFisica}><Icon type="plus" />Peça física</Button></div>
                <List
                    rowKey='_id'
                    size="small"
                    bordered={true}
                    locale={{ emptyText: 'Nenhuma peça física foi adicionada' }}
                    dataSource={pecasFisicas}
                    renderItem={(item, idx) => (
                        <Item key={item._id} actions={[
                            <Tooltip title='Excluir'><Button onClick={onDeletePecaFisica(idx)} icon='delete' shape='circle' /></Tooltip>
                        ]}>
                            <div style={_style.item}>
                                <div style={{ width: isEdit ? '40%' : '30%', marginRight: 5 }}>
                                    <Input value={item.nome} onChange={e => onChangePecaFisica('nome', idx)(e.target.value)} placeholder={`Nome da peça física`} />
                                </div>
                                {!isEdit && <div style={{ width: '30%', marginRight: 5 }}>
                                    <Select
                                        showSearch
                                        value={item.pecaGenerica}
                                        onChange={onChangePecaFisica('pecaGenerica', idx)}
                                        notFoundContent='Nada foi encontrado'
                                        optionFilterProp="children"
                                        filterOption={filter}
                                        placeholder='Peça genérica'
                                        style={{width: '100%'}}
                                    >
                                        {listaPecasGenericas.map(i => <Option key={i._id} value={i._id}>{i.nome}</Option>)}
                                    </Select>
                                </div>}
                                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', width: isEdit ? '60%' : '40%', marginRight: 5 }}>
                                    <Input value={item.descricao} onChange={e => onChangePecaFisica('descricao', idx)(e.target.value)} placeholder={`Descrição da peça física`} />
                                </div>
                            </div>
                        </Item>)}
                />
            </Fragment>
        )
    }
}


const _style = {
    item: {
        display: 'flex',
        padding: 0,
        margin: 0,
        width: '100%'
    }
}

export default FormPecasFisicas;
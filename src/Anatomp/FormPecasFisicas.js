import React, { Component, Fragment } from 'react';

import { List, Tooltip, Button, Input, Icon, Select, Form } from 'antd'
import { filter } from '../utils/data'


import Label from '../components/Label'

const uuidv4 = require('uuid/v4');

const { Item } = List;
const { Option } = Select;


const FormItem = Form.Item;


class FormPecasFisicas extends Component {

    state = {
        loading: false
    }

    componentWillReceiveProps(next) {
        if (this.props.pecasFisicas.length != next.pecasFisicas.length) {
            this.props.onBlurPecaFisica()
        }
    }

    render() {
        const { loading } = this.state;
        const { onChangePecaFisica, erros, isEdit, partes, onAddPecaFisica, pecasFisicas, onDeletePecaFisica, listaPecasGenericas, onBlurPecaFisica } = this.props;

        const _erros = {
            pecasFisicas: erros.campos.indexOf('pecasFisicas'),
        }

        return (
            <Form style={{ margin: 20 }}>
                <FormItem
                    validateStatus={_erros.pecasFisicas != -1 ? 'error' : ''}
                    help={erros.msgs[_erros.pecasFisicas] || ''}
                >
                    <Label>Inclua as informações sobre as peças físicas que terão os elementos anatômicos etiquetados e serão disponibilizadas aos estudantes para aprenderem o conteúdo deste roteiro usando o APP Anatome</Label>
                    <List                        
                        rowKey='_id'
                        size="small"
                        bordered={true}
                        locale={{ emptyText: 'Nenhuma peça física foi adicionada' }}
                        dataSource={pecasFisicas}
                        renderItem={(item, idx) => (
                            <Item key={item._id} actions={[
                                <Tooltip title='Excluir'><Button type='primary' ghost onClick={onDeletePecaFisica(idx)} icon='delete' shape='circle' /></Tooltip>
                            ]}>
                                <div style={_style.item}>
                                    <div style={{ width: isEdit ? '40%' : '30%', marginRight: 5 }}>
                                        <Input value={item.nome} onChange={e => onChangePecaFisica('nome', idx)(e.target.value)} placeholder={`Nome da peça física`} />
                                    </div>
                                    {!isEdit && <div style={{ width: '30%', marginRight: 5 }}>
                                        <Select
                                            showSearch
                                            value={item.pecaGenerica == "" ? undefined : item.pecaGenerica}
                                            onChange={onChangePecaFisica('pecaGenerica', idx)}
                                            notFoundContent='Nada foi encontrado'
                                            optionFilterProp="children"
                                            filterOption={filter}
                                            placeholder='Peça genérica associada'
                                            style={{ width: '100%' }}
                                            onBlur={onBlurPecaFisica}
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
                </FormItem>
            </Form>
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
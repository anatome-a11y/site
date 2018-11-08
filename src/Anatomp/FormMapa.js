import React, { Component, Fragment } from 'react';

import { List, Tooltip, Button, Checkbox, Form, Select, Modal, InputNumber } from 'antd'
import { filter } from '../utils/data'

import FormLocalizacao from './FormLocalizacao'

const uuidv4 = require('uuid/v4');
const { Option } = Select;

const { Item } = List;
const FormItem = Form.Item;


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
        const { onChangeMapa, mapa, pecasFisicas, onAddPecaFisica, onRemovePecaFisica, erros } = this.props;

        const _erros = {
            mapa: erros.campos.indexOf('mapa'),
        }

        console.log(mapa)

        return (
            <Form style={{ margin: 20 }}>
                <FormItem
                    validateStatus={_erros.mapa != -1 ? 'error' : ''}
                    help={erros.msgs[_erros.mapa] || ''}
                    label="Informe a localização das partes anatômicas nas peças físicas"
                >
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
                                                    <Checkbox checked={itemLoc.referenciaRelativa.referencia != ''} onChange={this.onOpenRefRel(itemLoc.referenciaRelativa, idx, idxLoc)}>Loc. Relativa</Checkbox>,
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
                        destroyOnClose={true}
                        title='Localização Relativa'
                        visible={open}
                        okText='Salvar'
                        onOk={() => this.onAppyChangeRefRel(this.state.toEditRefRel)}
                        cancelText='Cancelar'
                        onCancel={this.onClose}
                    >
                        <FormLocalizacao {...toEditRefRel} onChange={this.onChangeRefRel} partes={mapa.map(i => i.parte)} />
                    </Modal>
                </FormItem>
            </Form>
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


    onAppyChangeRefRel = ({ idx, idxLoc, model }) => {
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

    onOpenRefRel = (model, idx, idxLoc) => e => {
        if(e.target.checked){
            this.setState({
                open: true,
                toEditRefRel: { model, idx, idxLoc }
            })            
        }else{
            this.onAppyChangeRefRel({ idx, idxLoc, model: {...model, referencia: ''} })
        }
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
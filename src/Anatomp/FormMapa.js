import React, { Component, Fragment } from 'react';

import { List, Tooltip, Button, Checkbox, Form, Select, Modal, InputNumber } from 'antd'
import { filter } from '../utils/data'

import Label from '../components/Label'

import FormLocalizacao from './FormLocalizacao'
import { withI18n } from '../messages/withI18n';

const uuidv4 = require('uuid/v4');
const { Option } = Select;

const { Item } = List;
const FormItem = Form.Item;


class FormMapa extends Component {

    state = {
        loading: false,
        open: false,
        erroLocalizacao: null,
        toEditRefRel: {
            model: {},
            idx: '',
            idxLoc: '',
            item: null
        }
    }

    render() {
        const { loading, open, toEditRefRel, erroLocalizacao } = this.state;
        const { onChangeMapa, mapa, pecasFisicas, onAddPecaFisica, onRemovePecaFisica, erros, i18n } = this.props;

        const _erros = {
            mapa: erros.campos.indexOf('mapa'),
        }

        return (
            <Form style={{ margin: 20 }}>
                <FormItem
                    validateStatus={_erros.mapa != -1 ? 'error' : ''}
                    help={erros.msgs[_erros.mapa] || ''}
                >
                    <Label>{i18n('pinnedScript.sections.assocBetweenNameAndLoc.description')}</Label>
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
                                            renderItem={(itemLoc, idxLoc) => {
                                                const hasRefRel = itemLoc.referenciaRelativa.referencia != null;

                                                return (
                                                    <Item key={itemLoc._id} actions={[
                                                        <div>
                                                            <Checkbox checked={hasRefRel} onChange={this.onOpenRefRel(itemLoc.referenciaRelativa, idx, idxLoc, item)}/>
                                                    <a onClick={() => this.onOpenRefRel(itemLoc.referenciaRelativa, idx, idxLoc, item)({target: {checked: true}})}>{i18n('common.relativeLocation')}</a>
                                                        </div>,
                                                        <Tooltip title='Excluir'><Button type='primary' ghost onClick={onRemovePecaFisica(idx, idxLoc)} icon='delete' shape='circle' /></Tooltip>
                                                    ]}>
                                                        <div style={_style.item}>
                                                            <div style={{ width: 'calc(100% - 155px)', marginRight: 5 }}>
                                                                <Select
                                                                    showSearch
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
                                                                <InputNumber disabled={hasRefRel} style={{ width: '100%' }} value={itemLoc.numero} onChange={onChangeMapa('numero', idx, idxLoc)} min={0} placeholder={`Nº da etiqueta`} />
                                                            </div>
                                                        </div>
                                                    </Item>)
                                            }}
                                        />
                                    </div>
                                </div>
                            </Item>)}
                    />
                    <Modal
                        destroyOnClose={true}
                        title='Localização Relativa'
                        visible={open}
                        okText={i18n('actions.save')}
                        onOk={() => this.onAppyChangeRefRel(this.state.toEditRefRel)}
                        cancelText={i18n('actions.cancel')}
                        onCancel={this.onClose}
                    >
                        <FormLocalizacao erroLocalizacao={erroLocalizacao} {...toEditRefRel} onChange={this.onChangeRefRel} partes={mapa.map(i => i.parte)} />
                    </Modal>
                </FormItem>
            </Form>
        )
    }


    onChangeRefRel = field => value => {
        const { toEditRefRel } = this.state;

        this.setState({
            erroLocalizacao: null,
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
        const itemMapa = this.props.mapa.find(m => m.parte._id == model.referencia);
        if(itemMapa){
            const {numero} = itemMapa.localizacao[idxLoc];
            if(numero){
                this.props.onChangeMapa('referenciaRelativa', idx, idxLoc, {numero})({ ...model });
                this.onClearRefRel()
            }else{
                this.setState({erroLocalizacao: 'A localização desta parte ainda não foi setada'})
                // this.props.onOpenSnackbar(`Informe a localização desta parte para utilizá-la como referência`, 'warning');
            }            
        }else{
            this.props.onChangeMapa('referenciaRelativa', idx, idxLoc)({ ...model });
            this.onClearRefRel()            
        }
    }

    onClearRefRel = () => {
            this.setState({
                open: false,
                erroLocalizacao: null,
                toEditRefRel: {
                    model: {},
                    idx: '',
                    idxLoc: '',
                    item: null
                }
            })        
    }

    onOpenRefRel = (model, idx, idxLoc, item) => e => {
        if(e.target.checked){
            this.setState({
                open: true,
                erroLocalizacao: null,
                toEditRefRel: { model, idx, idxLoc, item }
            })            
        }else{
            this.props.onChangeMapa('referenciaRelativa', idx, idxLoc)({...model, referencia: null});
            this.onClearRefRel()
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

export default withI18n(FormMapa);
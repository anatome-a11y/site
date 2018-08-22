import React, { Component, Fragment } from 'react';

import { List, Modal, Tooltip, Button, Select, Input, Icon, Upload, Spin } from 'antd'

import Midia from '../components/Midia'
import { filter } from '../utils/data'
import * as filestack from 'filestack-js';

const uuidv4 = require('uuid/v4');

const { Item } = List;
const { Option } = Select;

const client = filestack.init('AHygjPe34Q2GWp3UI9BrQz');


class FormTeoria extends Component {

    state = {
        loading: false,
        open: false,
        toDelete: ''
    }

    render() {
        const { loading, open, toDelete } = this.state;
        const { conteudoTeorico, onChangeConteudoTeorico, partes, onAddConteudoTeorico, onDeleteConteudoTeorico } = this.props;

        return (
            <Fragment>
                <div style={{ marginBottom: 10, textAlign: 'right' }}>
                    <Button style={{ marginRight: 5 }} onClick={onAddConteudoTeorico()}><Icon type="plus" />Adicionar CT</Button>
                    <Button onClick={onAddConteudoTeorico(true)}><Icon type="plus" />Adicionar CT a nova parte</Button>
                </div>
                <List
                    rowKey='_id'
                    size="small"
                    bordered={true}
                    locale={{ emptyText: 'Esta peça não possui informações teóricas' }}
                    dataSource={conteudoTeorico}
                    renderItem={(item, idx) => (
                        <Item key={item._id} actions={[
                            <Upload showUploadList={false} onChange={this.onUpload(idx, item.midias)} beforeUpload={this.beforeUpload(item._id)}>
                                <Tooltip title='Adicionar mídia'>
                                    <Button shape='circle' icon='paper-clip' disabled={loading} />
                                </Tooltip>
                            </Upload>,
                            <Tooltip title='Excluir'><Button onClick={this.setItem2Delete(idx)} icon='delete' shape='circle' /></Tooltip>
                        ]}>
                            <div style={_style.item}>
                                <div style={{ width: '40%', marginRight: 5 }}>
                                    <Select
                                        notFoundContent='Nenhuma parte foi encontrada'
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        placeholder="Partes da peça"
                                        value={item.partes}
                                        optionFilterProp="children"
                                        filterOption={filter}
                                        onChange={onChangeConteudoTeorico('partes', idx)}
                                    >
                                        {partes.map(({ nome, _id }) => <Option value={_id} key={_id}>{nome}</Option>)}
                                    </Select>
                                </div>
                                <div style={_style.textos}>
                                    {item.partes.length > 1 && <Input style={{ marginBottom: 10 }} value={item.plural} onChange={e => onChangeConteudoTeorico('plural', idx)(e.target.value)} placeholder={`Conteúdo teórico - Plural`} />}
                                    <Input value={item.singular} onChange={e => onChangeConteudoTeorico('singular', idx)(e.target.value)} placeholder={`Conteúdo teórico - Singular`} />
                                </div>
                                <div style={{ alignSelf: 'center' }}>
                                    {item.midias.map((t, idxMidia) => <Fragment key={t._id}><Midia file={t} idx={idxMidia} midias={item.midias} onChange={onChangeConteudoTeorico('midias', idx)} /></Fragment>)}
                                    {loading == item._id ? <Spin /> : null}
                                </div>
                            </div>
                        </Item>)}
                />
                <Modal
                    title={'Excluir conteúdo teórico'}
                    visible={open}
                    okText='Excluir'
                    onOk={this.onDelete}
                    cancelText='Cancelar'
                    onCancel={this.onClose}
                    okButtonProps={{ loading }}
                    cancelButtonProps={{ loading }}
                >
                    {this.getBody()}
                </Modal>
            </Fragment>
        )
    }


    getBody = () => {
        const { toDelete } = this.state;
        const { conteudoTeorico } = this.props;

        if (toDelete !== '') {
            return (
                <div>
                    <p>Deseja realmente excluir o conteúdo teórico:</p>
                    <ul>
                        {conteudoTeorico[toDelete].plural && <li>{conteudoTeorico[toDelete].plural}</li>}
                        {conteudoTeorico[toDelete].singular && <li>{conteudoTeorico[toDelete].singular}</li>}
                    </ul>
                </div>
            )
        }else{
            return null
        }
    }


    setItem2Delete = idx => () => this.setState({ open: true, toDelete: idx })

    onClose = () => this.setState({ open: false, toDelete: '' })

    onDelete = () => {
        const {toDelete} = this.state;
        this.onClose();
        this.props.onDeleteConteudoTeorico(toDelete)()
    }

    beforeUpload = _id => () => {
        this.setState({ loading: _id })
        return false
    }

    onUpload = (idx, midias) => info => {
        const { onChangeConteudoTeorico, onOpenS } = this.props;
        if (info.file.status !== 'uploading') {
            //Adiciona
            if (midias.find(f => f.uid == info.file.uid) == undefined) {
                const { uid, type, name } = info.file;
                const token = {};

                client.upload(info.file, {}, {}, token)
                    .then(res => {
                        this.setState({ loading: false });
                        onChangeConteudoTeorico('midias', idx)([...midias, {
                            _id: uuidv4(),
                            type,
                            name,
                            tags: [],
                            url: res.url,
                            handle: res.handle,
                            original: info.file
                        }])
                    })
                    .catch(err => {
                        console.log(err)
                    });

            } else {
                onChangeConteudoTeorico('midias', idx)(midias.filter(f => f.uid != info.file.uid))
            }
        }
        // if (info.file.status === 'done') {
        //     message.success(`${info.file.name} foi carregado com sucesso!`);
        // } else if (info.file.status === 'error') {
        //     message.error(`Não foi possível carregar o arquivo ${info.file.name}`);
        // }

    }

    onCopy = idx => () => {
        const { onChange, conteudoTeorico } = this.props;

        onChange('conteudoTeorico')([
            ...conteudoTeorico.slice(0, idx),
            { ...conteudoTeorico[idx] },
            { ...conteudoTeorico[idx], _id: uuidv4() },
            ...conteudoTeorico.slice(idx + 1),
        ])
    }
}


const _style = {
    item: {
        display: 'flex',
        padding: 0,
        margin: 0,
        width: '100%'
    },
    textos: { display: 'flex', alignItems: 'center', flexDirection: 'column', width: '40%', marginRight: 5 }
}

export default FormTeoria;
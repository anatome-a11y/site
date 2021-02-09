import React, { Component, Fragment } from 'react';

import { List, Modal, Tooltip, Button, Select, Input, Icon, Upload, Spin, Row, Col, Form } from 'antd'

import Midia from '../components/Midia'
import Label from '../components/Label'
import { filter } from '../utils/data'

const { v4: uuidv4 } = require('uuid');

const { Item } = List;
const { Option } = Select;

const firebase = window.firebase;
const firebaseRef = firebase.storage().ref();



class FormItemTeoria extends Component {
    render() {
        const { item, idx, onChange, partes, loading } = this.props;
        return (
            <div style={_style.item}>
                <div style={{ width: '40%', marginRight: 5 }}>
                    <Select
                        notFoundContent='Nenhuma parte foi encontrada'
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Parte(s) da peça"
                        value={item.partes}
                        optionFilterProp="children"
                        filterOption={filter}
                        onChange={onChange('partes', idx)}
                    >
                        {partes.map(({ nome, _id }) => <Option value={_id} key={_id}>{nome}</Option>)}
                    </Select>
                </div>
                <div style={_style.textos}>
                    {item.partes.length > 1 && <Input onBlur={this.onBlur(idx, item)} style={{ marginBottom: 10 }} value={item.plural} onChange={e => onChange('plural', idx)(e.target.value)} placeholder={`Conhecimento Teórico - Plural`} />}
                    <Input value={item.singular} onChange={e => onChange('singular', idx)(e.target.value)} placeholder={`Conhecimento Teórico - Singular`} />
                </div>
                <div style={{ alignSelf: 'center' }}>
                    {item.midias.map((t, idxMidia) => <Fragment key={t._id}><Midia file={t} idx={idxMidia} midias={item.midias} onChange={onChange('midias', idx)} /></Fragment>)}
                    {loading == item._id ? <Spin /> : null}
                </div>
            </div>
        )
    }

    onBlur = (idx, item) => e => {
        const val = item.plural.charAt(0).toLowerCase() + item.plural.slice(1)
        this.props.onChange('singular', idx)('É um dos ' + val);
    }
}



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
            <Form layout="vertical">
                <Row gutter={16}>
                    <Col>
                        <Label>Selecione uma ou mais partes anatômicas e, em seguida, informe o Conhecimento Teórico associado sem citar o nome da(s) parte(s). Acesse a ajuda ou exemplos para mais informações</Label>
                        <List
                            style={{marginBottom: 20}}
                            rowKey='_id'
                            size="small"
                            bordered={true}
                            locale={{ emptyText: 'Esta peça não possui informações teóricas' }}
                            dataSource={conteudoTeorico}
                            renderItem={(item, idx) => (
                                <Item key={item._id} actions={[
                                    <Upload showUploadList={false} onChange={this.onUpload(idx, item.midias)} beforeUpload={this.beforeUpload(item._id)}>
                                        <Tooltip title='Adicionar mídia'>
                                            <Button type='primary' ghost shape='circle' icon='paper-clip' disabled={loading} />
                                        </Tooltip>
                                    </Upload>,
                                    <Tooltip title='Excluir'><Button type='primary' ghost onClick={this.setItem2Delete(idx)} icon='delete' shape='circle' /></Tooltip>
                                ]}>
                                    <FormItemTeoria partes={partes} loading={loading} item={item} idx={idx} onChange={onChangeConteudoTeorico} />
                                </Item>)}
                        />
                        <div style={{ marginBottom: 20, marginRight: 0, textAlign: 'right' }}>
                            <Button ghost type='primary' disabled={loading} style={{ marginRight: 5 }} onClick={onAddConteudoTeorico()}><Icon type="plus" />Adicionar CT</Button>
                            <Button ghost type='primary' disabled={loading} onClick={onAddConteudoTeorico(true)}><Icon type="plus" />Adicionar CT a nova parte</Button>
                        </div>
                    </Col>
                </Row>
                <Modal
                    title={'Excluir Conhecimento Teórico'}
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
            </Form>
        )
    }


    getBody = () => {
        const { toDelete } = this.state;
        const { conteudoTeorico } = this.props;

        if (toDelete !== '') {
            return (
                <div>
                    <p>Deseja realmente excluir o Conhecimento Teórico:</p>
                    <ul>
                        {conteudoTeorico[toDelete].plural && <li>{conteudoTeorico[toDelete].plural}</li>}
                        {conteudoTeorico[toDelete].singular && <li>{conteudoTeorico[toDelete].singular}</li>}
                    </ul>
                </div>
            )
        } else {
            return null
        }
    }


    setItem2Delete = idx => () => this.setState({ open: true, toDelete: idx })

    onClose = () => this.setState({ open: false, toDelete: '' })

    onDelete = () => {
        const { toDelete } = this.state;
        this.onClose();
        this.props.onDeleteConteudoTeorico(toDelete)()
    }

    beforeUpload = _id => () => {
        this.setState({ loading: _id })
        return false
    }

    onUpload = (idx, midias) => info => {
        const { onChangeConteudoTeorico, onOpenS, onOpenSnackbar } = this.props;
        if (info.file.status !== 'uploading') {
            //Adiciona
            if (midias.find(f => f.uid == info.file.uid) == undefined) {
                const { uid, type } = info.file;
                const token = {};

                const name = (+new Date()) + '-' + info.file.name;
                const metadata = { contentType: info.file.type };

                const task = firebaseRef.child(name).put(info.file, metadata);

                task
                    .then(snapshot => snapshot.ref.getDownloadURL())
                    .then(url => {
                        this.setState({ loading: false });
                        onChangeConteudoTeorico('midias', idx)([...midias, {
                            _id: uuidv4(),
                            type,
                            name,
                            tags: [],
                            url,
                            original: info.file
                        }])
                    })
                    .catch(err => {
                        onOpenSnackbar(err.message)
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
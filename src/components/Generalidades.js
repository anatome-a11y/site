import React, { Component, Fragment } from 'react';

import { List, Modal, Tooltip, Button, Select, Input, Icon, Upload, Spin } from 'antd'

import Midia from '../components/Midia'

const { v4: uuidv4 } = require('uuid');

const { Item } = List;

const firebase = window.firebase;
const firebaseRef = firebase.storage().ref();

const getModelGeneralidade = () => ({
    _id: uuidv4(),
    texto: '',
    midias: [],
})



class FormItemGeneralidade extends Component {

    ref = null;

    componentDidMount() {
        if(this.props.sinalNovo != ''){
            this.ref.focus()
        }
    }

    render() {
        const { item, idx, onChange, loading, onEnter, placeholder } = this.props;
        return (
            <div style={_style.item}>
                <div style={_style.textos}>
                    <Input ref={r => this.ref = r} onPressEnter={onEnter} value={item.texto} onChange={e => onChange('texto', idx)(e.target.value)} placeholder={placeholder} />
                </div>
                <div style={{ alignSelf: 'center' }}>
                    {item.midias.map((t, idxMidia) => <Fragment key={t._id}><Midia file={t} idx={idxMidia} midias={item.midias} onChange={onChange('midias', idx)} /></Fragment>)}
                    {loading == item._id ? <Spin /> : null}
                </div>
            </div>
        )
    }
}

FormItemGeneralidade.defaultProps = {
    placeholder: 'Generalidades'
}



class Generalidades extends Component {

    state = {
        sinalNovo: '',
        loading: false,
        open: false,
        toDelete: '',
        itens: this.props.defaultValue.length > 0 ? this.props.defaultValue : [getModelGeneralidade()]
    }


    componentWillReceiveProps(next) {
        if (this.props.defaultValue.length == 0 && next.defaultValue.length > 0) {
            this.setState({ itens: next.defaultValue })
        }
    }


    componentWillUpdate(nextProps, nextState) {
        if (JSON.stringify(this.state.itens) != JSON.stringify(nextState.itens)) {
            this.props.onChange(nextState.itens)
        }
    }


    render() {
        const { loading, open, itens, sinalNovo } = this.state;

        return (
            <Fragment>
                <List
                    rowKey='_id'
                    size="small"
                    bordered={true}
                    locale={{ emptyText: 'Nenhuma generalidade adicionada' }}
                    dataSource={itens}
                    renderItem={(item, idx) => (
                        <Item key={item._id} actions={[
                            <Upload showUploadList={false} onChange={this.onUpload(idx, item.midias)} beforeUpload={this.beforeUpload(item._id)}>
                                <Tooltip title='Adicionar mídia'>
                                    <Button type='primary' ghost shape='circle' icon='paper-clip' disabled={loading} />
                                </Tooltip>
                            </Upload>,
                            <Tooltip title='Excluir'><Button type='primary' ghost onClick={this.setItem2Delete(idx)} icon='delete' shape='circle' /></Tooltip>
                        ]}>
                            <FormItemGeneralidade placeholder={this.props.placeholder} sinalNovo={sinalNovo} onEnter={this.onAdd} loading={loading} item={item} idx={idx} onChange={this.onChange} />
                        </Item>)}
                />
                <div style={{ marginTop: 5, textAlign: 'right' }}>
                    <Button ghost type='primary' disabled={loading} style={{ marginRight: 5 }} onClick={this.onAdd}><Icon type="plus" />Adicionar</Button>
                </div>
                <Modal
                    title={'Excluir generalidade'}
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
        const { toDelete, itens } = this.state;

        if (toDelete !== '') {
            return (
                <div>
                    <p>Deseja realmente excluir a generalidade:</p>
                    <ul>
                        {itens[toDelete].texto && <li>{itens[toDelete].texto}</li>}
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
        const { itens, toDelete } = this.state;
        this.onClose();

        if (itens.length == 1) {
            this.setState({ itens: [getModelGeneralidade()] })
        } else {
            this.setState({
                itens: [
                    ...itens.slice(0, toDelete),
                    ...itens.slice(toDelete + 1),
                ]
            })
        }
    }

    onChange = (field, idx) => value => {
        const { itens } = this.state;

        this.setState({
            itens: [
                ...itens.slice(0, idx),
                { ...itens[idx], [field]: value },
                ...itens.slice(idx + 1),
            ]
        })
    }

    onAdd = () => {
        const { itens } = this.state;

        this.setState({
            sinalNovo: + new Date(),
            itens: [
                ...itens,
                getModelGeneralidade(),
            ]
        })
    }

    beforeUpload = _id => () => {
        this.setState({ loading: _id })
        return false
    }

    onUpload = (idx, midias) => info => {
        const { onOpenSnackbar } = this.props;
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
                        this.onChange('midias', idx)([...midias, {
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
                this.onChange('midias', idx)(midias.filter(f => f.uid != info.file.uid))
            }
        }

    }
}


const _style = {
    item: {
        display: 'flex',
        padding: 0,
        margin: 0,
        width: '100%'
    },
    textos: { display: 'flex', alignItems: 'center', flexDirection: 'column', width: '70%', marginRight: 5 }
}


Generalidades.defaultProps = {
    defaultValue: [getModelGeneralidade()]
}

export default Generalidades;
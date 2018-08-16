import React, { Component, Fragment } from 'react';

import { List, Popover, Tooltip, Button, Select, Input, Icon, Upload, Tag } from 'antd'

import Midia from '../components/Midia'

const uuidv4 = require('uuid/v4');

const { Item } = List;
const { Option } = Select;




class FormTeoria extends Component {


    render() {
        const { conteudoTeorico, onChangeConteudoTeorico, partes, onAddConteudoTeorico } = this.props;

        return (
            <Fragment>
                <div style={{ marginBottom: 10, textAlign: 'right' }}>
                    <Button style={{marginRight: 5}} onClick={onAddConteudoTeorico()}><Icon type="plus" />Adicionar CT</Button>
                    <Button onClick={onAddConteudoTeorico(true)}><Icon type="plus" />Adicionar CT a nova parte</Button>
                </div>                
                <List
                    size="small"
                    bordered={true}
                    locale={{ emptyText: 'Esta peça não possui informações teóricas' }}
                    dataSource={conteudoTeorico}
                    renderItem={(item, idx) => (
                        <Item key={item.id} actions={[
                            <Upload showUploadList={false} onChange={this.onUpload(idx, item.midias)} beforeUpload={this.beforeUpload}>
                                <Tooltip title='Adicionar mídia'>
                                    <Button shape='circle' icon='paper-clip' />
                                </Tooltip></Upload>,                                 
                                <Tooltip title='Excluir'><Button onClick={this.onDelete(idx)} icon='delete' shape='circle' /></Tooltip>
                                ]}>
                            <div style={_style.item}>
                                <div style={{ width: '40%', marginRight: 5 }}>
                                    <Select
                                        notFoundContent='Nenhuma parte foi encontrada'
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        placeholder="Partes da peça"
                                        value={item.partes}
                                        optionFilterProp='nome'
                                        filterOption={true}
                                        onChange={onChangeConteudoTeorico('partes', idx)}
                                    >
                                        {partes.map(({ nome, id }) => <Option value={id} key={id}>{nome}</Option>)}
                                    </Select>
                                </div>
                                <div style={_style.textos}>
                                    {item.partes.length > 1 && <Input style={{ marginBottom: 10 }} value={item.plural} onChange={e => onChangeConteudoTeorico('plural', idx)(e.target.value)} placeholder={`Conteúdo teórico - Plural`} />}
                                    <Input value={item.singular} onChange={e => onChangeConteudoTeorico('singular', idx)(e.target.value)} placeholder={`Conteúdo teórico - Singular`} />
                                </div>
                                <div style={{alignSelf: 'center'}}>
                                    {item.midias.map((t, idxMidia) => <Midia key={t.uid} file={t} idx={idxMidia} midias={item.midias} onChange={onChangeConteudoTeorico('midias', idx)} />)}
                                </div>
                            </div>
                        </Item>)}
                />
            </Fragment>
        )
    }

    beforeUpload = () => false

    onUpload = (idx, midias) => info => {
        const { onChangeConteudoTeorico,  } = this.props;
        if (info.file.status !== 'uploading') {
            if (midias.find(f => f.uid == info.file.uid) == undefined) {
                const { uid, type, name } = info.file;
                onChangeConteudoTeorico('midias', idx)([...midias, { id: uuidv4(), uid, type, name, tags: [], original: info.file }])
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
        const {onChange, conteudoTeorico} = this.props;

        onChange('conteudoTeorico')([
            ...conteudoTeorico.slice(0, idx),
            {...conteudoTeorico[idx]},
            {...conteudoTeorico[idx], id: uuidv4()},
            ...conteudoTeorico.slice(idx+1),
        ])
    }

    onDelete = idx => () => {
        const {onChange, conteudoTeorico} = this.props;

        onChange('conteudoTeorico')([
            ...conteudoTeorico.slice(0, idx),
            ...conteudoTeorico.slice(idx+1),
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
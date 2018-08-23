import React, { Component, Fragment } from 'react';

import { List, Tooltip, Button, Input, Icon } from 'antd'

const uuidv4 = require('uuid/v4');

const { Item } = List;





class FormPecasFisicas extends Component {

    state = {
        loading: false
    }

    render() {
        const { loading } = this.state;
        const { onChangePecaFisica, partes, onAddPecaFisica, pecasFisicas, onDeletePecaFisica } = this.props;

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
                                <div style={{ width: '40%', marginRight: 5 }}>
                                    <Input value={item.nome} onChange={e => onChangePecaFisica('nome', idx)(e.target.value)} placeholder={`Nome da peça física`} />
                                </div>
                                <div style={_style.textos}>
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
    },
    textos: { display: 'flex', alignItems: 'center', flexDirection: 'column', width: '60%', marginRight: 5 }
}

export default FormPecasFisicas;
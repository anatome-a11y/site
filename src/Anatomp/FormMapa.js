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
        const { onChangeMapa, mapa, pecasFisicas, onAddLocalizacao } = this.props;

        return (
            <Fragment>
                <List
                    rowKey='id'
                    size="small"
                    bordered={true}
                    locale={{ emptyText: 'Nenhuma peça física foi adicionada' }}
                    dataSource={mapa}
                    renderItem={(item, idx) => (
                        <Item key={item.id} actions={[
                            <Tooltip title='Localização'><Button onClick={this.onOpen} icon='compass' shape='circle' /></Tooltip>
                        ]}>
                            <div style={_style.item}>
                                <div style={{ width: '30%', marginRight: 5 }}>{item.parte.nome}</div>
                                <div style={{ width: '40%', marginRight: 5 }}>
                                <Select
                                        notFoundContent='Nenhuma peça física foi encontrada'
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        placeholder="Peças físicas"
                                        value={item.pecasFisicas}
                                        optionFilterProp="children"
                                        filterOption={filter}
                                        onChange={onChangeMapa('pecasFisicas', idx)}
                                    >
                                        {pecasFisicas.map(({ nome, id }) => <Option value={id} key={id}>{nome}</Option>)}
                                    </Select>                                
                                </div>
                                <div style={{ width: '15%', marginRight: 5 }}>
                                    <Input type='number' value={item.numero} onChange={e => onChangeMapa('numero', idx)(e.target.value)} placeholder={`Nº da etiqueta`} />
                                </div>
                                <div style={{ width: '15%' }}>
                                {item.localizacao.map(l => <Tooltip key={l.pecaFisica.id} title={`Localização em ${l.pecaFisica.nome}`}><Button onClick={() => {}} icon='compass' shape='circle' /></Tooltip>)}
                                </div>                                
                            </div>
                        </Item>)}
                />
                <Modal
                    title='Localização'
                    visible={open}
                    okText='Salvar'
                    onOk={() => {}}
                    cancelText='Cancelar'
                    onCancel={this.onClose}                    
                >
                    <div>Nesta modal fica o formulário de localização. Como uma parte pode estar (ou deve poder estar)  em mais de uma peça física, a localização é feita para cada peça física adicionada</div>
                </Modal>                
            </Fragment>
        )
    }


    onOpen = () => this.setState({open: true})

    onClose = () => this.setState({open: false})
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
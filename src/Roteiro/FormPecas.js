import React, { Component, Fragment } from 'react';

import { Form, Input, List, TreeSelect, Tree, Row, Col, Button, Modal } from 'antd';

import PecaGenerica from '../Peca'

import request from '../utils/request'

const uuidv4 = require('uuid/v4');
const FormItem = Form.Item;

class FormPecas extends Component {

    state = {
        visible: false,
        clickUID: uuidv4(),
        activeKey: 'geral'
    }

    render() {
        const { onChange, partes, pecas } = this.props;

        const {clickUID, activeKey} = this.state;

        const treeProps = {
            treeData: pecas,
            checkedKeys: partes,
            onCheck: onChange('partes'),
            checkable: true,
            style: {
                width: '100%'
            }
        };

        const treeSelectProps = {
            treeData: pecas,
            value: partes,
            onChange: onChange('partes'),
            notFoundContent: 'Nada foi encontrado',
            treeCheckable: true,
            searchPlaceholder: 'Partes já vinculadas a este roteiro',
            style: {
                width: '100%'
            }
        };



        return (
            <Form>
                <Row>
                    <Col span={10}>
                        <FormItem
                            label='Selecione as partes anatômicas deste roteiro'
                        >
                            <Tree {...treeProps} />
                            Ou <a onClick={this.onOpen}>clique aqui</a> para criar uma nova peça genérica.
                </FormItem>
                    </Col>
                    <Col span={14}>
                        <FormItem
                            label='Partes Selecionadas'
                        >
                            <TreeSelect {...treeSelectProps} />
                        </FormItem>
                    </Col>
                </Row>
                <Modal
                    width='80%'
                    title="Nova peça genérica"
                    visible={this.state.visible}
                    onOk={this.onSubmit}
                    onCancel={this.onCancel}
                    okText='Salvar'
                    cancelText='Cancelar'
                    bodyStyle={{padding: 0}}
                    footer={null}
                >
                    <PecaGenerica clickUID={clickUID} activeKey={activeKey} />
                </Modal>
            </Form>
        )
    }

    onOpen = () => this.setState({ visible: true })

    onSubmit = () => { }

    onCancel = () => this.setState({ visible: false })

    onChangePanel = activeKey => {
        const newState = activeKey == 'teoria' ? { clickUID: uuidv4() } : {};
        this.setState({ activeKey, ...newState })
    }    
}




export default FormPecas;
import React, { Component, Fragment } from 'react';

import { Form, Input, List, TreeSelect, Tree, Row, Col, Button, Modal } from 'antd';

import PecaGenerica from '../Peca'

import request from '../utils/request'

const uuidv4 = require('uuid/v4');
const FormItem = Form.Item;

class FormPecas extends Component {

    state = {
        visible: false,
        buttons: []
    }

    render() {
        const { onChange, partes, pecas } = this.props;
        const { buttons } = this.state;

        const treeProps = {
            treeData: pecas,
            checkedKeys: partes,
            onCheck: onChange('partes'),
            checkable: true,
            style: {
                width: '100%'
            }
        };

        return (
            <Form layout="vertical">
                <FormItem
                    label='Selecione as partes anatômicas deste roteiro'
                >
                    <div style={{ height: 300, overflowY: 'scroll', backgroundColor: '#fafafa' }}>
                        <Tree {...treeProps} />
                    </div>
                    Ou <a onClick={this.onOpen}>clique aqui</a> para criar uma nova peça genérica.
                </FormItem>
                <Modal
                    width='80%'
                    title="Nova peça genérica"
                    visible={this.state.visible}
                    onOk={this.onSubmit}
                    onCancel={this.onCancel}
                    okText='Salvar'
                    cancelText='Cancelar'
                    bodyStyle={{ padding: 0 }}
                    footer={null}
                >
                    <div style={{ padding: 16 }}>
                        <PecaGenerica onClose={this.onCancel} onSetButtons={this.onSetButtons} />
                        <div style={{ textAlign: 'right'}}>
                            {buttons.map(b => <Button {...b} style={{ marginLeft: 5 }} />)}
                        </div>
                    </div>
                </Modal>
            </Form>
        )
    }

    onSetButtons = buttons => this.setState({ buttons })

    onOpen = () => this.setState({ visible: true })

    onSubmit = () => { }

    onCancel = () => this.setState({ visible: false })
}




export default FormPecas;
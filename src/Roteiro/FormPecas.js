import React, { Component, Fragment } from 'react';

import { Form, Input, List, TreeSelect, Tree, Row, Col, Button, Modal } from 'antd';

import PecaGenerica from '../Peca'

import request from '../utils/request'

const { v4: uuidv4 } = require('uuid');
const FormItem = Form.Item;

class FormPecas extends Component {

    state = {
        visible: false,
        buttons: []
    }

    render() {
        const { onChange, partes, pecas, erros,  } = this.props;
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
        
        const _erros = {
            partes: erros.campos.indexOf('partes'),
        }     
        
        return (
            <Form layout="vertical">
                <FormItem
                    validateStatus={_erros.partes != -1 ? 'error' : ''}
                    help={erros.msgs[_erros.partes] || ''}
                    label='Selecione as partes anatômicas das peças a serem identificadas neste roteiro'
                >
                    <div style={{ height: 300, overflowY: 'scroll', backgroundColor: '#fafafa', marginBottom: 10 }}>
                        {pecas.length > 0 && <Tree defaultExpandedKeys={[pecas[0].key]} {...treeProps} />}
                    </div>
                    Ou <a onClick={this.onOpen}>clique aqui para criar um novo conteúdo de peça</a>.
                </FormItem>
                <Modal
                    destroyOnClose={true}
                    width='80%'
                    title="Novo conteúdo da peça"
                    visible={this.state.visible}
                    onOk={this.onSubmit}
                    onCancel={this.onCancel(false)}
                    okText='Salvar'
                    cancelText='Cancelar'
                    bodyStyle={{ padding: 0 }}
                    footer={null}
                >
                    <div style={{ padding: 16 }}>
                        <PecaGenerica modo='assoc' onClose={this.onCancel(true)} onSetButtons={this.onSetButtons} />
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

    onCancel = update => () => {
        this.setState({ visible: false })
        if(update){
            this.props.onUpdatePecas();
        }
    }
}




export default FormPecas;
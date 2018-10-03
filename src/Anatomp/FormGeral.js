import React, { Component, Fragment } from 'react';

import { Form, Input, Select, Row, Col } from 'antd';
import { filter } from '../utils/data'

const Option = Select.Option;

const FormItem = Form.Item;

const props = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
}

const FormGeral = ({ nome, instituicao, roteiro, listaRoteiros, erros, onChange, onSelectRoteiro }) => {

    const _erros = {
        nome: erros.campos.indexOf('nome'),
        roteiro: erros.campos.indexOf('roteiro'),
        instituicao: erros.campos.indexOf('instituicao'),
    }

    return (
        <Form>
            <Row gutter={16}>
                <Col span={16}>
                    <FormItem
                        validateStatus={_erros.nome != -1 ? 'error' : ''}
                        help={erros.msgs[_erros.nome] || ''}
                        label='Nome da An@tom-P'
                    >
                        <Input placeholder="Ex: " value={nome} onChange={e => onChange('nome')(e.target.value)} />
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem
                        validateStatus={_erros.instituicao != -1 ? 'error' : ''}
                        help={erros.msgs[_erros.instituicao] || ''}
                        label='Instituição'
                    >
                        <Input placeholder="Ex: " value={instituicao} onChange={e => onChange('instituicao')(e.target.value)} />
                    </FormItem>
                </Col>
            </Row>
        </Form>
    )
}


export default FormGeral;
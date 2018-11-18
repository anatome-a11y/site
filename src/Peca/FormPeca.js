import React, { Component, Fragment } from 'react';

import { Form, Input, Select, Checkbox, Row, Col } from 'antd';
import { filter } from '../utils/data'
import Generalidades from '../components/Generalidades'

const Option = Select.Option;

const FormItem = Form.Item;

const props = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
}

const FormPeca = ({ nome, idioma, regiao, sistema, erros, somentePratica, listaSistema, listaRegiao, onOpenSnackbar, onChange, onChangeSomentePratica, generalidades }) => {

    const _erros = {
        nome: erros.campos.indexOf('nome'),
        idioma: erros.campos.indexOf('idioma'),
        regiao: erros.campos.indexOf('regiao'),
        sistema: erros.campos.indexOf('sistema'),
    }

    return (
        <Form layout="vertical">
            <Row gutter={16}>
                <Col span={8}>
                    <FormItem
                        validateStatus={_erros.nome != -1 ? 'error' : ''}
                        help={erros.msgs[_erros.nome] || ''}
                        label='Nome da peça'
                    >
                        <Input autoFocus placeholder="Ex: " value={nome} onChange={e => onChange('nome')(e.target.value)} />
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem
                        validateStatus={_erros.regiao != -1 ? 'error' : ''}
                        help={erros.msgs[_erros.regiao] || ''}
                        label="Região"
                    >
                        <Select
                            showSearch
                            value={regiao}
                            onChange={onChange('regiao')}
                            notFoundContent='Nada foi encontrado'
                            optionFilterProp="children"
                            filterOption={filter}
                        >
                            {listaRegiao.map(i => <Option key={i._id} value={i._id}>{i.name}</Option>)}
                        </Select>
                    </FormItem>
                </Col>
                <Col span={10}>
                    <FormItem
                        validateStatus={_erros.sistema != -1 ? 'error' : ''}
                        help={erros.msgs[_erros.sistema] || ''}
                        label="Sistema"
                    >
                        <Select
                            showSearch
                            value={sistema}
                            onChange={onChange('sistema')}
                            notFoundContent='Nada foi encontrado'
                            optionFilterProp="children"
                            filterOption={filter}
                        >
                            {listaSistema.map(i => <Option key={i._id} value={i._id}>{i.name}</Option>)}
                        </Select>
                    </FormItem>
                </Col>
                <Col span={24}>
                    <FormItem label="Informe as generalidades do conteúdo da peça">
                        <Generalidades defaultValue={generalidades} onOpenSnackBar={onOpenSnackbar} onChange={onChange('generalidades')} />
                    </FormItem>
                </Col>                
                <Col span={24}>
                    <FormItem>
                        <Checkbox checked={somentePratica} onChange={e => onChangeSomentePratica(e.target.checked)}>Somente conteúdo prático</Checkbox>
                    </FormItem>
                </Col>
            </Row>
        </Form>
    )
}


export default FormPeca;
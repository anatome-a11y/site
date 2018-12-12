import React, { Component, Fragment } from 'react';

import { Form, Input, Select, Row, Col, Checkbox } from 'antd';

import { listaIdiomas } from '../utils/mock';

import { filter } from '../utils/data'
import Generalidades from '../components/Generalidades'

const Option = Select.Option;


const FormItem = Form.Item;

const props = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
}

const FormGeral = ({ nome, curso, disciplina, somentePratica, onChangeSomentePratica, erros, onChange, idioma, generalidades, onOpenSnackbar }) => {

    const _erros = {
        idioma: erros.campos.indexOf('idioma'),
        nome: erros.campos.indexOf('nome'),
        curso: erros.campos.indexOf('curso'),
        disciplina: erros.campos.indexOf('disciplina'),
        proposito: erros.campos.indexOf('proposito'),
    }

    return (
        <div>
            <Form layout="vertical">
                <Row gutter={16}>
                    <Col span={3}>
                        <FormItem
                            validateStatus={_erros.idioma != -1 ? 'error' : ''}
                            help={erros.msgs[_erros.idioma] || ''}
                            label="Idioma"
                        >
                            <Select
                                autoFocus
                                showSearch
                                value={idioma}
                                onChange={onChange('idioma')}
                                notFoundContent='Nada foi encontrado'
                                optionFilterProp="children"
                                filterOption={filter}
                            >
                                {listaIdiomas.map(i => <Option key={i._id} value={i._id}>{i.name}</Option>)}
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem
                            validateStatus={_erros.nome != -1 ? 'error' : ''}
                            help={erros.msgs[_erros.nome] || ''}
                            label='Nome do roteiro'
                        >
                            <Input placeholder="Informe o assunto da aula" value={nome} onChange={e => onChange('nome')(e.target.value)} />
                        </FormItem>
                    </Col>
                    <Col span={5}>
                        <FormItem
                            validateStatus={_erros.curso != -1 ? 'error' : ''}
                            help={erros.msgs[_erros.curso] || ''}
                            label='Curso'
                        >
                            <Input value={curso} onChange={e => onChange('curso')(e.target.value)} />
                        </FormItem>
                    </Col>
                    <Col span={5}>
                        <FormItem
                            validateStatus={_erros.disciplina != -1 ? 'error' : ''}
                            help={erros.msgs[_erros.disciplina] || ''}
                            label='Disciplina'
                        >
                            <Input value={disciplina} onChange={e => onChange('disciplina')(e.target.value)} />
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem label="Generalidades do roteiro">
                            <Generalidades defaultValue={generalidades} onOpenSnackBar={onOpenSnackbar} onChange={onChange('generalidades')} placeholder='Generalidade sobre o assunto da aula' />
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem>
                            <Checkbox checked={somentePratica} onChange={e => onChangeSomentePratica(e.target.checked)}>Somente conteúdo prático</Checkbox>
                        </FormItem>
                    </Col>
                    {/* <Col span={12}>
                        <FormItem
                            validateStatus={_erros.proposito != -1 ? 'error' : ''}
                            help={erros.msgs[_erros.proposito] || ''}
                            label='Propósito do roteiro'
                        >
                            <Input placeholder="Ex: " value={proposito} onChange={e => onChange('proposito')(e.target.value)} />
                        </FormItem>
                    </Col> */}
                </Row>





            </Form>
        </div>
    )
}


export default FormGeral;
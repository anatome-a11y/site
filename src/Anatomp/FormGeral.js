import React, { Component, Fragment } from 'react';

import { Form, Input, Select, Row, Col } from 'antd';
import { filter } from '../utils/data'

import Generalidades from '../components/Generalidades'


const Option = Select.Option;

const FormItem = Form.Item;

const props = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
}

const FormGeral = ({ nome, instituicao, modo, roteiro, listaRoteiros, erros, onChange, onSelectRoteiro, isEdit, generalidades, onOpenSnackbar }) => {

    const _erros = {
        nome: erros.campos.indexOf('nome'),
        roteiro: erros.campos.indexOf('roteiro'),
        instituicao: erros.campos.indexOf('instituicao'),
    }

    const span = modo == 'assoc' ? 16 : 8;

    return (
        <Form layout="vertical">
            <Row gutter={16}>
                {modo !== 'assoc' && (
                    <Col span={span}>
                        <FormItem
                            validateStatus={_erros.roteiro != -1 ? 'error' : ''}
                            help={erros.msgs[_erros.roteiro] || ''}
                            label="Selecione o conteúdo de um roteiro"
                        >
                            <Select
                                disabled={isEdit}
                                showSearch
                                value={roteiro}
                                onSelect={(v, d) => {                                    
                                    onSelectRoteiro(d.props['data-partes'], {roteiro: v, nome: d.props.children});
                                }}
                                notFoundContent='Nenhum roteiro foi encontrado'
                                optionFilterProp="children"
                                filterOption={filter}
                            >
                                {listaRoteiros.map(i => <Option data-partes={i.partes} key={i._id} value={i._id}>{i.nome}</Option>)}
                            </Select>
                        </FormItem>
                    </Col>
                )}
                <Col span={span}>
                    <FormItem
                        validateStatus={_erros.nome != -1 ? 'error' : ''}
                        help={erros.msgs[_erros.nome] || ''}
                        label='Nome do Roteiro Setado'
                    >
                        <Input value={nome} onChange={e => onChange('nome')(e.target.value)} />
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem
                        validateStatus={_erros.instituicao != -1 ? 'error' : ''}
                        help={erros.msgs[_erros.instituicao] || ''}
                        label='Instituição'
                    >
                        <Input value={instituicao} onChange={e => onChange('instituicao')(e.target.value)} />
                    </FormItem>
                </Col>
                <Col span={24}>
                        <FormItem label="Informe as generalidades do roteiro setado">
                            <Generalidades defaultValue={generalidades} onOpenSnackBar={onOpenSnackbar} onChange={onChange('generalidades')} placeholder='Sugestão da ordem das peças a serem aprendidas' />
                        </FormItem>
                    </Col>                
            </Row>
        </Form>
    )
}


export default FormGeral;
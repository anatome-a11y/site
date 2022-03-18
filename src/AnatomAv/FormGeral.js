import React, { Component, Fragment } from 'react';

import { Form, Input, Select, Row, Col } from 'antd';
import { filter } from '../utils/data'

import Generalidades from '../components/Generalidades'
import TextArea from 'antd/lib/input/TextArea';


const Option = Select.Option;

const FormItem = Form.Item;

const props = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
}

const FormGeral = ({ titulo, modo, roteiro,subtitulo,turma,disciplina,instrucoes, listaRoteiros, erros, onChange, onSelectRoteiro, isEdit, generalidades, onOpenSnackbar }) => {

    const _erros = {
        nome: erros.campos.indexOf('nome'),
        roteiro: erros.campos.indexOf('roteiro'),
        titulo: erros.campos.indexOf('titulo'),
        subtitulo: erros.campos.indexOf('subtitulo'),
        turma: erros.campos.indexOf('turma'),
        disciplina: erros.campos.indexOf('disciplina'),
        instrucoes: erros.campos.indexOf('instrucoes'),

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
               
                <Col span={8}>
                    <FormItem
                        validateStatus={_erros.titulo != -1 ? 'error' : ''}
                        help={erros.msgs[_erros.titulo] || ''}
                        label='Título da Avaliação'
                    >
                        <Input placeholder="Informe o titulo da Avaliação" value={titulo} onChange={e => onChange('titulo')(e.target.value)} />
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem
                        validateStatus={_erros.subtitulo != -1 ? 'error' : ''}
                        help={erros.msgs[_erros.subtitulo] || ''}
                        label='Subtítulo da Avaliação'
                    >
                        <Input placeholder="Informe o subtítulo da Avaliação" value={subtitulo} onChange={e => onChange('subtitulo')(e.target.value)} />
                    </FormItem>
                </Col>
                       
            <Col span={span}>
                    <FormItem
                        validateStatus={_erros.turma != -1 ? 'error' : ''}
                        help={erros.msgs[_erros.turma] || ''}
                        label='Turma'
                    >
                        <Input value={turma} onChange={e => onChange('turma')(e.target.value)} />
                    </FormItem>
                </Col>
                <Col span={span}>
                    <FormItem
                        validateStatus={_erros.disciplina != -1 ? 'error' : ''}
                        help={erros.msgs[_erros.disciplina] || ''}
                        label='Disciplina'
                    >
                        <Input value={disciplina} onChange={e => onChange('disciplina')(e.target.value)} />
                    </FormItem>
                </Col>
                <Col span={span}>
                    <FormItem
                        validateStatus={_erros.instrucoes != -1 ? 'error' : ''}
                        help={erros.msgs[_erros.instrucoes] || ''}
                        label='Instruções'
                    >
                        <TextArea value={instrucoes} onChange={e => onChange('instrucoes')(e.target.value)} />
                    </FormItem>
                </Col>
            </Row>

        </Form>
    )
}


export default FormGeral;
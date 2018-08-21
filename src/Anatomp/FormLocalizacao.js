import React, { Component, Fragment } from 'react';

import { Form, Input, Select } from 'antd';
import {filter} from '../utils/data'

const Option = Select.Option;

const FormItem = Form.Item;

const props = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
}

const FormLocalizacao = ({ model, onChange }) => {

    const _erros = {
        pecaFisica: erros.campos.indexOf('pecaFisica'),
        anterior: erros.campos.indexOf('anterior'),
        posterior: erros.campos.indexOf('posterior'),
        latDir: erros.campos.indexOf('latDir'),
        latEsq: erros.campos.indexOf('latEsq'),
        medDir: erros.campos.indexOf('medDir'),
        medEsq: erros.campos.indexOf('medEsq'),
        superior: erros.campos.indexOf('superior'),
        inferior : erros.campos.indexOf('inferior')       
    }

    return (
        <Form layout="horizontal">
            <FormItem
                validateStatus={_erros.roteiro != -1 ? 'error' : ''}
                help={erros.msgs[_erros.roteiro] || ''}
                label="Roteiro"
                {...props}
            >
                <Select
                    showSearch
                    value={roteiro}
                    onChange={onSelectRoteiro}
                    notFoundContent='Nada foi encontrado'
                    optionFilterProp="children"
                    filterOption={filter}
                >
                    {listaRoteiros.map((i, idx) => <Option idx={idx} key={i._id} value={i._id}>{i.nome}</Option>)}
                </Select>
            </FormItem>        
            <FormItem
                validateStatus={_erros.nome != -1 ? 'error' : ''}
                help={erros.msgs[_erros.nome] || ''}
                label='Nome da peça'
                {...props}
            >
                <Input autoFocus placeholder="Ex: " value={nome} onChange={e => onChange('nome')(e.target.value)} />
            </FormItem>
            <FormItem
                validateStatus={_erros.instituicao != -1 ? 'error' : ''}
                help={erros.msgs[_erros.instituicao] || ''}
                label='Instituição'
                {...props}
            >
                <Input placeholder="Ex: " value={instituicao} onChange={e => onChange('instituicao')(e.target.value)} />
            </FormItem>
        </Form>
    )
}


export default FormLocalizacao;
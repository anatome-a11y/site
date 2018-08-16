import React, { Component, Fragment } from 'react';

import { Form, Input } from 'antd';


const FormItem = Form.Item;

const props = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
}

const FormGeral = ({ nome, curso, disciplina, proposito, erros, onChange }) => {

    const _erros = {
        nome: erros.campos.indexOf('nome'),
        curso: erros.campos.indexOf('curso'),
        disciplina: erros.campos.indexOf('disciplina'),
        proposito: erros.campos.indexOf('proposito'),
    }

    return (
        <Form layout="horizontal">
            <FormItem
                validateStatus={_erros.nome != -1 ? 'error' : ''}
                help={erros.msgs[_erros.nome] || ''}
                label='Nome da peça'
                {...props}
            >
                <Input autoFocus placeholder="Ex: " value={nome} onChange={e => onChange('nome')(e.target.value)} />
            </FormItem>
            <FormItem
                validateStatus={_erros.curso != -1 ? 'error' : ''}
                help={erros.msgs[_erros.curso] || ''}
                label='Curso'
                {...props}
            >
                <Input placeholder="Ex: " value={curso} onChange={e => onChange('curso')(e.target.value)} />
            </FormItem>
            <FormItem
                validateStatus={_erros.disciplina != -1 ? 'error' : ''}
                help={erros.msgs[_erros.disciplina] || ''}
                label='Disciplina'
                {...props}
            >
                <Input placeholder="Ex: " value={disciplina} onChange={e => onChange('disciplina')(e.target.value)} />
            </FormItem>      
            <FormItem
                validateStatus={_erros.proposito != -1 ? 'error' : ''}
                help={erros.msgs[_erros.proposito] || ''}
                label='Propósito'
                {...props}
            >
                <Input placeholder="Ex: " value={proposito} onChange={e => onChange('proposito')(e.target.value)} />
            </FormItem>                              
        </Form>
    )
}


export default FormGeral;
import React, { Component, Fragment } from 'react';

import { Form, Input, Select } from 'antd';


const Option = Select.Option;

const FormItem = Form.Item;

const props = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
}

const FormPeca = ({ nome, idioma, regiao, sistema, erros, form, listaSistema, listaRegiao, listaIdiomas, onChange }) => {

    const _erros = {
        nome: erros.campos.indexOf('nome'),
        idioma: erros.campos.indexOf('idioma'),
        regiao: erros.campos.indexOf('regiao'),
        sistema: erros.campos.indexOf('sistema'),
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
                validateStatus={_erros.idioma != -1 ? 'error' : ''}
                help={erros.msgs[_erros.idioma] || ''}
                label="Idioma"
                {...props}
            >
                <Select
                    showSearch
                    onChange={onChange('idioma')}
                    notFoundContent='Nada foi encontrado'
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    {listaIdiomas.map(i => <Option key={i.id} value={i.id}>{i.name}</Option>)}
                </Select>
            </FormItem>
            <FormItem
                validateStatus={_erros.regiao != -1 ? 'error' : ''}
                help={erros.msgs[_erros.regiao] || ''}
                label="Região"
                {...props}
            >
                <Select
                    showSearch
                    onChange={onChange('regiao')}
                    notFoundContent='Nada foi encontrado'
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}                
                >
                    {listaRegiao.map(i => <Option key={i.id} value={i.id}>{i.name}</Option>)}
                </Select>
            </FormItem>
            <FormItem
                validateStatus={_erros.sistema != -1 ? 'error' : ''}
                help={erros.msgs[_erros.sistema] || ''}
                label="Sistema"
                {...props}
            >
                <Select
                    showSearch
                    onChange={onChange('sistema')}
                    notFoundContent='Nada foi encontrado'
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}                  
                >
                    {listaSistema.map(i => <Option key={i.id} value={i.id}>{i.name}</Option>)}
                </Select>
            </FormItem>
        </Form>
    )
}


export default FormPeca;
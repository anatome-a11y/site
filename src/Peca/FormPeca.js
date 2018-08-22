import React, { Component, Fragment } from 'react';

import { Form, Input, Select, Switch } from 'antd';
import {filter} from '../utils/data'

const Option = Select.Option;

const FormItem = Form.Item;

const props = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
}

const FormPeca = ({ nome, idioma, regiao, sistema, erros, somentePratica, listaSistema, listaRegiao, listaIdiomas, onChange, onChangeSomentePratica }) => {

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
                    value={idioma}
                    onChange={onChange('idioma')}
                    notFoundContent='Nada foi encontrado'
                    optionFilterProp="children"
                    filterOption={filter}
                >
                    {listaIdiomas.map(i => <Option key={i._id} value={i._id}>{i.name}</Option>)}
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
                    value={regiao}
                    onChange={onChange('regiao')}
                    notFoundContent='Nada foi encontrado'
                    optionFilterProp="children"
                    filterOption={filter}                
                >
                    {listaRegiao.map(i => <Option key={i._id} value={i._id}>{i.name}</Option>)}
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
                    value={sistema}
                    onChange={onChange('sistema')}
                    notFoundContent='Nada foi encontrado'
                    optionFilterProp="children"
                    filterOption={filter}                  
                >
                    {listaSistema.map(i => <Option key={i._id} value={i._id}>{i.name}</Option>)}
                </Select>
            </FormItem>
            <FormItem
                validateStatus={_erros.sistema != -1 ? 'error' : ''}
                help={erros.msgs[_erros.sistema] || ''}
                label="Somente conteúdo prático"
                {...props}
            >
                <Switch checked={somentePratica} onChange={onChangeSomentePratica} />
            </FormItem>            
        </Form>
    )
}


export default FormPeca;
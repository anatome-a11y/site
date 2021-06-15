import React , { Fragment } from 'react'

import { Form , Input } from 'antd'

const FormItem = Form.Item

const CabecalhoAvaliacao = ({aval, editAvaliacao}) => {
    return (
        <div style={{display:'flex',alignItems:'flex-start'}} >
            <FormItem style={{marginRight:15,flex:3}} label='Nome do Aluno' >
                <Input
                    type={'text'}
                    value={aval.nomeAluno}
                    onChange={({target}) => editAvaliacao('nomeAluno', target.value)}
                    placeholder={'Nome do Aluno'} />
            </FormItem>
            <FormItem style={{marginRight:15,flex:2}} label='Data da avaliação' >
                <Input
                    type={'text'}
                    value={aval.data}
                    onChange={({target}) => editAvaliacao('data', target.value)}
                    placeholder={'DD/MM/YYYY'} />
            </FormItem>
            <FormItem style={{marginRight:15,flex:4}} label='Conteúdo da avaliação' >
                <Input
                    type={'text'}
                    value={aval.conteudo}
                    onChange={({target}) => editAvaliacao('conteudo', target.value)}
                    placeholder={'Conteúdo da avaliação'} />
            </FormItem>
            <div style={{flex:1.5}}/>
        </div>
    )
}

export default CabecalhoAvaliacao

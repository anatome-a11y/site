import React , { Fragment } from 'react'

import { Form , Input } from 'antd'

const FormItem = Form.Item

const CabecalhoAvaliacao = ({aval}) => {
    return (
        <div style={{display:'flex',alignItems:'flex-start'}} >
            <FormItem style={{marginRight:15,flex:1}} label='Nome do Aluno' >
                <Input placeholder={aval.nomeAluno} />
            </FormItem>
            <FormItem style={{marginRight:15,flex:1}} label='Data da avaliação' >
                <Input placeholder={aval.data} />
            </FormItem>
            <FormItem style={{marginRight:15,flex:1}} label='Conteúdo da avaliação' >
                <Input placeholder={aval.conteudo} />
            </FormItem>
            <div style={{flex:1.5}}/>
        </div>
    )
}

export default CabecalhoAvaliacao

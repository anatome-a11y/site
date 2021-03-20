import React , { Fragment } from 'react'

import { Form , Input } from 'antd'

const FormItem = Form.Item

const CabecalhoAvaliacao = ({aval}) => {
    return (
        <div style={{display:'flex'}} >
            <FormItem style={{marginRight:15}} label='Nome do Aluno' >
                <Input placeholder={aval.nomeAluno} />
            </FormItem>
            <FormItem style={{marginRight:15}} label='Data da avaliação' >
                <Input placeholder={aval.data} />
            </FormItem>
            <FormItem style={{marginRight:15}} label='Conteúdo da avaliação' >
                <Input placeholder={aval.conteudo} />
            </FormItem>
        </div>
    )
}

export default CabecalhoAvaliacao
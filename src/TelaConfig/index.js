import React , { Fragment } from 'react'

import { Button } from 'antd'

import Header from './components/Header'
import Conhecimento from './components/Conhecimento'

const TelaConfig = ({history}) => {
    return (
        <Fragment>

        <div style={{marginTop:32,marginBottom:12}}>
            <span style={{fontWeight:'bold'}}>Você está em: </span> 
            <span style={{color:'#4facf0'}}>Configurações</span>
        </div>

        <div style={{paddingLeft:32,paddingRight:32}}>

            <div style={{display:'flex',width:'100%'}}>
                <Header style={{flex:1}} title="Entrada" >
                    <div>teste</div>
                </Header>
                <Header style={{flex:1}} title="Apresentação de conhecimento" >
                    <div>teste</div>
                </Header>
            </div>

            <Header style={{flex:1}} title="Interação" >
                <div>teste</div>
            </Header>

            <Header style={{flex:1}} title="Máximo de tentativas" >
                <div>teste</div>
            </Header>

        </div>

        <div style={{display:'flex',justifyContent:'center',width:'100%',padding:24}}>
            <Button icon='undo' onClick={ () => history.goBack() } >Voltar</Button>
            <Button icon='check' style={{marginLeft:8,marginRight:8}} type='secondary'>Salvar configurações</Button>
            <Button type='primary'>Restaurar padrões</Button>
        </div>

        </Fragment>
    )
}

export default TelaConfig

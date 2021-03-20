import React , { Fragment } from 'react'

import { Button } from 'antd'

import Header from './components/Header'
import Entrada from './components/Entrada'
import Apresentacao from './components/Apresentacao'
import Conhecimento from './components/Conhecimento'
import Localizacao from './components/Localizacao'
import Tentativas from './components/Tentativas'

const TelaConfig = ({history}) => {

    const conf = { 
        entrada: {value:3},
        apresentacao: {value:4},
        conhecimento: {
            value:2,
            voz:30,
            teclado:40,
        },
        localizacao: {
            value:3,
            nfc:10,
            voz:20,
            teclado:30,
        },
        tentativas: {value:3},
    }

    return (
        <Fragment>

        <div style={{marginTop:32,marginBottom:12}}>
            <span style={{fontWeight:'bold'}}>Você está em: </span> 
            <span style={{color:'#4facf0'}}>Configurações</span>
        </div>

        <div style={{paddingLeft:48,paddingRight:48}}>

            <div style={{display:'flex',width:'100%',marginBottom:100}}>
                <Header style={{flex:1}} title="Entrada" >
                    <Entrada en={conf.entrada} />
                </Header>
                <Header style={{flex:1}} title="Apresentação de conhecimento" >
                    <Apresentacao apr={conf.apresentacao} />
                </Header>
            </div>

            <Header style={{flex:1,marginBottom:100}} title="Interação" >
                <div style={{display:'flex'}}>
                    <Conhecimento con={conf.conhecimento} /> 
                    <Localizacao loc={conf.localizacao} /> 
                </div>
            </Header>

            <Header style={{flex:1}} title="Máximo de tentativas" >
                <Tentativas tent={conf.tentativas} />
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

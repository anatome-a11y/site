import React , { Fragment } from 'react'

import { Button } from 'antd'

import Header from './components/Header'
import Entrada from './components/Entrada'
import Apresentacao from './components/Apresentacao'
import Conhecimento from './components/Conhecimento'
import Localizacao from './components/Localizacao'
import Tentativas from './components/Tentativas'

import useConf from './config/useConf'

const TelaConfig = ({history}) => {

    const {conf,edit,save,reset} = useConf()

    if(!conf) { return <div></div> }

    return (
        <Fragment>

        <div style={{marginTop:32,marginBottom:12,marginLeft:6}}>
            <span style={{fontWeight:'bold'}}>Você está em: </span> 
            <span style={{color:'#4facf0'}}>Configurações</span>
        </div>

        <div style={{paddingLeft:48,paddingRight:48}}>

            <div style={{display:'flex',width:'100%',marginBottom:100}}>
                <Header style={{flex:1}} title="Entrada" >
                    <Entrada en={conf.entrada} edit={edit} />
                </Header>
                <Header style={{flex:1}} title="Apresentação de conhecimento" >
                    <Apresentacao apr={conf.apresentacao} edit={edit} />
                </Header>
            </div>

            <Header style={{flex:1,marginBottom:100}} title="Interação" >
                <div style={{display:'flex'}}>
                    <Conhecimento con={conf.conhecimento} edit={edit} /> 
                    <Localizacao loc={conf.localizacao} edit={edit} /> 
                </div>
            </Header>

            <Header style={{flex:1,justifyContent:'center'}} title="Máximo de tentativas" >
                <div style={{justifyContent:'center',display:'flex'}}>
                    <Tentativas tent={conf.tentativas} edit={edit} />
                </div>
            </Header>

        </div>

        <div style={{display:'flex',justifyContent:'center',width:'100%',padding:24}}>
            <Button icon='left' onClick={ () => history.goBack() } style={{color:'black'}} >Voltar</Button>
            <Button icon='check' onClick={() => save()}  style={{marginLeft:8,marginRight:8,color:'black'}} type='secondary'>Salvar configurações</Button>
            <Button type='primary' onClick={() => reset()} >Restaurar padrões</Button>
        </div>

        </Fragment>
    )
}

export default TelaConfig

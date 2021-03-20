import React, { Fragment } from 'react'

import { Button } from 'antd'

import Titulo from './componentes/Titulo'
import Barra from './componentes/Barra'
import CabecalhoAvaliacao from './componentes/CabecalhoAvaliacao'
import Seta from './componentes/Seta'
import Questao from './componentes/Questao'

import { useQuestao , useAvaliacao } from './avaliacao'

const TelaCorrecao = ({history}) => {

    const idAvaliacao = 0

    const [avaliacao,setAvaliacao] = useAvaliacao(idAvaliacao)
    const {
        questao,
        edita,
        salva,
        proxima,
        anterior,
        temProxima,
        temAnterior,
        backup,
    } = useQuestao(avaliacao,setAvaliacao)

    return (
        <Fragment>

        <Titulo 
          title='Corrigir avaliação' 
          textoBotao='Voltar para página inicial' 
          acaoBotao={ () => history.push('/') }
        />

        <Barra title='Informações gerais da avaliação selecionada' >

           <Fragment>

           <div style={{paddingLeft:15,paddingRight:15}}>
               { avaliacao ? <CabecalhoAvaliacao aval={avaliacao} /> : null }
           </div>

           <div style={{display:'flex'}}>
               <Seta direction='left' onClick={anterior} enable={temAnterior} />
               <div style={{width:'100%'}}>{ questao ? <Questao edit={edita} backup={backup} quest={questao} /> : null }</div>
               <Seta direction='right' onClick={proxima} enable={temProxima} />
           </div>

           <div style={{width:'100%',display:'flex',justifyContent:'center',margin:24}}>
                <Button style={{margin:5}} onClick={salva} icon='save' type='primary'>Salvar/Continuar</Button>
                <Button style={{margin:5}} onClick={ () => history.push('/') } icon='arrow-down' type='primary'>Enviar/Finalizar</Button>
           </div>

           </Fragment>

        </Barra>

        </Fragment>
    )
}

export default TelaCorrecao

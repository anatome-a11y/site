import React, { Fragment } from 'react'

import { Button } from 'antd'

import Titulo from './componentes/Titulo'
import Barra from './componentes/Barra'
import CabecalhoAvaliacao from './componentes/CabecalhoAvaliacao'
import Seta from './componentes/Seta'
import Questao from './componentes/Questao'

import { useQuestoes , useAvaliacao } from './avaliacao'

const TelaCorrecao = ({history, match}) => {

    const idAvaliacao = match.params.id;

    const [avaliacao,setAvaliacao, editAvaliacao,saveAvaliacao] = useAvaliacao(idAvaliacao)
    const {questoes,edita,salva,backup} = useQuestoes(avaliacao,saveAvaliacao)

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
               { avaliacao ? <CabecalhoAvaliacao aval={avaliacao} editAvaliacao={editAvaliacao} /> : null }
           </div>

           <div style={{display:'flex',flexDirection:'column',width:'100%'}}>
              { questoes.map( (q,i) =>
                 <Questao key={i} edit={edita(i)} backup={backup(i)} quest={q} /> 
              )}
           </div>

           <div style={{width:'100%',display:'flex',justifyContent:'center',margin:24}}>
                <Button style={{margin:5}} onClick={ () => { salva() ; history.push('/') } } icon='save' type='primary'>Enviar/Finalizar</Button>
           </div>

           </Fragment>

        </Barra>

        </Fragment>
    )
}

export default TelaCorrecao

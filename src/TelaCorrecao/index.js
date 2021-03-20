import React, { Fragment } from 'react';

import Titulo from './componentes/Titulo'
import Barra from './componentes/Barra'
import CabecalhoAvaliacao from './componentes/CabecalhoAvaliacao'
import Seta from './componentes/Seta'
import QuestaoAvaliacao from './componentes/QuestaoAvaliacao'

import { useQuestao } from './avaliacao'

const TelaCorrecao = ({history,idAvaliacao}) => {

    const {avaliacao,questao,proxima,anterior,temProxima,temAnterior} = useQuestao(0)

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
               { questao ? <QuestaoAvaliacao quest={questao} /> : null }
               <Seta direction='right' onClick={proxima} enable={temProxima} />
           </div>

           </Fragment>

        </Barra>
        </Fragment>
    )
}

export default TelaCorrecao

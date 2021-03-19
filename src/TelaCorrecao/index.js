import React, { Fragment } from 'react';

import Titulo from './componentes/Titulo'
import Barra from './componentes/Barra'
import CabecalhoAvaliacao from './componentes/CabecalhoAvaliacao'
import QuestaoAvaliacao from './componentes/QuestaoAvaliacao'

import { useQuestao } from './avaliacao'

const TelaCorrecao = ({history,idAvaliacao}) => {

    const {avaliacao,questao,setIdQuestao,temProxima} = useQuestao(0)

    return (
        <Fragment>
        <Titulo 
          title='Corrigir avaliação' 
          textoBotao='Voltar para página inicial' 
          acaoBotao={ () => history.push('/') }
        />
        <Barra title='Informações gerais da avaliação selecionada' >
           <div style={{padding:15}}>
               <CabecalhoAvaliacao aval={avaliacao} />
               <QuestaoAvaliacao quest={questao} />
           </div>
        </Barra>
        </Fragment>
    )
}

export default TelaCorrecao

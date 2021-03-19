import React, { Fragment } from 'react';

import Titulo from './Titulo'
import Barra from './Barra'

const Correcao = ({history}) => {
    return (
        <Fragment>
        <Titulo 
          title='Corrigir avaliação' 
          textoBotao='Voltar para página inicial' 
          acaoBotao={ () => history.push('/') }
        />
        <Barra title='Informações gerais da avaliação selecionada' >
            <div>CONTEUDO</div>
        </Barra>
        </Fragment>
    )
}

export default Correcao

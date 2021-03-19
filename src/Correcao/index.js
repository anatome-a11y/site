import React, { Fragment } from 'react';

import Titulo from './Titulo'
import Barra from './Barra'

const Correcao = () => {
    return (
        <Fragment>
        <Titulo title='Corrigir avaliação' modo='assoc' />
        <Barra title='Informações gerais da avaliação selecionada' >
            <div>CONTEUDO</div>
        </Barra>
        </Fragment>
    )
}

export default Correcao

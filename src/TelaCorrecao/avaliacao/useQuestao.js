import { useState , useEffect } from 'react'

import * as service from './service'

const useQuestao = (idAvaliacao) => {

    const [avaliacao,setAvaliacao] = useState(null)
    const [questao,setQuestao] = useState(null)
    const [idQuestao,setIdQuestao] = useState(null)

    const [temProxima,setTemProxima] = useState(false)
    const [temAnterior,setTemAnterior] = useState(false)

    // executa 1 vez no inicio para setar a avaliacao
    // e o id
    useEffect( () => { 
        setAvaliacao( service.getAvaliacao(idAvaliacao) ) 
        setIdQuestao(0)
    } ,[])

    // toda vez que o idQuestao mudar chama essa funcao
    useEffect( () => {

        if( avaliacao && avaliacao.questoes[idQuestao+1] ) { setTemProxima(true) }
        else { setTemProxima(false) }

        if( avaliacao && avaliacao.questoes[idQuestao-1] ) { setTemAnterior(true) }
        else { setTemAnterior(false) }

        if (avaliacao) { setQuestao( avaliacao.questoes[idQuestao] ) }

    },[idQuestao])

    const proxima = () => setIdQuestao( (old) => temProxima ? old+1 : old )
    const anterior = () => setIdQuestao( (old) => temAnterior ? old-1 : old )

    return {avaliacao,questao,proxima,anterior,temProxima,temAnterior}

} 

export default useQuestao

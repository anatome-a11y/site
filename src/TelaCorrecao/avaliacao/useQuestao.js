import { useState , useEffect } from 'react'

import * as service from './service'

const useQuestao = (idAvaliacao) => {

    const [avaliacao,setAvaliacao] = useState(null)
    const [questao,setQuestao] = useState(null)
    const [idQuestao,setIdQuestao] = useState(null)
    const [temProxima,setTemProxima] = useState(false)

    // executa 1 vez no inicio para setar a avaliacao
    // e a primeira questao
    useEffect( () => {
        setAvaliacao( service.getAvaliacao(idAvaliacao) )
        setIdQuestao(0)
    },[])

    // toda vez que o idQuestao mudar chama essa funcao
    useEffect( () => {
        if (avaliacao) { 
            setQuestao( avaliacao.questoes[idQuestao] ) 
            setTemProxima( avaliacao.questoes[idQuestao+1] ? true : false )
        }
    },[idQuestao])

    // expoe a avaliacao atual , a questao atual , 
    // a funcao de mudar ela e se temos uma proxima questao
    return {avaliacao,questao,setIdQuestao,temProxima}

} 

export default useQuestao

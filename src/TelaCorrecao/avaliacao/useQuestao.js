import { useState , useEffect } from 'react'

import * as service from './service'

const useQuestao = (avaliacao,setAvaliacao) => {

    const [questao,setQuestao] = useState(null)
    const [qBackup,setBackup] = useState(null)

    const [idQuestao,setIdQuestao] = useState(null)

    const [temProxima,setTemProxima] = useState(false)
    const [temAnterior,setTemAnterior] = useState(false)

    useEffect( () => { setIdQuestao(0) } ,[])

    useEffect( () => {

        if(!avaliacao) { return }

        if( avaliacao.questoes[idQuestao+1] ) { setTemProxima(true) }
        else { setTemProxima(false) }

        if( avaliacao.questoes[idQuestao-1] ) { setTemAnterior(true) }
        else { setTemAnterior(false) }

        setQuestao( avaliacao.questoes[idQuestao] )
        setBackup( avaliacao.questoes[idQuestao] )

    },[idQuestao,avaliacao])

    const salva = () => {
        if(!avaliacao) { return }
        setAvaliacao( old => ({
            ...old,
            questoes: [ 
                ...old.questoes.slice(0,idQuestao) , 
                questao , 
                ...old.questoes.slice(idQuestao+1) 
            ]
        }))
    }

    const edita = (novaQuestao) => setQuestao(novaQuestao)
    const backup = () => setQuestao(qBackup)

    const proxima = () => setIdQuestao( (old) => temProxima ? old+1 : old )
    const anterior = () => setIdQuestao( (old) => temAnterior ? old-1 : old )

    return {questao,edita,salva,proxima,anterior,temProxima,temAnterior,backup}

} 

export default useQuestao

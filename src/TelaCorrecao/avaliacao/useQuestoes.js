import { useState , useEffect } from 'react'

import * as service from './service'

const useQuestoes = (avaliacao,saveAvaliacao) => {

    const [questoes,setQuestoes] = useState([])
    const [qBackups,setBackups] = useState([])

    useEffect( () => {
        if(!avaliacao || !avaliacao.questoes ) { return }
        setQuestoes([...avaliacao.questoes])
        setBackups([...avaliacao.questoes])
    },[avaliacao])

    const salva = () => {
        if(!avaliacao) { return }
        saveAvaliacao({...avaliacao,questoes:questoes})
    }

    const edita = (id) => (novaQuestao) => setQuestoes( 
        old => [ ...old.slice(0,id) , novaQuestao , ...old.slice(id+1) ]
    )

    const backup = (id) => () => setQuestoes( 
        old => [ ...old.slice(0,id) , qBackups[id] , ...old.slice(id+1) ]
    )

    return {questoes,edita,salva,backup}

} 

export default useQuestoes

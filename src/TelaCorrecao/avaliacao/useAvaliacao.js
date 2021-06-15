import { useState , useEffect } from 'react'

import * as service from './service'

const useAvaliacao = (idAvaliacao) => {

    const [avaliacao,setAvaliacao] = useState(null)

    useEffect( () => {
        const aval = service.getAvaliacao(idAvaliacao)
        setAvaliacao({...aval})
    } , [] )

    useEffect( () => { saveAvaliacao(avaliacao) },[avaliacao])

    const editAvaliacao = (field,value) => {
        setAvaliacao( (old) => ({
            ...old,
            [field]: value
        }))
    }

    const saveAvaliacao = (novaAvaliacao) => service.setAvaliacao({...novaAvaliacao})

    return [avaliacao,setAvaliacao,editAvaliacao,saveAvaliacao]

}

export default useAvaliacao

import { useState , useEffect } from 'react'

import * as service from './service'

const useAvaliacao = (idAvaliacao) => {

    const [avaliacao,setAvaliacao] = useState(null)

    useEffect( () => {
        const aval = service.getAvaliacao(idAvaliacao)
        setAvaliacao({...aval})
    } , [] )

    useEffect( () => { service.setAvaliacao({...avaliacao}) },[avaliacao])

    const editAvaliacao = (field,value) => {
        setAvaliacao( (old) => ({
            ...old,
            [field]: value
        }))
    }

    return [avaliacao,setAvaliacao, editAvaliacao]

}

export default useAvaliacao

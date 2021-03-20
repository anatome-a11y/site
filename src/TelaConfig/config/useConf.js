import React , { useState , useEffect } from 'react'

import * as service  from './service'

const useConf = () => {

    const [conf,setConf] = useState(null)

    useEffect( () => setConf( service.getConf() ) , [] )

    const edit = (confType,field,value) => setConf( (old) => ({
        ...old,
        [confType]: { ...old[confType] , field: value } 
    }))

    const save = () => service.setConf(conf)
    const reset = () => setConf( service.resetConf() )
        
    return {conf,edit,save,reset}
}

export default useConf

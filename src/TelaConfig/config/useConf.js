import React , { useState , useEffect } from 'react'

import * as service  from './service'

const useConf = () => {

    const [conf,setConf] = useState(null)

    useEffect( () => setConf( service.getConf() ) , [] )

    const edit = (confType,field,value) => {
        if( !isNaN( Number( conf[confType][field] ) ) && !isNaN( Number(value) ) ) {
            setConf( (old) => ({
                ...old,
                [confType]: { ...old[confType] , [field]: Number(value) } 
            }))
        }
    }

    const save = () => service.setConf(conf)
    const reset = () => setConf( service.getDefConf() )
        
    return {conf,edit,save,reset}
}

export default useConf

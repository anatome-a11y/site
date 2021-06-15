import React , { useState , useEffect } from 'react'

const useEdit = (res,edit) => {

    const [isEditando,setIsEditando] = useState(false)

    useEffect( () => { if(!isEditando) { edit(res) } } , [isEditando] )
}

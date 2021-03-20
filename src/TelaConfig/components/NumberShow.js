import React from 'react'

import { Input } from 'antd'

const NumberShow = ({value}) => {
    return (
        <div style={{
                flex:1,
                display:'flex',
                justifyContent:'flex-start',
                alignItems:'flex-start'
        }}>
            <Input style={{width:'15%',textAlign:'center'}} value={value}/>
        </div>
    )
}

export default NumberShow

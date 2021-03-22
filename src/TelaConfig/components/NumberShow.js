import React from 'react'

import { Input } from 'antd'

const NumberShow = ({value,onChange}) => {
    return (
        <div style={{
                flex:1,
                display:'flex',
                justifyContent:'flex-start',
                alignItems:'flex-start'
        }}>
            <Input min={0} max={180} type="number" onChange={onChange} style={{width:'25%',textAlign:'center'}} value={value}/>
        </div>
    )
}

export default NumberShow

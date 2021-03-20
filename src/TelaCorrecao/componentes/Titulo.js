import React from 'react'

import { Popover , Button } from 'antd';


const Titulo = ({title,textoBotao,acaoBotao}) => {
    return (
        <div style={{ 
            paddingLeft: 24,
            paddingRight: 24,
            marginBottom: 16,
            display: 'flex',
            justifyContent: 'center',
        }}>
            <div style={{flex:1}}></div>
            <h2 style={{flex:1}} className='section'>{title}</h2>
            <div style={{
                flex:1,
                display:'flex',
                justifyContent:'flex-end',
                alignItems:'flex-end'
              }}>
                <Button size='small' type='primary' ghost onClick={acaoBotao} >{textoBotao}</Button>
            </div>
        </div>
    )
}

export default Titulo

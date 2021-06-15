import React from 'react'

import { Button , Icon } from 'antd'

const Seta = ({onClick,direction,enable}) => {

    return (
        <div style={{
            paddingLeft:48,
            paddingRight:48,
            display:'flex',
            flex:1,
            justifyContent:'center',
            alignItems:'center',
        }}>
          <Button 
             onClick={onClick}
             size='large'
             type='primary'
             style={{height:'30%'}}
             disabled={!enable}
          >
            <Icon type={direction}/>
          </Button>
        </div>
    )
}

export default Seta

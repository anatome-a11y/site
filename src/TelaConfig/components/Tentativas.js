import React from 'react'

import { Slider } from 'antd'
import NumberShow from './NumberShow'

const Tentativas = ({tent}) => {
    return (
       <div style={{width:'50%',padding:10}} >
          <div style={{display:'flex'}}>
            <div style={{fontWeight:'bold',flex:1}}>Máximo de tentativas</div> 
            <NumberShow value={tent.value} />
          </div>
          <Slider value={tent.value} tooltipVisible={false} max={180} step={1} marks={{0:0,180:180}} />
       </div>
    )
}

export default Tentativas

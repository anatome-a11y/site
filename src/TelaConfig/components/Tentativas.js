import React from 'react'

import { Slider } from 'antd'
import NumberShow from './NumberShow'

const Tentativas = ({tent,edit}) => {
    return (
       <div style={{width:'50%',padding:10}} >
          <div style={{display:'flex'}}>
            <div style={{fontWeight:'bold',flex:1}}>Máximo de tentativas</div> 
            <NumberShow 
                value={tent.value} 
                onChange={ (value) => edit('tentativas','value',value) }
            />
          </div>
          <Slider 
            value={tent.value} 
            tooltipVisible={false} 
            max={180} 
            step={1} 
            marks={{0:0,180:180}} 
            onChange={ (value) => edit('tentativas','value',value) }
          />
       </div>
    )
}

export default Tentativas

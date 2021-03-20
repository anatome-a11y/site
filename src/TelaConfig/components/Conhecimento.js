import React from 'react'

import { Radio , Slider } from 'antd'
import NumberShow from './NumberShow'

const Conhecimento = ({con,onChange}) => {
   return (
       <div style={{flex:1,border:'1px solid #d2d2d2',borderTop:0,borderBottom:0,padding:10}} >

            <div>
                <div style={{fontWeight:'bold'}}>Conhecimento</div> 
                <div style={{color:'#4facf0'}}>Tempo limite</div>
            </div>

           <Radio.Group style={{width:'100%'}} onChange={ ({target}) => onChange(target.value) } value={con.value}>

              <div style={{display:'flex'}}>
                <Radio style={{flex:1}} value={1}>Voz</Radio>
                <NumberShow value={con.voz} />
              </div>
              <Slider tooltipVisible={false} max={180} step={1} marks={{0:0,180:180}} />

              <div style={{display:'flex'}}>
                <Radio style={{flex:1}} value={2}>Teclado</Radio>
                <NumberShow value={con.voz} />
              </div>
              <Slider tooltipVisible={false} max={180} step={1} marks={{0:0,180:180}} />

           </Radio.Group >

       </div>
   )
}

export default Conhecimento

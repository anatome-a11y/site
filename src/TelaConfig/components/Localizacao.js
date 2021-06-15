import React from 'react'

import { Radio , Slider } from 'antd'
import NumberShow from './NumberShow'

const Localizacao = ({loc,edit}) => {
   return (
       <div style={{flex:1,border:'1px solid #d2d2d2',borderTop:0,borderBottom:0,padding:10}} >

            <div>
                <div style={{fontWeight:'bold'}}>Localização</div> 
                <div style={{color:'#4facf0'}}>Tempo limite</div>
            </div>

           <Radio.Group 
             style={{width:'100%'}} 
             onChange={ ({target}) => edit('localizacao','value',target.value) } 
             value={loc.value}
           >


              <div style={{display:'flex'}}>
                <Radio style={{flex:1}} value={1}>NFC</Radio>
                <NumberShow 
                   value={loc.nfc} 
                   onChange={ ({target}) => edit('localizacao','nfc',target.value) }
                />
              </div>
              <Slider 
                 value={loc.nfc} 
                 tooltipVisible={false} 
                 max={180} 
                 step={1} 
                 marks={{0:0,180:180}} 
                 onChange={ (value) => edit('localizacao','nfc',value) }
                 style={{marginBottom:60}}
               />
              

              <div style={{display:'flex'}}>
                <Radio style={{flex:1}} value={2}>Voz</Radio>
                <NumberShow 
                   value={loc.voz} 
                   onChange={ ({target}) => edit('localizacao','voz',target.value) }
                />
              </div>
              <Slider 
                 value={loc.voz} 
                 tooltipVisible={false} 
                 max={180} 
                 step={1} 
                 marks={{0:0,180:180}} 
                 onChange={ (value) => edit('localizacao','voz',value) }
                 style={{marginBottom:60}}
               />


              <div style={{display:'flex'}}>
                <Radio style={{flex:1}} value={3}>Teclado</Radio>
                <NumberShow 
                    value={loc.teclado} 
                    onChange={ ({target}) => edit('localizacao','teclado',target.value) }
                />
              </div>
              <Slider 
                value={loc.teclado} 
                tooltipVisible={false} 
                max={180} 
                step={1} 
                marks={{0:0,180:180}} 
                onChange={ (value) => edit('localizacao','teclado',value) }
              />
           </Radio.Group >


       </div>
   )
}

export default Localizacao

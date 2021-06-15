import React from 'react'

import { Radio } from 'antd'

const Entrada = ({en,edit}) => {
   return (
       <Radio.Group 
         style={{padding:10}} 
         onChange={ ({target}) => edit('entrada','value',target.value) } 
         value={en.value}
       >
          <Radio value={1}>Leitura de etiquetas com NFC</Radio>
          <hr align='left' width='70%'/>
          <Radio value={2}>Inserção de texto por voz</Radio>
          <hr align='left' width='70%'/>
          <Radio value={3}>Inserção de texto via teclado</Radio>
          <hr align='left' width='70%'/>
       </Radio.Group>
   )
}

export default Entrada

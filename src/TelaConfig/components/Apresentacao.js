import React , {Fragment} from 'react'

import { Radio } from 'antd'

const Apresentacao = ({apr,onChange}) => {
   return (
       <Fragment>
        <div style={{marginBottom:5}}>
            <span style={{fontWeight:'bold'}}>Leitor de tela: </span>
            <span style={{color:'#4facf0'}}>DESATIVADO</span>
        </div>
       <Radio.Group style={{width:'100%'}}  onChange={ ({target}) => onChange(target.value) } value={apr.value}>
          <Radio value={1}>Imagem</Radio>
          <hr align='left' width='50%'/>
          <Radio value={2}>Vídeo</Radio>
          <hr align='left' width='50%'/>
          <Radio value={3}>Áudio</Radio>
          <hr align='left' width='50%'/>
          <Radio value={4}>Texto</Radio>
          <hr align='left' width='50%'/>
       </Radio.Group>
       </Fragment>
   )
}

export default Apresentacao

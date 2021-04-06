import React , {Fragment} from 'react'

import { Checkbox } from 'antd'

const Apresentacao = ({apr,edit}) => {
   return (
       <div style={{padding:10}}>
        <div style={{marginBottom:5}}>
            <span style={{fontWeight:'bold'}}>Leitor de tela: </span>
            <span style={{color:'#4facf0'}}>DESATIVADO</span>
        </div>
           <div style={{flex:1,textAlign:'left'}}>
               <Checkbox
                   style={{paddingRight: 10}}
                   checked={apr.imagem}
                   onChange={ ({target}) => edit('apresentacao','imagem', target.checked) }
               />
               Imagem
           </div>
           <hr align='left' width='60%'/>
           <div style={{flex:1,textAlign:'left'}}>
               <Checkbox
                   style={{paddingRight: 10}}
                   checked={apr.video}
                   onChange={ ({target}) => edit('apresentacao','video', target.checked) }
               />
               Vídeo
           </div>
           <hr align='left' width='60%'/>
           <div style={{flex:1,textAlign:'left'}}>
               <Checkbox
                   style={{paddingRight: 10}}
                   checked={apr.audio}
                   onChange={ ({target}) => edit('apresentacao','audio', target.checked) }
               />
               Áudio
           </div>
           <hr align='left' width='60%'/>
           <div style={{flex:1,textAlign:'left'}}>
               <Checkbox
                   style={{paddingRight: 10}}
                   checked={apr.texto}
                   onChange={ ({target}) => edit('apresentacao','texto', target.checked) }
               />
               Texto
           </div>
           <hr align='left' width='60%'/>
       </div>
   )
}

export default Apresentacao

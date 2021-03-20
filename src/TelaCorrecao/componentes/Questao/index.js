import React , { useState } from 'react'

import { Input } from 'antd'

import CardResposta from './CardResposta'
import CardRespostaEdit from './CardRespostaEdit'

const { TextArea } = Input

const Questao = ({quest,edit}) => {

   const [editando,setEditando] = useState(false)

   return (
       <div style={{
           width:'100%',
           display:'flex',
           justifyContent:'space-between',
           alignItems:'stretch',
       }}>

       <div style={{display:'flex',flexDirection:'column',flex:1,marginLeft:10,marginRight:10}}>
         <div style={{padding:10}}>Resposta do aluno</div>
         <CardResposta res={quest.respostaAluno} onCheck={ (value) => edit({ 
                ...quest,
                correcaoSistema:{...quest.respostaAluno,correta:value} 
            })} 
            style={{backgroundColor:'#eaf7fd'}} 
         />
       </div>

       <div style={{display:'flex',flexDirection:'column',flex:1,marginLeft:10,marginRight:10}}>
         <div style={{padding:10}}>Correção do sistema</div>
         { editando 
        ? <CardRespostaEdit 
            onEdit={ () => setEditando(false) }
            res={quest.correcaoSistema} 
            edit={ (field,value) => edit({ 
                    ...quest,
                    correcaoSistema:{...quest.correcaoSistema,[field]:value} 
                })} 
            style={{backgroundColor:'#eaf7fd'}} 
         />
        : <CardResposta res={quest.respostaAluno} 
            onEdit={ () => setEditando(true) }
            onCheck={ (value) => edit({ 
                ...quest,
                correcaoSistema:{...quest.correcaoSistema,correta:value} 
            })} 
            style={{backgroundColor:'#eaf7fd'}} 
         />
         }
       </div>

       <div style={{display:'flex',flexDirection:'column',flex:1,marginLeft:10,marginRight:10}}>
         <div style={{padding:10}}>Considerações do professor</div>
         <TextArea style={{flex:1}}/>
       </div>

       </div>
   ) 
}

export default Questao

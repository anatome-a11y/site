import React , { useState , useEffect } from 'react'

import { Input } from 'antd'

import CardResposta from './CardResposta'
import CardRespostaEdit from './CardRespostaEdit'

const { TextArea } = Input

const Questao = ({quest,backup,edit}) => {

   const [editando,setEditando] = useState(false)

   const editSistema = (field,value) => edit({ 
        ...quest,
        correcaoSistema:{...quest.correcaoSistema,[field]:value} 
    })

    const editRespostaAluno = (value) => edit({ 
        ...quest,
        respostaAluno:{...quest.respostaAluno,correta:value} 
    })

    const editConsideracoes = (value) => edit({ 
        ...quest,
        consideracoes: value,
    })


   return (
       <div style={{
           width:'100%',
           display:'flex',
           justifyContent:'space-between',
           alignItems:'stretch',
           marginBottom:32,
       }}>

       <div style={{display:'flex',flexDirection:'column',flex:1,marginLeft:10,marginRight:10}}>
         <div style={{padding:10}}>Resposta do aluno</div>
         <CardResposta res={quest.respostaAluno} onCheck={editRespostaAluno}
            style={{backgroundColor:'#e7e7e7'}}
         />
       </div>

       <div style={{display:'flex',flexDirection:'column',flex:1,marginLeft:10,marginRight:10}}>
         <div style={{padding:10}}>Correção do sistema</div>
         { editando 
        ? <CardRespostaEdit 
            onEdit={ () => setEditando(false) }
            onTrash={backup}
            res={quest.correcaoSistema} 
            edit={editSistema}
            style={{backgroundColor:'#eaf7fd'}} 
         />
        : <CardResposta res={quest.correcaoSistema} 
            onEdit={ () => setEditando(true) }
            onTrash={backup}
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
         <TextArea 
             style={{flex:1}} 
             value={quest.consideracoes} 
             onChange={ ({target}) => editConsideracoes(target.value) }
         />
       </div>

       </div>
   ) 
}

export default Questao

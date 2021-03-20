import React from 'react'

import { Input } from 'antd'

import CardQuestaoResposta from './CardQuestaoResposta'

const { TextArea } = Input

const QuestaoAvaliacao = ({quest}) => {
   return (
       <div style={{
           width:'100%',
           display:'flex',
           justifyContent:'space-between',
           alignItems:'stretch',
       }}>

       <div style={{display:'flex',flexDirection:'column',flex:1,marginLeft:10,marginRight:10}}>
         <div style={{padding:10}}>Resposta do aluno</div>
         <CardQuestaoResposta res={quest.respostaAluno} />
       </div>

       <div style={{display:'flex',flexDirection:'column',flex:1,marginLeft:10,marginRight:10}}>
         <div style={{padding:10}}>Correção do sistema</div>
         <CardQuestaoResposta res={quest.correcaoSistema} style={{backgroundColor:'#eaf7fd'}} />
       </div>

       <div style={{display:'flex',flexDirection:'column',flex:1,marginLeft:10,marginRight:10}}>
         <div style={{padding:10}}>Considerações do professor</div>
         <TextArea style={{flex:1}}/>
       </div>

       </div>
   ) 
}

export default QuestaoAvaliacao

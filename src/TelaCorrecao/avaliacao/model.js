export const Parte = (pai,numero,nome,descricao) => 
    ({pai,numero,nome,descricao})

export const Questao = (respostaAluno,correcaoSistema,consideracoesProfessor) =>
    ({respostaAluno,correcaoSistema,consideracoesProfessor}) 

export const Avaliacao = (id,nomeAluno,data,conteudo,questoes) => 
    ({id,nomeAluno,data,conteudo,questoes})

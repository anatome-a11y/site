export const Parte = (pai,numero,nome,descricao,correta=false) => 
    ({pai,numero,nome,descricao,correta})

export const Questao = (respostaAluno,correcaoSistema,consideracoesProfessor='') =>
    ({respostaAluno,correcaoSistema,consideracoesProfessor}) 

export const Avaliacao = (id,nomeAluno,data,conteudo,disciplina,curso,instituicao,questoes) =>
    ({id,nomeAluno,data,conteudo,disciplina,curso,instituicao,questoes})

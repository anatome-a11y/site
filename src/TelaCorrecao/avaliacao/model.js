export const Parte = (pai,numero,nome,descricao) => 
    ({pai,numero,nome,descricao})

export const Questao = (respostaAluno,correcaoSistema,consideracoesProfessor='',correta=false) =>
    ({respostaAluno,correcaoSistema,consideracoesProfessor}) 

export const Avaliacao = (id,nomeAluno,data,conteudo,disciplina,curso,instituicao,questoes) =>
    ({id,nomeAluno,data,conteudo,disciplina,curso,instituicao,questoes})

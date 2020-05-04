export default {
    common: {
        script: 'Roteiro',
        grade: 'Disciplina',
        course: 'Curso',
        lang: 'Idioma',
        institute: 'Instituição',
        relativeLocation: 'Loc. Relativa'
    },
    actions: {
        filter: 'Filtrar',
        cancel: 'Cancelar',
        save: 'Salvar',
        goBack: 'Voltar'
    },    
    layout: {
        subtitle: 'Ferramenta de autoria Anatome'
    },
    home: {
        title: 'Listas de roteiros',
        actions: {
            goToScriptContent: 'Ir para conteúdo das peças'
        },
        tables: {
            scriptContent: {
                title: 'Conteúdos dos roteiros',
                actions: {
                    add: 'Cadastrar roteiro'
                }
            },
            pinnedScripts: {
                title: 'Roteiros setados',
                actions: {
                    pin: 'Setar localização'
                }
            }
        }
    },
    pieceContent: {
        title: 'Novo conteúdo da peça',
        sections: {
            theoricalKnowledge:{
                title: 'Conteúdo Teórico (CT)',
                description: 'Selecione uma ou mais partes anatômicas e, em seguida, informe o Conhecimento Teórico associado sem citar o nome da(s) parte(s). Acesse a ajuda ou exemplos para mais informações',
                actions: {
                    add: 'Adicionar CT',
                    addToNewPart: 'Adicionar CT a nova parte'
                }
            }
        }
    },
    pinnedScript: {
        sections: {
            assocBetweenNameAndLoc: {
                title: 'Associação entre o nome e a localização da parte na peça',
                description: 'Associe ao nome de cada parte anatômica o número da seta (ou etiqueta) que indica a sua localização na peça física',
            }
        },
        actions: {
            save: 'Salvar roteiro setado'
        }        
    }  
}
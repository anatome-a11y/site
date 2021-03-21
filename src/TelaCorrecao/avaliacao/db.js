import { Avaliacao , Questao , Parte } from './model'

const db = {
    0 : Avaliacao(
        0,
        'Maria Eduarda da Silva',
        '05/03/2021',
        'Sistema Esqueletico',
        'Odontologia',
        'Eng. Comp.',
        'CEFET MG',
        [
            Questao(
              Parte('Crânio',34,'Maxila','Osso par irregular e suporta a arcada dentária superior'),
              Parte('Crânio',34,'Maxila','Osso par irregular e pneumático da face lorem impsum etcaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
            ),
            Questao(
              Parte('Teste',33,'Teste2','lorem ipsum dolor'),
              Parte('Teste',33,'Teste2','lorem ipsum teste teste'),
            ),
        ],
    )

}

export default db

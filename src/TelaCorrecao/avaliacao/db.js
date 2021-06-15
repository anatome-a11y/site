import { Avaliacao , Questao , Parte } from './model'

const db = [
    Avaliacao(
        0,
        'Maria Eduarda da Silva',
        '05/03/2021',
        'Sistema Esqueletico (teorica)',
        'Odontologia',
        'Eng. Comp.',
        'CEFET MG',
        [
            Questao(
                Parte(
                    'Crânio',
                    2,
                    'Parietal',
                    [
                        'Osso par, laminar, localizado nas laterais superiores do crânio.',
                    ]
                ),
                Parte(
                    'Crânio',
                    2,
                    'Parietal',
                    [
                        'Osso par, laminar, localizado nas laterais superiores do crânio.',
                    ]
                ),
            ),

            Questao(
                Parte(
                    'Crânio',
                    8,
                    'Zigomático',
                    [
                        'Osso par e irregular, se localiza na região da bochecha e é o mais proeminente da face',
                    ]
                ),
                Parte(
                    'Crânio',
                    8,
                    'Zigomático', 
                    [
                        'Osso par, irregular. Localiza-se na região da bochecha e é o mais proeminente da face.',
                    ]
                ),
            ),

            Questao(
                Parte(
                    'Crânio',
                    9,
                    'Maxila',
                    [
                        'Osso par irregular e pneumático, articula-se com o nasal, etmoide e frontal',
                        'Suportam os dentes superiores e forma uma parte do palato, da cavidade nasal e da órbita ocular',
                    ]
                ),
                Parte(
                    'Crânio',
                    9,
                    'Maxila',
                    [
                        'Osso par, irregular e pneumático. Articula-se com o nasal, palatino, etmoide, frontal, zigomático, lacrimal, vômer e concha nasal inferior.',
                        'Suportam os dentes superiores e forma uma parte do palato, da cavidade nasal e da órbita ocular.',
                    ]
                ),
            )
        ],
    ),
    Avaliacao(
        1,
        'Maria Eduarda da Silva',
        '05/03/2021',
        'Sistema Esqueletico (localização)',
        'Odontologia',
        'Eng. Comp.',
        'CEFET MG',
        [
            Questao(
                Parte(
                    'Crânio',
                    3,
                    '',
                    [
                        'Etmoide'
                    ]
                ),
                Parte(
                    'Crânio',
                    3,
                    '',
                    [
                        'Occipital'
                    ]
                ),
            ),
            Questao(
                Parte(
                    'Crânio',
                    5,
                    '',
                    [
                        'Esfenoide'
                    ]
                ),
                Parte(
                    'Crânio',
                    5,
                    '',
                    [
                        'Esfenoide'
                    ]
                ),
            ),
        ],
    )
]

export default db

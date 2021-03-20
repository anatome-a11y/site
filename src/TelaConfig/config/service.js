export const def = { 
    entrada: {value:3},
    apresentacao: {value:4},
    conhecimento: {
        value:2,
        voz:30,
        teclado:40,
    },
    localizacao: {
        value:3,
        nfc:10,
        voz:20,
        teclado:30,
    },
    tentativas: {value:3},
}

let conf = def

export const getConf = () => conf
export const setConf = (c) => conf = c
export const resetConf = () => { conf = def ; return conf }

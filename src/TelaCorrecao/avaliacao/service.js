import db from './db'

export const getAvaliacao = (id) => db[id]
export const setAvaliacao = (avaliacao) => db[avaliacao.id] = avaliacao

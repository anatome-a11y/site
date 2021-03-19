import db from './db'

export const getAvaliacao = (id) => db[id]
export const setAvaliacao = (id,avaliacao) => db[id] = avaliacao

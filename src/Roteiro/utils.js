import { request } from '../utils/data'
const { v4: uuidv4 } = require('uuid');


export const onValidate = model => {
    const { nome, curso, disciplina, conteudo, partes, idioma, somentePratica } = model;
    let campos = [], msgs = []

    if (idioma == '') {
        campos = [...campos, 'idioma'];
        msgs = [...msgs, 'Campo obrigatório'];
    }

    if (nome == '') {
        campos = [...campos, 'nome'];
        msgs = [...msgs, 'Campo obrigatório'];
    }

    if (curso == '') {
        campos = [...campos, 'curso'];
        msgs = [...msgs, 'Campo obrigatório'];
    }

    if (disciplina == '') {
        campos = [...campos, 'disciplina'];
        msgs = [...msgs, 'Campo obrigatório'];
    }

    if (partes.length == 0) {
        campos = [...campos, 'partes'];
        msgs = [...msgs, 'Inclua ao menos uma parte no roteiro'];
    }        

    if(!somentePratica){
        if (conteudo.selected.length == 0) {
            campos = [...campos, 'conteudo'];
            msgs = [...msgs, 'Inclua ao menos um conteúdo no roteiro'];
        }        
    }

    return { campos, msgs }
}

export const onSave = (onOpenSnackbar, onSetAppState, model, cb = false) => {
        
    const erros = onValidate(model);

    if (erros.campos.length > 0) {
        onOpenSnackbar('Verifique os erros de validação!')
        onSetAppState({ erros })
        return false;
    }

    onOpenSnackbar('Aguarde... Salvando roteiro...', 'loading');
    onSetAppState({ loading: true })
    const body = {
        ...model,
        conteudos: model.somentePratica ? [] : model.conteudo.selected.map(ct => (ct._id))
    }

    const _request = model._id != null ? request(`roteiro/${model._id}`, { method: 'PUT', body: JSON.stringify(body) }) : request('roteiro', { method: 'POST', body: JSON.stringify({...body, _id: uuidv4()}) })

    _request
        .then(ret => {
            if (ret.status == 200) {
                cb(ret)
            } else {
                throw ret.error
            }
        })
        .catch(e => {
            const msg = typeof e === 'string' ? e : 'Não foi possível salvar este roteiro'
            onOpenSnackbar(msg)
            console.error(e)
        })
        .finally(() => {
            onSetAppState({ loading: false })
        })
}  
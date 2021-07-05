import { request } from '../utils/data'
const { v4: uuidv4 } = require('uuid');

export const onValidate = model => {
    const { nome, roteiro, instituicao, pecasFisicas, mapa, tipoPecaMapeamento } = model;
    let campos = [], msgs = []


    if (nome == '') {
        campos = [...campos, 'nome'];
        msgs = [...msgs, 'Campo obrigatório'];
    }

    if (roteiro == '') {
        campos = [...campos, 'roteiro'];
        msgs = [...msgs, 'Campo obrigatório'];
    }

    if (instituicao == '') {
        campos = [...campos, 'instituicao'];
        msgs = [...msgs, 'Campo obrigatório'];
    }

    if (pecasFisicas.length == 0) {
        campos = [...campos, 'pecasFisicas'];
        msgs = [...msgs, 'Adicione ao menos um peça física'];
    } else {
        if (pecasFisicas.find(p => p.nome.trim() == "")) {
            campos = [...campos, 'pecasFisicas'];
            msgs = [...msgs, 'Informe o nome de todas as peças físicas'];
        }
    }

    const hasError = mapa.find(m => {
        if (tipoPecaMapeamento == "pecaFisica") {
            if (m.localizacao.find(l => l.numero == '' || l.pecaFisica.trim() == '')) {
                return true
            }
            return false;
        } else {
            return false;
        }
    })

    if (hasError) {
        campos = [...campos, 'mapa'];
        msgs = [...msgs, 'Preencha todos os campos obrigatórios'];
    } else {
        if (mapa.length == 0) {
            campos = [...campos, 'mapa'];
            msgs = [...msgs, 'Inclua as partes anatômicas para serem setadas'];
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

    onOpenSnackbar('Aguarde... Salvando roteiro setado...', 'loading');
    onSetAppState({ loading: true })
    const body = {
        ...model,
        mapa: model.mapa.map(m => ({ ...m, parte: m.parte._id }))
    }

    const _request = model.hasOwnProperty('_id') ? request(`anatomp/${model._id}`, { method: 'PUT', body: JSON.stringify(body) }) : request('anatomp', { method: 'POST', body: JSON.stringify({ ...body, _id: uuidv4() }) })

    _request
        .then(ret => {
            if (ret.status == 200) {
                cb(ret)
            } else {
                throw ret.error
            }
        })
        .catch(e => {
            onOpenSnackbar('Não foi possível salvar o mapeamento do roteiro')
            console.error(e)
        })
        .finally(() => {
            onSetAppState({ loading: false })
        })
}
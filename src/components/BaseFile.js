import React, { Component, Fragment } from 'react';


import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Action from '../components/input/Action';
import AutoComplete from '../components/input/AutoComplete';
import { Maybe } from 'utils/data'

import Chip from '@material-ui/core/Chip';
import Info from '../components/output/Info';
import IconeAnexo from '@material-ui/icons/AttachFile';
import IconeRemover from '@material-ui/icons/Clear';
import IconeCarregar from '@material-ui/icons/Archive';


const { v4: uuidv4 } = require('uuid');

const _tiposMidia = {
    aud: 'Áudio',
    img: 'Imagem',
    vloe: 'Vídeo em linguagem oral e escrita',
    vad: 'Vídeo com audio descrição',
    vls: 'Vídeo com tradução em linguagem de sinais',
}

const _midia = {
    tipo: '',
    url: ''
}

const _instruction = {
    text: '',
    midia: []
}

const _contentItem = {
    value: '',
    parts: [],
    instructions: [],
    candidatesToAdd: []
}

class BaseFile extends Component {



    tipos = {
        'application/pdf': 'texto',
        'image/jpeg': 'imagem',
        'audio/mp3': 'imagem',
    }

    tags = {
        texto: [
            { value: 'textoPT', label: 'Texto em português' },
            { value: 'textoOutroIdioma', label: 'Texto em língua estrangeira' },
        ],
        imagem: [
            { value: 'diagrama', label: 'Diagrama' },
            { value: 'fotografia', label: 'Fotografia' },
        ],
        audio: [
            { value: 'audioProfessor', label: 'Audio do professor' },
            { value: 'podcast', label: 'Podcast' },
        ]
    }

    state = {
        file: null,
        tags: '',
        added: []
    }

    render() {
        const { file, tags, added } = this.state;
        const res = file != null ? this.tipos[file.type] : null;

        return (
            <div style={{ marginTop: 10, width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <div>
                        <Tooltip placement='top' PopperProps={{ style: { pointerEvents: 'none' } }} title='Carregar conteúdo'>
                            <IconButton component='label'>
                                <IconeCarregar />
                                <input type="file" style={{ display: 'none' }} onChange={e => this.upload(e.target.files[0], )} />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <div style={{ flex: 2, margin: 5 }}>
                        {file != null ? (
                            res != undefined ? (
                                <AutoComplete
                                    label={'Tags que descrevem o arquivo ' + Maybe(file).maybe('', f => f.name)}
                                    data={this.tags[res].map(({ label, value }) => ({ label, value }))}
                                    placeholder={'Identificação do tipo e conteúdo do arquivo'}
                                    onSelect={this.onChangeTags}
                                    value={tags}
                                />
                            ) : <Info>Tipo de arquivo inválido</Info>
                        ) : <Info>Nenhum arquivo selecionado</Info>}
                    </div>
                    {(file != null && res != undefined) ? (
                        <div style={{ margin: 5 }}><Action icon={<IconeAnexo />} onClick={this.onAdd} label='Anexar Arquivo' /></div>
                    ) : null}
                </div>
                {
                    added.length > 0 ? (
                        added.map(ad => (
                            <div key={ad.value} style={{ display: 'flex', alignItems: 'baseline' }}>
                                <div style={{ margin: 5 }}><Info>{ad.file.name}</Info></div>
                                <div style={{ flex: 2, margin: 5 }}>
                                    {ad.tags.map(t => (
                                        <Chip style={{ margin: 3 }} key={t.value} label={t.label} />
                                    ))}
                                </div>
                                <div style={{ margin: 5 }}>
                                    <Action icon={<IconeRemover />} onClick={() => { }} label='Remover Arquivo' />
                                </div>
                            </div>
                        ))
                    ) : <Info>Nenhum arquivo vinculado a este conteúdo</Info>
                }
            </div>
        )
    }

    upload = (file) => {
        this.setState({ file })
        console.log(file)
    };

    onAdd = () => {
        const { added, file, tags } = this.state;
        const res = file != null ? this.tipos[file.type] : null;
        this.setState({
            file: null,
            tags: '',
            added: [...added, {
                value: uuidv4(), file, tags: tags.split(',').map(value => this.tags[res].find(t => t.value == value))
            }]
        })
    }

    onChangeTags = tags => this.setState({ tags })
}



export default BaseFile;
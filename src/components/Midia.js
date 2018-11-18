import React, { Component, Fragment } from 'react';

import { List, Popover, Tooltip, Button, Select, Input, Icon, Upload, Tag } from 'antd'

import {Maybe} from '../utils/data'

import {filter} from '../utils/data'
const Option = Select.Option;

const _tags = [
    //Tags de 1 a 10: Pessoas com defiiencia auditiva
    { _id: "1", nome: 'Áudio em Português' },
    { _id: "2", nome: 'Legenda em Português' },
    { _id: "3", nome: 'Vídeo em Libras' },
    { _id: "4", nome: 'Janela de intérprete' },
    { _id: "5", nome: 'Audiodescrição' },
]



const getMediaIcon = mime => {
    const [main, type] = mime.split('/');

    switch (type) {
        case 'pdf': return "file-pdf";
        case 'doc':
        case 'docx': return "file-word";
        case 'xls':
        case 'xlsx': return "file-excel";
    }

    switch (main) {
        case 'application': return "code";
        case 'audio': return "sound";
        case 'video': return "video-camera";
        case 'text': return "text";
        case 'image': return "picture";
        default: return "file-unknown";
    }
}

const MidiaContent = ({ file, onChange, midias, idx }) => {
    return (
        <div>
            <div>
                {onChange ? (
                    <Select                    
                    notFoundContent='Nenhuma tag foi encontrada'
                    mode="multiple"
                    style={{width: '100%', marginBottom: 10}}
                    placeholder="Tags"
                    value={file.tags}
                    optionFilterProp='children'
                    filterOption={filter}                    
                    onChange={tags => onChange([
                        ...midias.slice(0, idx),
                        {...midias[idx], tags},
                        ...midias.slice(idx+1),
                    ])}
                >
                    {_tags.map(t => <Option value={t._id} key={t._id}>{t.nome}</Option>)}
                </Select>                    
                ) : (
                    <div style={{marginBottom: 10}}>
                        <div>Tags: </div>
                        {file.tags.length > 0 ? file.tags.map(t => {Maybe(_tags[t]).maybe('Indefinida', tt => <Tag key={t}>{tt.nome}</Tag>)}) : 'Nenhuma'}
                    </div>
                )}                
            </div>
            <div style={{ textAlign: 'center' }}>
                <Button target="_blank" href={midias[idx].url}><Icon type="download" />Baixar</Button>
                {onChange && <Button onClick={() => onChange([
                        ...midias.slice(0, idx),
                        ...midias.slice(idx+1),
                    ])}><Icon type="delete" />Excluir</Button>}
            </div>
        </div>
    )
}


const Midia = ({key, file, idx, midias, onChange}) => <Popover key={key} content={<MidiaContent file={file} idx={idx} midias={midias} onChange={onChange} />} title={file.name}><Button style={{ marginRight: 3 }} shape='circle' icon={getMediaIcon(file.type)} /></Popover>


export default Midia;
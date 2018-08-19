import React, { Component, Fragment } from 'react';

import { List, Popover, Tooltip, Button, Select, Input, Icon, Upload, Tag } from 'antd'

import {filter} from '../utils/data'
const Option = Select.Option;

const _tags = [
    { id: "1", nome: 'Texto' },
    { id: "2", nome: 'Língua portuguesa' },
    { id: "3", nome: 'Língua inglesa' },
    { id: "4", nome: 'Libras' },
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
                    {_tags.map(t => <Option value={t.id} key={t.id}>{t.nome}</Option>)}
                </Select>                    
                ) : (
                    <div style={{marginBottom: 10}}>
                        <div>Tags: </div>
                        {file.tags.map(t => <Tag key={t}>{_tags[t].nome}</Tag>)}
                    </div>
                )}                
            </div>
            <div style={{ textAlign: 'center' }}><Button target="_blank" href={midias[idx].url}><Icon type="download" />Baixar</Button></div>
        </div>
    )
}


const Midia = ({key, file, idx, midias, onChange}) => <Popover key={key} content={<MidiaContent file={file} idx={idx} midias={midias} onChange={onChange} />} title={file.name}><Button style={{ marginRight: 3 }} shape='circle' icon={getMediaIcon(file.type)} /></Popover>


export default Midia;
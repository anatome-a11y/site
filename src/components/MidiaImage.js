import React from 'react';
import { Popover, Button, Icon, Input, Select, Tag } from 'antd'

import { Maybe } from '../utils/data'

import { filter } from '../utils/data'
const Option = Select.Option;

const _tags = [
    //Tags de 1 a 10: Pessoas com defiiencia auditiva
    { _id: "1", nome: 'Áudio em Português' },
    { _id: "2", nome: 'Legenda em Português' },
    { _id: "3", nome: 'Vídeo em Libras' },
    { _id: "4", nome: 'Janela de intérprete' },
    { _id: "5", nome: 'Audiodescrição' },
]

const MidiaContent = ({ file, onChange, midias, idx }) => {

    return (
        <div>
            <img src={midias[idx].url} style={{
                maxHeight: 100,
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginBottom: 10
            }} />

            <div style={{
                marginTop: 5,
                marginBottom: 5
            }}>
                <Input
                    style={{ width: '100%', marginBottom: 10 }}
                    placeholder="Referência"
                    value={file.referencia}
                    onChange={
                        referencia => onChange([
                            ...midias.slice(0, idx),
                            { ...midias[idx], referencia: referencia.target.value },
                            ...midias.slice(idx + 1),
                        ])
                    }
                >
                </Input>
            </div>

            <div style={{
                marginTop: 5,
                marginBottom: 10
            }}>
                <Input
                    style={{ width: '100%', marginBottom: 10 }}
                    placeholder="Vista"
                    value={file.vista}
                    onChange={
                        vista => onChange([
                            ...midias.slice(0, idx),
                            { ...midias[idx], vista: vista.target.value },
                            ...midias.slice(idx + 1),
                        ])
                    }
                >
                </Input>
            </div>

            <div style={{ textAlign: 'center' }}>
                <Button target="_blank" href={midias[idx].url}><Icon type="download" />Baixar</Button>
                {onChange && <Button onClick={() => onChange([
                    ...midias.slice(0, idx),
                    ...midias.slice(idx + 1),
                ])}><Icon type="delete" />Excluir</Button>}
            </div>
        </div >
    )
}

const Midia = ({ key, file, idx, midias, onChange }) =>
    <Popover key={key}
        content={<MidiaContent file={file} idx={idx} midias={midias} onChange={onChange} />}
    >
        <Button style={{ marginRight: 3 }} shape='circle' icon="picture" />
    </Popover>


export default Midia;
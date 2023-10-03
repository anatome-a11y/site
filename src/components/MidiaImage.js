import React from 'react';
import { Popover, Button, Icon, Input } from 'antd';
import { is3dFile } from '../utils/fileUtils';

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

const Midia3DContent = ({ file, onChange, midias, idx }) => {
    return (
        <div>
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

const Midia = ({ key, file, idx, midias, onChange }) => {
    if (is3dFile(file.name)) {
        return (<Popover key={key}
            content={<Midia3DContent file={file} idx={idx} midias={midias} onChange={onChange} />}
        >
            <Button style={{ marginRight: 3 }} shape='circle' icon='file' />
        </Popover>)
    }
    

    return (<Popover key={key}
        content={<MidiaContent file={file} idx={idx} midias={midias} onChange={onChange} />}
    >
        <Button style={{ marginRight: 3 }} shape='circle' icon='picture' />
    </Popover>)
}


export default Midia;
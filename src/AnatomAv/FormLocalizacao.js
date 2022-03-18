import React, { Component, Fragment } from 'react';

import { Form, InputNumber, Select, Row, Col } from 'antd';

import TextArea from 'antd/lib/input/TextArea';

const FormItem = Form.Item;
const Option = Select.Option

const Label = ({ children, error = null }) => (
    <div style={{ color: error ? '#f5222d' : '#000000d1', marginBottom: 5, marginTop: 15 }}>
        {children}
    </div>
)

const Num = ({ value, onChange, label }) => (
    <TextArea autosize style={{ width: '100%' }} value={value} onChange={e => onChange(e.target.value)} />
)



class FormLocalizacao extends Component {

    render() {

        const { model, onChange, partes, item, erroLocalizacao } = this.props;
        const {
            referenciaParaReferenciado,
            referenciadoParaReferencia,
            referencia
        } = model

        const sel = partes.find(p => p._id == referencia);
        const nomeSel = sel ? sel.nome : '[Referência a selecionar]';

        return (
            <div layout="vertical" style={{ padding: 0 }}>
                <Label error={erroLocalizacao}>A parte <span style={{ fontWeight: 'bold' }}>{item.parte.nome}</span> é referenciada pela parte:</Label>
                <Form>
                    <FormItem
                        validateStatus={erroLocalizacao != null ? 'error' : ''}
                        help={erroLocalizacao}
                    >
                        <Select
                            showSearch
                            notFoundContent='Nenhuma parte foi encontrada'
                            style={{ width: '100%' }}
                            placeholder="Parte anatômica"
                            value={referencia}
                            optionFilterProp="children"
                            onChange={v => {
                                onChange('referencia')(v)
                            }}
                        >
                            {partes.map(({ nome, _id }) => <Option value={_id} key={_id}>{nome}</Option>)}
                        </Select>
                    </FormItem>
                </Form>
                <Label>A parte <span style={{ fontWeight: 'bold' }}>{item.parte.nome}</span> em relação à parte <span style={{ fontWeight: 'bold' }}>{nomeSel}</span> está localizada:</Label>
                <Num value={referenciaParaReferenciado} onChange={onChange('referenciaParaReferenciado')} />
                <Label>A parte <span style={{ fontWeight: 'bold' }}>{nomeSel}</span> em relação à parte <span style={{ fontWeight: 'bold' }}>{item.parte.nome}</span> está localizada:</Label>
                <Num value={referenciadoParaReferencia} onChange={onChange('referenciadoParaReferencia')} />
            </div>
        )
    }
}



export default FormLocalizacao;
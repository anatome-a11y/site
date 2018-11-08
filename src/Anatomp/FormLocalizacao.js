import React, { Component, Fragment } from 'react';

import { Form, InputNumber, Select, Row, Col } from 'antd';

import TextArea from 'antd/lib/input/TextArea';

const FormItem = Form.Item;
const Option = Select.Option


const Num = ({ value, onChange, label }) => (
    <FormItem label={label}>
        <TextArea autosize style={{ width: '100%' }} value={value} onChange={e => onChange(e.target.value)} />
    </FormItem>
)

class FormLocalizacao extends Component {

    render() {

        const { model, onChange, partes } = this.props;

        const {
            referenciaParaReferenciado,
            referenciadoParaReferencia,
            referencia
        } = model

        return (
            <Form layout="vertical">
                <FormItem label="Parte referenciada por:">
                    <Select
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
                <Num label="Da referência para o referenciado:" value={referenciaParaReferenciado} onChange={onChange('referenciaParaReferenciado')} />
                <Num label="Do referenciado para a referência:" value={referenciadoParaReferencia} onChange={onChange('referenciadoParaReferencia')} />
            </Form>
        )
    }
}



export default FormLocalizacao;
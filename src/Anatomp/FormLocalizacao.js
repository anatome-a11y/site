import React, { Component, Fragment } from 'react';

import { Form, InputNumber, Select, Row, Col } from 'antd';

const FormItem = Form.Item;

// import {Maybe} from '../utils/data'


const Num = ({ value, onChange, label }) => (
    <FormItem style={{ width: '50%', display: 'inline-block', paddingLeft: 10, paddingRight: 10 }} label={label}>
        <InputNumber style={{ width: '100%' }} min={0} value={value} formatter={value => `${value}cm`} parser={value => value.replace('cm', '')} onChange={onChange} />
    </FormItem>
)

class FormLocalizacao extends Component {

    render() {

        const { model, onChange } = this.props;

        const {
            anterior,
            posterior,
            latDir,
            latEsq,
            medDir,
            medEsq,
            superior,
            inferior,
        } = model

        return (
            <Form layout="vertical">
                <Num label="Anterior" value={anterior} onChange={onChange('anterior')} />
                <Num label="Posterior" value={posterior} onChange={onChange('posterior')} />
                <Num label="Lateral à direita" value={latDir} onChange={onChange('latDir')} />
                <Num label="Lateral à esquerda" value={latEsq} onChange={onChange('latEsq')} />
                <Num label="Medial à direita" value={medDir} onChange={onChange('medDir')} />
                <Num label="Medial à esquerda" value={medEsq} onChange={onChange('medEsq')} />
                <Num label="Superior" value={superior} onChange={onChange('superior')} />
                <Num label="Inferior" value={inferior} onChange={onChange('inferior')} />
            </Form>
        )
    }
}



export default FormLocalizacao;
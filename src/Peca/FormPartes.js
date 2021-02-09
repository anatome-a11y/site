import React, { Component, Fragment } from 'react';

import { Form, Input, Button, Tag, Row, Col, Icon } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import Label from '../components/Label'

const { v4: uuidv4 } = require('uuid');

const FormItem = Form.Item;

const props = {
    labelCol: {},
    wrapperCol: {},
}

class FormPartes extends Component {

    state = {
        string: '',
        tokens: [],
    }

    componentWillReceiveProps(next) {
    }

    render() {
        const { partes, onChangeParte, onRemoveParte, erros, somentePratica, form } = this.props;
        const { string, tokens } = this.state;

        const _erros = {
            partes: erros.campos.indexOf('partes'),
        }

        return (
            <Fragment>
                <Form layout="vertical">
                    <Row>
                        <Col>
                            <Label>Copie os nomes das partes anatômicas desta peça e cole-os no campo a seguir ou digite-os um a um</Label>
                            <FormItem
                                validateStatus={_erros.partes != -1 ? 'error' : ''}
                                help={erros.msgs[_erros.partes] || ''}
                            >
                                <TextArea onBlur={this.gerar} autosize id='partesTextArea' placeholder="Cada nome deve estar em uma linha" value={string} onChange={this.onChange} />
                            </FormItem>
                            <FormItem>
                                <Row>
                                    {partes.map((p, idx) => {
                                        return (
                                            <Col span={6} key={p._id} style={{ padding: 5, display: 'flex' }}>
                                                <Input
                                                    style={{ height: 22 }}
                                                    size='small'
                                                    value={p.nome}
                                                    suffix={<Icon style={{ marginTop: 4, cursor: 'pointer' }} type="close" onClick={onRemoveParte(p._id)} />}
                                                    onChange={e => onChangeParte(idx, e.target.value)}
                                                />
                                            </Col>
                                        )
                                    })}
                                    {tokens.map((item, idx) => (
                                        <Col span={6} key={item} style={{ padding: 5, display: 'flex' }}>
                                            <Tag style={{
                                                height: 22,
                                                width: '100%',
                                                textAlign: 'center',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>{item}</Tag>
                                        </Col>
                                    ))}
                                    {partes.length == 0 && tokens.length == 0 && 'Esta peça ainda não possui partes associadas'}
                                </Row>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Fragment>
        )
    }

    onChange = e => {
        const string = e.target.value;
        const tokens = document.getElementById('partesTextArea').value.split(/\n/).filter(t => t != "");
        this.setState({ string, tokens })
    }

    gerar = () => {
        const { onChange, partes } = this.props;
        const { tokens } = this.state;
        this.setState({ tokens: [], string: '' })
        const novas = tokens.map(nome => ({ _id: uuidv4(), nome }));
        onChange('partes')([...partes, ...novas])
    }
}


export default Form.create()(FormPartes);
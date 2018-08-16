import React, { Component, Fragment } from 'react';

import { Form, Input, Button, Tag, Row, Col, Icon } from 'antd';
import TextArea from 'antd/lib/input/TextArea';

const uuidv4 = require('uuid/v4');

const FormItem = Form.Item;

const props = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
}

class FormPartes extends Component {

    state = {
        string: '',
        tokens: [],
    }

    componentWillReceiveProps(next) {
        if (next.clickUID != this.props.clickUID) {
            this.gerar()
        }
    }

    render() {
        const { partes, onChangeParte, onRemoveParte, erros, form } = this.props;
        const { string, tokens } = this.state;

        const _erros = {
            partes: erros.campos.indexOf('partes'),
        }

        return (
            <Fragment>
                <Form layout="horizontal">
                    <FormItem
                        validateStatus={_erros.partes != -1 ? 'error' : ''}
                        help={erros.msgs[_erros.partes] || ''}
                        label='Partes da peça'
                        {...props}
                    >
                        <TextArea autosize id='partesTextArea' placeholder="Partes que compõem a peça separadas por quebra de linha" value={string} onChange={this.onChange} />
                    </FormItem>
                    <FormItem label='Partes identificadas' {...props}>
                        <Row>
                            {partes.map((p, idx) => {
                                return (
                                    <Col span={6} key={p.id} style={{ padding: 5, display: 'flex' }}>
                                        <Input 
                                            style={{height: 22}} 
                                            size='small' 
                                            value={p.nome} 
                                            suffix={<Icon style={{marginTop: 4, cursor: 'pointer'}} type="close" onClick={onRemoveParte(p.id)} />}
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
        const novas = tokens.map(nome => ({ id: uuidv4(), nome }));
        onChange('partes')([...partes, ...novas])
    }
}


export default Form.create()(FormPartes);
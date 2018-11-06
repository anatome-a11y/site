import React, { Component } from 'react';

import { Button } from 'antd'

import _Roteiro from '../Roteiro'
import _Mapeamento from '../Anatomp'

import { onSave as onSaveRoteiro, onValidate as onValidateRoteiro } from '../Roteiro/utils';
import { onSave as onSaveAnatomp, onValidate as onValidateMapeamento } from '../Anatomp/utils';

import { withAppContext } from '../context';

const Roteiro = withAppContext(_Roteiro)
const Mapeamento = withAppContext(_Mapeamento)

const uuidv4 = require('uuid/v4');

class Form extends Component {

    _idRoteiro = 'id temporario qualquer';

    state = {
        partesRoteiro: [],
        mapearAgora: false,
        modelMapeamento: null,
        modelRoteiro: null,
        sinalPeca: ''
    }


    render() {
        const { partesRoteiro, mapearAgora, sinalPeca } = this.state;
        const { erros } = this.props;
        return (
            <div>
                <Roteiro onAddPeca={this.onAddPeca} erros={erros} onChange={modelRoteiro => this.setState({ modelRoteiro })} onChangePartes={p => this.setState({ partesRoteiro: p })} />
                {
                    mapearAgora ? (
                        <div>
                            <Mapeamento sinalPeca={sinalPeca} roteiro={this._idRoteiro} nome={this.state.modelRoteiro.nome} erros={erros} onChange={modelMapeamento => this.setState({ modelMapeamento })} modo='assoc' partesRoteiro={partesRoteiro} />
                            <div style={{ textAlign: 'center', marginTop: 15, marginBottom: 30 }}>
                                <Button style={{ marginRight: 5 }} type='primary' ghost icon='delete' onClick={() => this.setState({ mapearAgora: false, modelMapeamento: null })} size='large'>Descartar mapeamento</Button>
                                <Button type='primary' icon='check' onClick={this.onSubmit} size='large'>Salvar roteiro mapeado</Button>
                            </div>
                        </div>
                    ) : (
                            <div style={{ textAlign: 'center', marginTop: 15, marginBottom: 30 }}>
                                <Button style={{ marginRight: 5 }} type='primary' ghost icon='check' onClick={this.onSubmitRoteiro} size='large'>Salvar roteiro digital</Button>
                                <Button type='primary' icon='environment' onClick={() => this.setState({ mapearAgora: true })} size='large'>Mapear agora</Button>
                            </div>
                        )
                }
            </div>
        )
    }

    onAddPeca = () => this.setState({sinalPeca: uuidv4()})


    onSubmitRoteiro = () => {
        onSaveRoteiro(this.props.onOpenSnackbar, this.props.onSetAppState, this.state.modelRoteiro, ret => {
            this.props.onPush('/')
        })
    }


    onSubmit = () => {
        const errosRoteiro = onValidateRoteiro(this.state.modelRoteiro);
        const errosMapeamento = onValidateMapeamento(this.state.modelMapeamento);

        const erros = {
            campos: [...errosRoteiro.campos, ...errosMapeamento.campos],
            msgs: [...errosRoteiro.msgs, ...errosMapeamento.msgs],
        };

        if (erros.campos.length > 0) {
            this.props.onOpenSnackbar('Verifique os erros de validação!')
            this.props.onSetAppState({ erros })
            return false;
        }

        onSaveRoteiro(this.props.onOpenSnackbar, this.props.onSetAppState, this.state.modelRoteiro, ret => {
            onSaveAnatomp(this.props.onOpenSnackbar, this.props.onSetAppState, { ...this.state.modelMapeamento, roteiro: ret.data._id }, ret => {
                this.props.onOpenSnackbar(`O roteiro mapeado ${this.state.modelRoteiro.nome} foi salvo com sucesso!`, 'success');
                this.props.onPush('/')
            })
        })
    }

}


export default withAppContext(Form)
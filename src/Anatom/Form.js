import React, { Component } from 'react';

import { Button } from 'antd'

import Roteiro from '../Roteiro'
import Mapeamento from '../Anatomp'

import { onSave as onSaveRoteiro, onValidate as onValidateRoteiro } from '../Roteiro/utils';
import { onSave as onSaveAnatomp, onValidate as onValidateMapeamento } from '../Anatomp/utils';

import { withAppContext } from '../context';


const { v4: uuidv4 } = require('uuid');

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
        return (
            <div>
                <Roteiro onAddPeca={this.onAddPeca} onChange={modelRoteiro => this.setState({ modelRoteiro })} onChangePartes={p => this.setState({ partesRoteiro: p })} />
                {
                    mapearAgora ? (
                        <div>
                            <Mapeamento sinalPeca={sinalPeca} roteiro={this._idRoteiro} nome={this.state.modelRoteiro.nome} onChange={modelMapeamento => this.setState({ modelMapeamento })} modo='assoc' partesRoteiro={partesRoteiro} />
                            <div style={{ textAlign: 'center', marginTop: 15, marginBottom: 30 }}>
                                <Button style={{ marginRight: 5 }} icon='rollback' onClick={() => this.props.onPush('/')} size='large'>Voltar</Button>
                                <Button style={{ marginRight: 5 }} type='primary' ghost icon='delete' onClick={() => this.setState({ mapearAgora: false, modelMapeamento: null })} size='large'>Descartar mapeamento</Button>
                                <Button type='primary' icon='check' onClick={this.onSubmit} size='large'>Salvar roteiro mapeado</Button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', marginTop: 15, marginBottom: 30 }}>
                            <Button style={{ marginRight: 5 }} icon='rollback' onClick={() => this.props.onPush('/')} size='large'>Voltar</Button>
                            <Button style={{ marginRight: 5 }} type='primary' ghost icon='check' onClick={this.onSubmitRoteiro} size='large'>Salvar conteúdo do roteiro</Button>
                            {/*<Button type='primary' icon='environment' onClick={() => this.setState({ mapearAgora: true })} size='large'>Setar localização agora</Button>*/}
                        </div>
                    )
                }
            </div>
        )
    }

    onAddPeca = () => this.setState({ sinalPeca: uuidv4() })


    onSubmitRoteiro = () => {
        onSaveRoteiro(this.props.onOpenSnackbar, this.props.onSetAppState, this.state.modelRoteiro, ret => {
            this.props.onOpenSnackbar(`O roteiro ${this.state.modelRoteiro.nome} foi salvo com sucesso!`, 'success');
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
                this.props.onOpenSnackbar(`O roteiro mapeado ${this.state.modelMapeamento.nome} foi salvo com sucesso!`, 'success');
                this.props.onPush('/')
            })
        })
    }

}


export default withAppContext(Form)
import React, { Component } from 'react';

import { Button } from 'antd'

import _Roteiro from '../Roteiro'
import _Mapeamento from '../Anatomp'

import { withAppContext } from '../context';

const Roteiro = withAppContext(_Roteiro)
const Mapeamento = withAppContext(_Mapeamento)

class Form extends Component {


    state = {
        partesRoteiro: [],
        mapearAgora: false
    }


    render() {
        const { partesRoteiro, mapearAgora } = this.state;
        return (
            <div style={{ padding: 24 }}>
                <Roteiro onChangePartes={p => this.setState({ partesRoteiro: p })} />
                {
                    mapearAgora ? (
                        <div>                            
                            <Mapeamento modo='assoc' partesRoteiro={partesRoteiro} />
                            <div style={{ textAlign: 'center', marginTop: 15, marginBottom: 30 }}>
                            <Button style={{marginRight: 5}} type='primary' ghost icon='delete' onClick={() => this.setState({mapearAgora: false})} size='large'>Descartar mapeamento</Button>
                                <Button type='primary' icon='check' onClick={() => { }} size='large'>Salvar roteiro mapeado</Button>
                            </div>
                        </div>
                    ) : (
                            <div style={{ textAlign: 'center', marginTop: 15, marginBottom: 30 }}>
                                <Button style={{marginRight: 5}} type='primary' ghost icon='check' onClick={() => { }} size='large'>Salvar roteiro digital</Button>
                                <Button type='primary' icon='environment' onClick={() => this.setState({mapearAgora: true})} size='large'>Mapear agora</Button>
                            </div>
                        )
                }
            </div>
        )
    }

}


export default withAppContext(Form)
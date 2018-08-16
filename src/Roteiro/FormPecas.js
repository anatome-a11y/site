import React, { Component, Fragment } from 'react';

import { Form, Input, List, TreeSelect } from 'antd';

import request from '../utils/request'



class FormPecas extends Component{

    state = {
        treeData: []
    }

    componentDidMount(){
        request('/api/pecas')
        .then(r => {
            this.setState({treeData: r.data.map(p => ({
                title: p.nome,
                value: p.id,
                key: p.id,
                children: p.partes.map(pp => ({
                    title: pp.nome,
                    value: pp.id,
                    key: pp.id
                }))
            }))})
        })
        .catch(e => console.error(e))
    }

    render(){
        const {onChange, partes } = this.props;
        const {treeData} = this.state;

        const tProps = {
            treeData,
            value: partes,
            onChange: onChange('partes'),
            notFoundContent: 'Nada foi encontrado',
            treeCheckable: true,
            searchPlaceholder: 'Selecione os nomes das partes deste roteiro',
            style: {
                width: '100%'
            }
          };
         
    
        return (
            <div>
                <div style={{marginTop: 40, marginBottom: 40}}>
                    <TreeSelect {...tProps} />
                </div>
            </div>
        )
    }
}




export default FormPecas;
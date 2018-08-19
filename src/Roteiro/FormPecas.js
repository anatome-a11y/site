import React, { Component, Fragment } from 'react';

import { Form, Input, List, TreeSelect } from 'antd';

import request from '../utils/request'



class FormPecas extends Component{


    render(){
        const {onChange, partes, pecas } = this.props;

        const tProps = {
            treeData: pecas,
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
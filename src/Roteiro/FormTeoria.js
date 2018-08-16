import React, { Component, Fragment } from 'react';

import { Form, Input, List, TreeSelect, Table, Tag, Card } from 'antd';
import Midia from '../components/Midia'

import request from '../utils/request'

const Search = Input.Search;

const FormItem = Form.Item;

const props = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
}

const columns = [
    {
    title: 'Informação teórica',
    dataIndex: 'singular',
  }, 
  {
    title: 'Partes',
    dataIndex: 'partesOriginais',
    render: partes => partes.map((p, idx) => <Tag>{p.nome}</Tag>)
  },
  {
      title: 'Mídias',
      dataIndex: 'midias',
      render: midias => {
            return midias.length > 0 ? midias.map((m, idx) => (
            <Midia file={m} idx={idx} midias={midias} />
          )) : 'Nenhuma'
      }
  }
];
 


class FormTeoria extends Component{

    state = {
        selected: [],
        originalContent: [],
        unselected: []
    }

    componentDidMount(){
        request('/api/pecas')
        .then(r => {
            this.setState({
                originalContent: [].concat.apply([], r.data.map(p => {
                return p.conteudoTeorico.map(ct => {
                    const partesOriginais = p.partes.filter(pt => ct.partes.indexOf(pt.id) != -1);
                    return {...ct, partesOriginais}
                })
                }))
            }, () => this.onFilterContent(this.props))
        })
        .catch(e => console.error(e))       
    }

    componentWillReceiveProps(next){
        //Se a seleção de partes mudou
        if(this.props.partes.join('_') != next.partes.join('_')){
            this.onFilterContent(next)
        }
    }


    render(){
        const { selected, unselected } = this.state;


        return (
            <div className='table-no-border'>
                <Card 
                    extra={
                        <Search
                        placeholder="Filtrar conteúdo"
                        onSearch={value => console.log(value)}
                        style={{ width: 200, marginRight: 5 }}
                    />                    
                    }
                    type='inner' title='Conteúdo selecionado' style={{marginBottom: 40, marginTop: 40}}>
                    <Table 
                        rowSelection={{onChange: this.onUnSelect, selectedRowKeys: []}} 
                        columns={columns} 
                        dataSource={selected} 
                        pagination={false}
                        size='small'
                        bordered={false}
                        locale={{emptyText: 'Nenhum conteúdo selecionado'}}
                    />
                </Card>
    
                <Card 
                    extra={
                        <Search
                        placeholder="Filtrar conteúdo"
                        onSearch={value => console.log(value)}
                        style={{ width: 200, marginRight: 5 }}
                    />                    
                    }            
                type='inner' title='Conteúdo não selecionado'>
                    <Table 
                        rowSelection={{onChange: this.onSelect, selectedRowKeys: []}} 
                        columns={columns} 
                        dataSource={unselected} 
                        pagination={false}
                        size='small'
                        locale={{emptyText: 'Nenhuma conteúdo para selecionar'}}
                    />
                </Card>                                    
            </div>
        )
    }


    onFilterContent = ({partes}) => {
        const {originalContent} = this.state;

        const conteudo = partes.map(selId => originalContent.filter(o => o.partes.indexOf(selId) != -1));
        const flat = [].concat.apply([], conteudo);
        
        this.setState({
            unselected: flat.filter((i, pos) => flat.findIndex(ii => ii.id == i.id) == pos)
        })
    }

    onSelect = (selectedRowKeys, selectedRows) => {
        const {unselected, selected} = this.state;

        const ids = selectedRows.map(s => s.id);

        this.setState({
            selected: [...unselected.filter(u => ids.indexOf(u.id) != -1) ,...selected],
            unselected: unselected.filter(u => ids.indexOf(u.id) == -1)
        })
      }

      onUnSelect = (selectedRowKeys, selectedRows) => {
        const {unselected, selected} = this.state;

        const ids = selectedRows.map(s => s.id);

        this.setState({
            unselected: [...selected.filter(u => ids.indexOf(u.id) != -1) ,...unselected],
            selected: selected.filter(u => ids.indexOf(u.id) == -1)
        })
      }      
}


export default FormTeoria;
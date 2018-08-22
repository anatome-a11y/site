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
        dataIndex: 'frases',
        render: frases => frases.map((p, idx) => <div>{p}</div>)
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



class FormTeoria extends Component {


    componentDidMount() {
        this.onFilterContent(this.props)
    }

    componentWillReceiveProps(next) {
        //Se a seleção de partes mudou
        if (this.props.partes.join('_') != next.partes.join('_')) {
            this.onFilterContent(next)
        }
    }


    render() {
        const { selected, unselected } = this.props;


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
                    type='inner' title='Conteúdo selecionado' style={{ marginBottom: 40, marginTop: 40 }}>
                    <Table
                        rowKey='_id'
                        rowSelection={{ onChange: this.onUnSelect, selectedRowKeys: [] }}
                        columns={columns}
                        dataSource={selected}
                        pagination={false}
                        size='small'
                        bordered={false}
                        locale={{ emptyText: 'Nenhum conteúdo selecionado' }}
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
                        rowKey='_id'
                        rowSelection={{ onChange: this.onSelect, selectedRowKeys: [] }}
                        columns={columns}
                        dataSource={unselected}
                        pagination={false}
                        size='small'
                        locale={{ emptyText: 'Nenhum conteúdo para selecionar' }}
                    />
                </Card>
            </div>
        )
    }

    //Diante da seleção de partes, atualiza a lista de itens selecionados e não selecionados
    onFilterContent = ({partes, conteudoExpandido, onChange, selected }) => {

        //Obtém o conteúdo das partes selecionadas
        const conteudo = partes.map(selId => conteudoExpandido.filter(o => o.partes.indexOf(selId) != -1));
        const flat = [].concat.apply([], conteudo);
        const uniqueFlat = flat.filter((i, pos) => flat.findIndex(ii => ii._id == i._id) == pos);

        const idsSel = selected.map(s => s._id)
        const _selected = uniqueFlat.filter(f => idsSel.indexOf(f._id) !== -1);
        const _unselected = uniqueFlat.filter(f => idsSel.indexOf(f._id) === -1);

        onChange({
            unselected: _unselected,
            selected: _selected
        })
    }

    onSelect = (selectedRowKeys, selectedRows) => {
        const { unselected, selected, onChange } = this.props;

        const ids = selectedRows.map(s => s._id);

        onChange({
            selected: [...unselected.filter(u => ids.indexOf(u._id) != -1), ...selected],
            unselected: unselected.filter(u => ids.indexOf(u._id) == -1)
        })
    }

    onUnSelect = (selectedRowKeys, selectedRows) => {
        const { unselected, selected, onChange } = this.props;

        const ids = selectedRows.map(s => s._id);

        onChange({
            unselected: [...selected.filter(u => ids.indexOf(u._id) != -1), ...unselected],
            selected: selected.filter(u => ids.indexOf(u._id) == -1)
        })
    }
}


export default FormTeoria;
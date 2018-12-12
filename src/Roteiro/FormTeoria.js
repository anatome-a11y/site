import React, { Component, Fragment } from 'react';

import { Form, Input, List, TreeSelect, Table, Tag, Card } from 'antd';
import Midia from '../components/Midia'
import { norm } from '../utils/data'

import request from '../utils/request'

const Search = Input.Search;

const FormItem = Form.Item;

const props = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
}

const columns = [
    {
        title: 'Conhecimento teórico',
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
        width: 150,
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
        const { selected, original, filtrado, erros } = this.props;

        const _erros = {
            conteudo: erros.campos.indexOf('conteudo'),
        }


        return (
            <Form layout="vertical">
                <div style={{ textAlign: 'right' }}>
                    <Search
                        placeholder="Filtrar conteúdo"
                        onSearch={this.onFilter('selected')}
                        style={{ width: 200, marginRight: 5 }}
                    />
                </div>
                <FormItem
                    validateStatus={_erros.conteudo != -1 ? 'error' : ''}
                    help={erros.msgs[_erros.conteudo] || ''}
                    label='Selecione os Conhecimentos Teóricos abordados no roteiro'
                >
                    <div className='table-no-border'>
                        <Table
                            style={{ marginTop: 10 }}
                            rowKey='_id'
                            rowSelection={{ onChange: this.onSelect, selectedRowKeys: selected.map(s => s._id) }}
                            columns={columns}
                            dataSource={filtrado}
                            pagination={false}
                            size='small'
                            locale={{ emptyText: 'Não há Conhecimento Teórico para ser exibido' }}
                        />
                    </div>
                </FormItem>
            </Form>
        )
    }

    onFilter = field => value => {
        const { original, onChange } = this.props;

        const filtered = original.filter(f => {
            if (f.frases.find(fr => norm(fr).indexOf(norm(value)) != -1)) {
                return true
            }

            if (f.partesOriginais.find(p => norm(p.nome).indexOf(norm(value)) != -1)) {
                return true
            }

            return false
        })

        onChange({ filtrado: filtered })
    }

    //Diante da seleção de partes, atualiza a lista de itens selecionados e não selecionados
    onFilterContent = ({ partes, conteudoExpandido, onChange, selected }) => {

        //Obtém o conteúdo das partes selecionadas
        const conteudo = partes.map(selId => conteudoExpandido.filter(o => o.partes.map(pp => pp._id).indexOf(selId) != -1));
        const flat = [].concat.apply([], conteudo);
        const uniqueFlat = flat.filter((i, pos) => flat.findIndex(ii => ii._id == i._id) == pos);

        const idsSel = selected.map(s => s._id)
        const _selected = uniqueFlat.filter(f => idsSel.indexOf(f._id) !== -1);

        onChange({
            selected: _selected,
            original: uniqueFlat,
            filtrado: uniqueFlat
        })
    }

    onSelect = (selectedRowKeys, selectedRows) => {
        this.props.onChange({
            selected: selectedRows,
        })
    }

}


export default FormTeoria;
import React, { Component } from 'react';
import { Card, Input, List, Button, Tooltip, Spin, Icon, Collapse, Table } from 'antd';
import { withAppContext } from '../context'

import { request, norm, Maybe } from '../utils/data'
import { listaIdiomas, listaRegiao, listaSistema } from '../utils/mock'

import Header from '../components/Header'

const ButtonGroup = Button.Group;
const Search = Input.Search;
const Panel = Collapse.Panel;

const colsPeca = [
    {
        title: 'Peça genérica',
        dataIndex: 'nome',
        key: 'nome',
    },
    {
        title: 'Sistema',
        dataIndex: 'sistema.name',
        key: 'sistema.name',
    },
    {
        title: 'Região',
        dataIndex: 'regiao.name',
        key: 'regiao.name',
    },
    {
        title: 'Idioma',
        dataIndex: 'idioma.name',
        key: 'idioma.name',
    },

]

const Crud = ({ onEdit, onDelete }) => {
    return (
        <ButtonGroup>
            <Tooltip title='Editar'><Button type={'primary'} ghost onClick={onEdit} icon='edit' /></Tooltip>
            <Tooltip title='Remover'><Button type={'primary'} ghost onClick={onDelete} icon='delete' /></Tooltip>
        </ButtonGroup>
    )
}

class Main extends Component {

    state = {
        pecas: [],
        originais: {
            pecas: [],
        }
    }

    componentDidMount() {
        const { onOpenSnackbar, onSetAppState } = this.props;

        request('peca')
            .then(_pecas => {
                const pecas = _pecas.data.map(d => ({
                    ...d, 
                    sistema: listaSistema.find(s => s._id == d.sistema),
                    idioma: listaIdiomas.find(s => s._id == d.idioma),
                    regiao: listaRegiao.find(s => s._id == d.regiao),
                }))

                this.setState({
                    pecas,
                    originais: {
                        pecas,
                    }
                })
            })
            .catch(e => {
                console.error(e);
                onOpenSnackbar('Falha ao obter as informações do servidor')
            })
            .finally(() => {
                onSetAppState({ loading: false })
            })
    }

    render() {
        const { loading, history } = this.props;
        const { pecas } = this.state;

        return (
            <div style={{padding: 24}}>
                <div style={{ textAlign: 'right', marginBottom: 5 }}>
                    <Button onClick={() => history.push('/')} size='small' type='primary' ghost>Voltar para roteiros</Button>
                </div>
                <Collapse bordered={false} defaultActiveKey={['pecas']} >
                    <Panel className='anatome-panel' header={
                        <Header
                            loading={loading}
                            contentQ={<p>....</p>}
                            title="Peças genéricas"
                            extra={<Button type='primary' onClick={() => history.push('/peca/cadastrar')} style={{ marginRight: 25 }}><Icon type='plus' />Cadastrar</Button>}
                        />}
                        key='pecas'>
                        <div style={{ margin: 10, textAlign: 'right' }}>
                            <Search
                                placeholder="Filtrar"
                                onSearch={this.onFilter('pecas')}
                                style={{ width: 200, marginRight: 5 }}
                            />
                        </div>
                        <Table
                            locale={{ emptyText: loading ? <Spin /> : 'Nenhuma peça genérica foi encontrada' }}
                            columns={[
                                ...colsPeca,
                                {
                                    title: '',
                                    key: 'action',
                                    width: 100,
                                    render: (text, item) => <Crud onEdit={() => history.push('/peca/editar/' + item._id)} onDelete={() => alert()} />,
                                }
                            ]}
                            pagination={{ style: { textAlign: 'center', width: '100%' } }}
                            dataSource={pecas}
                            rowKey='_id'
                        />
                    </Panel>
                </Collapse>
            </div>
        )
    }

    onFilter = attr => val => {
        const list = this.state.originais[attr];

        const _val = norm(val);

        console.log(list)

        const _list = list.filter(p => {            
            return (
                norm(p.nome).indexOf(_val) != -1 ||
                norm(p.regiao.name).indexOf(_val) != -1 ||
                norm(p.sistema.name).indexOf(_val) != -1 ||
                norm(p.idioma.name).indexOf(_val) != -1
            )
        });

        this.setState({
            [attr]: _list,
        })
    }

}

export default withAppContext(Main);
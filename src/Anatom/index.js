import React, { Component } from 'react';
import { Card, Input, List, Button, Tooltip, Spin, Icon, Modal, Table } from 'antd';
import { withAppContext } from '../context'

import { request, norm } from '../utils/data'

import Helper from '../components/Helper'

const ButtonGroup = Button.Group;
const Search = Input.Search;
const Item = List.Item;

const columns = [
    {
        title: 'Roteiro',
        dataIndex: 'nome',
        key: 'nome',
    },
    {
        title: 'Disciplina',
        dataIndex: 'roteiro.disciplina',
        key: 'roteiro.disciplina',
    },
    {
        title: 'Curso',
        dataIndex: 'roteiro.curso',
        key: 'roteiro.curso',
    },
    {
        title: 'Instituição',
        dataIndex: 'instituicao',
        key: 'instituicao',
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

const CardTitle = ({ children, loading }) => <div style={{ paddingTop: 8, fontSize: '1.2rem' }}>{children}{loading ? <Spin size="small" style={{ marginLeft: 5 }} /> : null}</div>

class Main extends Component {

    state = {
        anatomp: [],
        originais: {
            anatomp: []
        }
    }

    componentDidMount() {
        const { onOpenSnackbar, onSetAppState } = this.props;

        onSetAppState({ title: 'Roteiros de aprendizagem' })

        request('anatomp')
            .then((anatomp) => {
                this.setState({
                    anatomp: anatomp.data,
                    originais: {
                        anatomp: anatomp.data,
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
        const { anatomp } = this.state;

        return (
            <Card
                style={{ margin: 24 }}
                className='shadow1'
                title={<CardTitle loading={loading}>Roteiros de aprendizagem</CardTitle>}
                bodyStyle={{ padding: 0 }}
                extra={
                    <div style={{ display: 'flex' }}>
                        <Button type='primary' onClick={() => history.push('/roteiro/cadastrar')} style={{ marginRight: 25 }}><Icon type='plus' />Novo roteiro</Button>
                        <Helper title='Pecas' contentQ={<p>Ajuda</p>} />
                    </div>
                }
            >
                <div style={{margin: 10, textAlign: 'right'}}>
                <Search
                    placeholder="Filtrar conteúdo"
                    onSearch={this.onFilter}
                    style={{ width: 200, marginRight: 5 }}
                />
                </div>
                <Table
                    locale={{ emptyText: loading ? <Spin /> : 'Nenhuma peça foi encontrada' }}
                    columns={[
                        ...columns,
                        {
                            title: '',
                            key: 'action',
                            width: 100,
                            render: (text, item) => <Crud onEdit={() => history.push('/roteiro/editar/' + item._id)} onDelete={() => alert()} />,
                        }
                    ]}
                    pagination={{ style: { textAlign: 'center', width: '100%' } }}
                    dataSource={anatomp}
                />
            </Card>
        )
    }

    onFilter = val => {
        const { anatomp } = this.state.originais;

        const _anatomp = anatomp.filter(p => {
            const _val = norm(val);
            return (
                norm(p.nome).indexOf(_val) != -1 ||
                norm(p.instituicao).indexOf(_val) != -1 ||
                norm(p.roteiro.curso).indexOf(_val) != -1 ||
                norm(p.roteiro.disciplina).indexOf(_val) != -1
            )
        });

        this.setState({
            anatomp: _anatomp,
        })
    }
}

export default withAppContext(Main);
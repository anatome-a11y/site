import React, { Component } from 'react';
import { Input, List, Button, Tooltip, Spin, Icon, Collapse, Table, Popover } from 'antd';
import { withAppContext } from '../context'

import { request, norm } from '../utils/data'
import Header from '../components/Header'

import { listaIdiomas } from '../utils/mock'

const ButtonGroup = Button.Group;
const Search = Input.Search;
const Panel = Collapse.Panel;

const colsAnatomp = [
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

const colsRoteiro = [
    {
        title: 'Roteiro',
        dataIndex: 'nome',
        key: 'nome',
    },
    {
        title: 'Disciplina',
        dataIndex: 'disciplina',
        key: 'disciplina',
    },
    {
        title: 'Curso',
        dataIndex: 'curso',
        key: 'curso',
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

const CardTitle = ({ children, loading }) => <div className='anatome-card-title'>{children}{loading ? <Spin size="small" style={{ marginLeft: 5 }} /> : null}</div>

class Main extends Component {

    state = {
        anatomp: [],
        roteiros: [],
        originais: {
            anatomp: [],
            roteiros: []
        }
    }

    componentDidMount() {
        this.onGetData();
    }

    render() {
        const { loading, history } = this.props;
        const { anatomp, roteiros } = this.state;

        return (
            <div style={{ padding: 24 }}>
                <h2 className='section' style={{ textAlign: 'center', marginTop: 30 }}>Listas de roteiros</h2>
                <div style={{ textAlign: 'right', marginBottom: 5 }}>
                    <Popover content={
                        <div>
                            <ul>
                                <li>Listar conteúdos cadastrados;</li>
                                <li>Cadastrar conteúdo de nova peça;</li>
                                <li>Ou Editar conteúdo das peças.</li>
                            </ul>
                        </div>
                    }>
                        <Button size='small' type='primary' ghost onClick={() => history.push('/pecas')}>Ir para conteúdos das peças</Button>
                    </Popover>
                </div>
                <Collapse bordered={false} defaultActiveKey={['roteiro_digital', 'roteiro_com_peca']} >
                    <Panel className='anatome-panel' header={
                        <Header
                            loading={loading}
                            contentQ={<p>....</p>}
                            title={
                                <Popover placement='right' content={
                                    <div style={{ width: 300, textAlign: 'center' }}>Lista de p</div>
                                }>
                                    Conteúdos dos roteiros
                                </Popover>
                            }
                            extra={
                                <Popover content={
                                    <div style={{ width: 300, textAlign: 'center' }}>Cadastrar conteúdo de novo roteiro</div>
                                }>
                                    <Button type='primary' onClick={() => history.push('/roteiro/cadastrar')} style={{ marginRight: 25 }}><Icon type='plus' />Cadastrar roteiro</Button>
                                </Popover>
                            }
                        />}
                        key='roteiro_digital'>
                        <div style={{ margin: 10, textAlign: 'right' }}>
                            <Search
                                placeholder="Filtrar"
                                onSearch={this.onFilterRoteiro}
                                style={{ width: 200, marginRight: 5 }}
                            />
                        </div>
                        <Table
                            locale={{ emptyText: loading ? <Spin /> : 'Nenhum conteúdo de roteiro foi encontrado para esta busca' }}
                            columns={[
                                ...colsRoteiro,
                                {
                                    title: '',
                                    key: 'action',
                                    width: 100,
                                    render: (text, item) => <Crud onEdit={() => history.push({ pathname: '/roteiro/editar/' + item._id, state: { model: item } })} onDelete={this.onDelete('roteiro', item._id)} />,
                                }
                            ]}
                            rowKey='_id'
                            pagination={{ style: { textAlign: 'center', width: '100%' } }}
                            dataSource={roteiros}
                        />
                    </Panel>
                    <Panel className='anatome-panel' header={
                        <Header
                            loading={loading}
                            contentQ={<p>....</p>}
                            title={
                                <Popover placement='right' content={
                                    <div style={{ width: 300, textAlign: 'center' }}>Roteiros prontos para os estudantes usarem no APP Anatome</div>
                                }>
                                    Roteiros setados
                                </Popover>
                            }
                            extra={
                                <Popover content={
                                    <div style={{ width: 300, textAlign: 'center' }}>Associar o nome das partes anatômicas do roteiro à sua localização nas peças</div>
                                }>
                                    <Button type='primary' onClick={() => history.push('/mapeamento/cadastrar')} style={{ marginRight: 25 }}><Icon type='plus' />Setar localização</Button>
                                </Popover>
                            }
                        />}
                        key='roteiro_com_peca'>
                        <div style={{ margin: 10, textAlign: 'right' }}>
                            <Search
                                placeholder="Filtrar"
                                onSearch={this.onFilterAnatomp}
                                style={{ width: 200, marginRight: 5 }}
                            />
                        </div>
                        <Table
                            locale={{ emptyText: loading ? <Spin /> : 'Nenhum roteiro de peça física foi encontrado' }}
                            columns={[
                                ...colsAnatomp,
                                {
                                    title: '',
                                    key: 'action',
                                    width: 100,
                                    render: (text, item) => <Crud onEdit={() => history.push({ pathname: '/mapeamento/editar/' + item._id, state: { model: item } })} onDelete={this.onDelete('anatomp', item._id)} />,
                                }
                            ]}
                            rowKey='_id'
                            pagination={{ style: { textAlign: 'center', width: '100%' } }}
                            dataSource={anatomp}
                        />
                    </Panel>
                </Collapse>
            </div>
        )
    }

    onGetData = () => {
        const { onOpenSnackbar, onSetAppState } = this.props;

        Promise.all([request('anatomp'), request('roteiro')])
            .then(([anatomp, roteiros]) => {

                const rots = roteiros.data.map(d => ({
                    ...d,
                    idioma: listaIdiomas.find(s => s._id == d.idioma),
                }));
                this.setState({
                    anatomp: anatomp.data,
                    roteiros: rots,
                    originais: {
                        anatomp: anatomp.data,
                        roteiros: rots,
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


    onDelete = (model, id) => () => {
        this.props.onSetAppState({ loading: true })
        this.props.onOpenSnackbar('Aguarde...', 'loading');

        const nome = model == 'roteiro' ? 'Conteúdo do roteiro' : 'Roteiro setado';

        request(model + '/' + id, { method: 'DELETE' })
            .then(ret => {
                if (ret.status == 200) {
                    this.props.onOpenSnackbar(nome + ' excluído com sucesso!', 'success');
                    this.onGetData();
                } else {
                    throw ret.error
                }
            })
            .catch(e => {
                const msg = typeof e == 'string' ? e : 'Não foi possível excluir o ' + nome.toLowerCase() + ' selecionado';
                this.props.onOpenSnackbar(msg);
            })
            .finally(() => this.props.onSetAppState({ loading: false }))
    }


    onFilterAnatomp = val => {
        const list = this.state.originais.anatomp;

        const _val = norm(val);

        const _list = list.filter(p => {
            return (
                norm(p.nome).indexOf(_val) != -1 ||
                norm(p.instituicao).indexOf(_val) != -1 ||
                norm(p.roteiro.curso).indexOf(_val) != -1 ||
                norm(p.roteiro.disciplina).indexOf(_val) != -1
            )
        });

        this.setState({ anatomp: _list })
    }

    onFilterRoteiro = val => {
        const list = this.state.originais.roteiros;

        const _val = norm(val);

        const _list = list.filter(p => {
            return (
                norm(p.nome).indexOf(_val) != -1 ||
                norm(p.curso).indexOf(_val) != -1 ||
                norm(p.disciplina).indexOf(_val) != -1
            )
        });

        this.setState({ roteiros: _list })
    }

}

export default withAppContext(Main);
import React, { Component } from 'react';
import { Input, Modal, Button, Tooltip, Spin, Icon, Collapse, Table, Popover } from 'antd';
import { withAppContext } from '../context'

import { request, norm } from '../utils/data'
import Header from '../components/Header'

import { listaIdiomas } from '../utils/mock'

import { getAvaliacao } from "../TelaCorrecao/avaliacao/service";

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

const colsAvaliacoes = [
    {
        title: 'Avaliação',
        dataIndex: 'conteudo',
        key: 'conteudo',
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
        title: 'Instituição',
        dataIndex: 'instituicao',
        key: 'instituicao',
    }
]

const colsAvaliacoesAplicadas = [
    {
        title: 'Avaliação',
        dataIndex: 'conteudo',
        key: 'conteudo',
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
        title: 'Instituição',
        dataIndex: 'instituicao',
        key: 'instituicao',
    },
    {
        title: 'Aluno',
        dataIndex: 'nomeAluno',
        key: 'nomeAluno',
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

const CardTitle = ({ children, loading }) =>
    <div className='anatome-card-title'>{children}{loading ?
        <Spin size="small" style={{ marginLeft: 5 }} /> : null}</div>

class Main extends Component {

    state = {
        anatomp: [],
        roteiros: [],
        open: false,
        toDelete: null,
        resourceToDelete: '',
        originais: {
            anatomp: [],
            roteiros: [],
            avaliacoesAplicadas: [],
            avaliacoes: []
        }
    }

    componentDidMount() {
        this.onGetData();
    }

    render() {
        const { loading, history } = this.props;
        const { anatomp, roteiros, open, resourceToDelete } = this.state;

        let dadosAval = [];
        dadosAval.push(getAvaliacao(0));
        dadosAval.push(getAvaliacao(1));

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
                        <Button size='small' type='primary' ghost onClick={() => history.push('/pecas')}>Ir para
                            conteúdos das peças</Button>
                    </Popover>
                </div>
                <Collapse bordered={false} defaultActiveKey={['avaliacao_aplicada', 'avaliacao', 'roteiro_digital', 'roteiro_com_peca']}>
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
                                    <div style={{ width: 300, textAlign: 'center' }}>Cadastrar conteúdo de novo
                                        roteiro</div>
                                }>
                                    <Button type='primary' onClick={() => history.push('/roteiro/cadastrar')}
                                        style={{ marginRight: 25 }}><Icon type='plus' />Cadastrar roteiro</Button>
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
                            locale={{
                                emptyText: loading ?
                                    <Spin /> : <span style={{ color: '#000000A6' }}>Nenhum conteúdo de roteiro foi encontrado para esta busca</span>
                            }}
                            columns={[
                                ...colsRoteiro,
                                {
                                    title: '',
                                    key: 'action',
                                    width: 100,
                                    render: (text, item) => <Crud onEdit={() => history.push({
                                        pathname: '/roteiro/editar/' + item._id,
                                        state: { model: item }
                                    })} onDelete={this.onShowDelete('roteiro', item)} />,
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
                                    <div style={{ width: 300, textAlign: 'center' }}>Roteiros prontos para os estudantes
                                        usarem no APP Anatome</div>
                                }>
                                    Roteiros setados
                                </Popover>
                            }
                            extra={
                                <Popover content={
                                    <div style={{ width: 300, textAlign: 'center' }}>Associar o nome das partes anatômicas
                                        do roteiro à sua localização nas peças</div>
                                }>
                                    <Button type='primary' onClick={() => history.push('/mapeamento/cadastrar')}
                                        style={{ marginRight: 25 }}><Icon type='plus' />Setar localização</Button>
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
                            locale={{
                                emptyText: loading ?
                                    <Spin /> : <span style={{ color: '#000000A6' }}>Nenhum roteiro de peça física foi encontrado</span>
                            }}
                            columns={[
                                ...colsAnatomp,
                                {
                                    title: '',
                                    key: 'action',
                                    width: 100,
                                    render: (text, item) => <Crud onEdit={() => history.push({
                                        pathname: '/mapeamento/editar/' + item._id,
                                        state: { model: item }
                                    })} onDelete={this.onShowDelete('anatomp', item)} />,
                                }
                            ]}
                            rowKey='_id'
                            pagination={{ style: { textAlign: 'center', width: '100%' } }}
                            dataSource={anatomp}
                        />
                    </Panel>
                    <Panel className='anatome-panel' header={
                        <Header
                            loading={loading}
                            contentQ={<p>....</p>}
                            title={
                                <Popover placement='right' content={
                                    <div style={{ width: 300, textAlign: 'center' }}>
                                        Avaliações a serem submetidas
                                    </div>
                                }>
                                    Avaliação
                                </Popover>
                            }
                            extra={
                                <Popover content={
                                    <div style={{ width: 300, textAlign: 'center' }}>
                                        Cadastrar uma nova avaliação
                                    </div>
                                }>
                                    <Button type='primary'
                                        onClick={() => { }}
                                        style={{ marginRight: 25 }}>
                                        <Icon type='plus' />Cadastrar avaliação
                                    </Button>
                                </Popover>
                            }
                        />}
                        key='avaliacao'>
                        <div style={{ margin: 10, textAlign: 'right' }}>
                            <Search
                                placeholder="Filtrar"
                                onSearch={this.onFilterAvaliacao}
                                style={{ width: 200, marginRight: 5 }}
                            />
                        </div>
                        <Table
                            locale={{
                                emptyText: loading ?
                                    <Spin /> : <span style={{ color: '#000000A6' }}>Nenhuma avaliação foi encontrada</span>
                            }}
                            columns={[
                                ...colsAvaliacoes,
                                {
                                    title: '',
                                    key: 'action',
                                    width: 100,
                                    render: (text, item) =>
                                        <Crud onEdit={() =>
                                            history.push({
                                                pathname: '/',
                                                state: { model: item }
                                            })}
                                            onDelete={() => { }}
                                        />,
                                }
                            ]}
                            rowKey='id'
                            pagination={{ style: { textAlign: 'center', width: '100%' } }}
                            dataSource={dadosAval}
                        />
                    </Panel>
                    <Panel className='anatome-panel' header={
                        <Header
                            loading={loading}
                            contentQ={<p>....</p>}
                            title={
                                <Popover placement='right' content={
                                    <div style={{ width: 300, textAlign: 'center' }}>
                                        Avaliações submetidas pelos aluno para serem corrigidas
                                    </div>
                                }>
                                    Avaliações aplicadas
                                </Popover>
                            }
                            extra={
                                <Popover content={
                                    <div style={{ width: 300, textAlign: 'center' }}>
                                        Cadastrar uma nova avaliação aplicada do estudante
                                    </div>
                                }>
                                    <Button type='primary'
                                        onClick={() => { }}
                                        style={{ marginRight: 25 }}>
                                        <Icon type='plus' />Corrigir avaliação
                                    </Button>
                                </Popover>
                            }
                        />}
                        key='avaliacao_aplicada'>
                        <div style={{ margin: 10, textAlign: 'right' }}>
                            <Search
                                placeholder="Filtrar"
                                onSearch={this.onFilterAvaliacaoAplicada}
                                style={{ width: 200, marginRight: 5 }}
                            />
                        </div>
                        <Table
                            locale={{
                                emptyText: loading ?
                                    <Spin /> : <span style={{ color: '#000000A6' }}>Nenhuma avaliação aplicada foi encontrada</span>
                            }}
                            columns={[
                                ...colsAvaliacoesAplicadas,
                                {
                                    title: '',
                                    key: 'action',
                                    width: 100,
                                    render: (text, item) =>
                                        <Crud onEdit={() =>
                                            history.push({
                                                pathname: '/correcao/' + item.id,
                                                state: { model: item }
                                            })}
                                            onDelete={this.onShowDelete('anatomp', item)}
                                        />,
                                }
                            ]}
                            rowKey='id'
                            pagination={{ style: { textAlign: 'center', width: '100%' } }}
                            dataSource={dadosAval}
                        />
                    </Panel>
                </Collapse>
                <Modal
                    title={`Excluir ${resourceToDelete == 'anatomp' ? 'roteiro setado' : 'conteúdo do roteiro'}`}
                    visible={open}
                    okText='Excluir'
                    onOk={this.onDelete}
                    cancelText='Cancelar'
                    onCancel={this.onClose}
                    okButtonProps={{ loading }}
                    cancelButtonProps={{ loading }}
                >
                    {this.onGetBody()}
                </Modal>
            </div>
        )
    }

    onGetBody = () => {
        const { toDelete, resourceToDelete } = this.state;
        if (toDelete !== null) {
            return <div>Deseja realmente excluir
                o {resourceToDelete == 'anatomp' ? 'roteiro setado' : 'conteúdo do roteiro'} <span
                    style={{ fontWeight: 'bold' }}>{toDelete.nome}</span>?</div>
        } else {
            return null;
        }
    }

    onShowDelete = (resourceToDelete, toDelete) => () => {
        this.setState({ open: true, toDelete, resourceToDelete })
    }

    onClose = () => this.setState({ open: false }, () => {
        this.setState({ toDelete: null, resourceToDelete: '' })
    })


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


    onDelete = () => {
        this.props.onSetAppState({ loading: true })
        this.props.onOpenSnackbar('Aguarde...', 'loading');

        const model = this.state.resourceToDelete;
        const id = this.state.toDelete._id;

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
            .finally(() => {
                this.onClose()
                this.props.onSetAppState({ loading: false })
            })
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

    onFilterAvaliacaoAplicada = val => {
        const list = this.state.originais.avaliacoesAplicadas;

        const _val = norm(val);

        const _list = list.filter(p => {
            return (
                norm(p.nome).indexOf(_val) !== -1 ||
                norm(p.disciplina).indexOf(_val) !== -1 ||
                norm(p.curso).indexOf(_val) !== -1 ||
                norm(p.instituicao).indexOf(_val) !== -1
            )
        });

        this.setState({ roteiros: _list })
    }

    onFilterAvaliacao = val => {
        const list = this.state.originais.avaliacoes;

        const _val = norm(val);

        const _list = list.filter(p => {
            return (
                norm(p.conteudo).indexOf(_val) !== -1 ||
                norm(p.disciplina).indexOf(_val) !== -1 ||
                norm(p.curso).indexOf(_val) !== -1 ||
                norm(p.instituicao).indexOf(_val) !== -1
            )
        });
        this.setState({ roteiros: _list })
    }
}

export default withAppContext(Main);

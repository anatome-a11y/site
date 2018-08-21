import React, { Component, Fragment } from 'react';
import { Card, Input, List, Button, Tooltip, Spin, Icon, Modal } from 'antd';
import { request } from './utils/data'

import Helper from './components/Helper'

const ButtonGroup = Button.Group;
const Search = Input.Search;
const Item = List.Item;


const Crud = ({ onEdit, onDelete }) => {
    return (
        <ButtonGroup>
            <Tooltip title='Editar'><Button onClick={onEdit} icon='edit' /></Tooltip>
            <Tooltip title='Remover'><Button onClick={onDelete} icon='delete' /></Tooltip>
        </ButtonGroup>
    )
}

const CardTitle = ({ children, loading }) => <div style={{ paddingTop: 8 }}>{children}{loading ? <Spin size="small" style={{ marginLeft: 5 }} /> : null}</div>


const _Title = (
    <p style={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.59)', marginBottom: 20, fontWeight: 500, textAlign: 'center' }}>
        Crie Peças Anatômicas Interativas para os alunos treinarem a identificação anatômica.
    </p>
)

const _names = { peca: 'conteúdo digital da peça', roteiro: 'roteiro', anatomp: 'An@tom-P' }
const _gender = { peca: 'o', roteiro: 'o', anatomp: 'a' }


class Inicio extends Component {

    state = {
        visible: false,
        loading: false,
        peca: [],
        roteiro: [],
        anatomp: [],
    }

    componentDidMount() {
        const { onOpenSnackbar } = this.props;

        this.setState({ loading: true })

        Promise.all([
            request('peca'),
            request('roteiro'),
            request('anatomp'),
        ])
            .then(([peca, roteiro, anatomp]) => {
                this.setState({
                    peca: peca.data,
                    roteiro: roteiro.data,
                    anatomp: anatomp.data,
                })
            })
            .catch(e => {
                console.error(e);
                onOpenSnackbar('Falha ao obter as informações do servidor')
            })
            .finally(() => {
                this.setState({ loading: false })
            })
    }

    componentWillReceiveProps(next) {
        const { onChangeMenu, clicked } = this.props;

        //Se o modo ou id mudou...
        if (clicked.mode != next.clicked.mode || clicked.item._id != next.clicked.item._id) {
            if (next.clicked.mode == 'delete') {
                this.setState({ open: true })
            } else {
                if (next.clicked.mode == 'edit') {
                    onChangeMenu({ key: next.clicked.res })
                }
            }
        }
    }

    render() {
        const { peca, roteiro, anatomp, loading, open } = this.state;
        const { onChangeMenu, onSetClicked } = this.props;

        return (
            <Fragment>
                <Card title={<CardTitle>Bem vindo ao An@tom-AT</CardTitle>} extra={
                    <div style={{ display: 'flex' }}>
                        <Search
                            placeholder="Filtrar conteúdo"
                            onSearch={value => console.log(value)}
                            style={{ width: 200, marginRight: 5 }}
                        />
                        <Helper title='Tour' contentQ={<p>Ajuda</p>} />
                    </div>
                }>
                    {_Title}
                    <Card
                        type="inner"
                        title={<CardTitle loading={loading === 'peca'}>1 - Conteúdo digital da peça</CardTitle>}
                        bodyStyle={{ padding: 0 }}
                        extra={
                            <div style={{ display: 'flex' }}>
                                <Button onClick={() => onChangeMenu({ key: 'peca' })} style={{ marginRight: 25 }}><Icon type='plus' />Criar peça</Button>
                                <Helper title='Pecas' contentQ={<p>Ajuda</p>} />
                            </div>
                        }
                    >
                        <List
                            size="small"
                            locale={{ emptyText: loading === true ? <Spin /> : 'Nenhuma peça foi encontrada' }}
                            dataSource={peca}
                            renderItem={item => (<Item actions={[<Crud onEdit={onSetClicked('peca', 'edit', item)} onDelete={onSetClicked('peca', 'delete', item)} />]} style={{ paddingLeft: 24 }}>{item.nome}</Item>)}
                        />
                    </Card>
                    <Card
                        style={{ marginTop: 16 }}
                        bodyStyle={{ padding: 0 }}
                        type="inner"
                        title={<CardTitle loading={loading === 'roteiro'}>2 - Roteiros de aprendizagem</CardTitle>}
                        extra={
                            <div style={{ display: 'flex' }}>
                                <Button onClick={() => onChangeMenu({ key: 'roteiro' })} style={{ marginRight: 25 }}><Icon type='plus' />Criar roteiro</Button>
                                <Helper title='Roteiro' contentQ={<p>Ajuda</p>} />
                            </div>
                        }
                    >
                        <List
                            size="small"
                            locale={{ emptyText: loading === true ? <Spin /> : 'Nenhum roteiro foi encontrado' }}
                            dataSource={roteiro}
                            renderItem={item => (<Item actions={[<Crud onEdit={onSetClicked('roteiro', 'edit', item)} onDelete={onSetClicked('roteiro', 'delete', item)} />]} style={{ paddingLeft: 24 }}>{item.nome}</Item>)}
                        />
                    </Card>
                    <Card
                        style={{ marginTop: 16 }}
                        bodyStyle={{ padding: 0 }}
                        type="inner"
                        title={<CardTitle loading={loading === 'anatomp'}>3 - An@tom-P (Peças anatômicas interativas)</CardTitle>}
                        extra={
                            <div style={{ display: 'flex' }}>
                                <Button onClick={() => onChangeMenu({ key: 'anatomp' })} style={{ marginRight: 25 }}><Icon type='plus' />Criar An@tom-P</Button>
                                <Helper title='Tour' contentQ={<p>An@tom-P</p>} />
                            </div>
                        }
                    >
                        <List
                            size="small"
                            locale={{ emptyText: loading === true ? <Spin /> : 'Nenhuma An@tom-P foi encontrada' }}
                            dataSource={anatomp}
                            renderItem={item => (<Item actions={[<Crud onEdit={onSetClicked('anatomp', 'edit', item)} onDelete={onSetClicked('anatomp', 'delete', item)} />]} style={{ paddingLeft: 24 }}>{item}</Item>)}
                        />
                    </Card>
                </Card>
                <Modal
                    title={this.getTitle()}
                    visible={open}
                    okText='Excluir'
                    onOk={this.onDelete}
                    cancelText='Cancelar'
                    onCancel={this.onClose}
                    okButtonProps={{loading}}
                    cancelButtonProps={{loading}}
                >
                    {this.getBody()}
                </Modal>
            </Fragment>
        )
    }

    onDelete = () => {
        const { clicked, onOpenSnackbar } = this.props;
        if (clicked.res !== '') {
            this.setState({ loading: clicked.res })
            request(clicked.res + '/' + clicked.item._id, { method: 'DELETE' })
                .then(res => {
                    if (res.status == 200) {
                        return request(clicked.res)                         
                    } else {
                        throw res.error
                    }
                })
                .then(res => {
                    this.setState({ open: false, [clicked.res]: res.data })
                    onOpenSnackbar(`${_gender[clicked.res].toUpperCase()} ${_names[clicked.res]} foi excluíd${_gender[clicked.res]} com sucesso!`, 'success')
                })               
                .catch(e => {
                    console.log(e)
                    const msg = typeof e === 'string' ? e : `Não foi possível excluir ${_gender[clicked.res]} ${_names[clicked.res]}`
                    onOpenSnackbar(msg)
                })
                .finally(() => {
                    this.setState({ loading: false })
                })
        }
    }

    onClose = () => this.setState({ open: false })

    getTitle = () => {
        const { loading } = this.state;
        const { clicked } = this.props;
        if (clicked.res == '') {
            return ''
        } else {
            return <span>{`Exclusão de ${_names[clicked.res]}`}{loading ? <Spin size='small' style={{marginLeft: 5}} /> : null}</span>;
        }
    }

    getBody = () => {
        const { clicked } = this.props;

        if (clicked.res == '') {
            return ''
        } else {
            return (
                <div>{`Deseja realmente excluir ${_gender[clicked.res]} ${_names[clicked.res]} `}<span style={{ fontWeight: 'bold' }}>{clicked.item.nome}</span>?</div>
            );
        }
    }
}


export default Inicio
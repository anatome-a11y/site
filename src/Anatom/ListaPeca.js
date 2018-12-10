import React, { Component } from 'react';
import { Card, Input, Modal, Button, Tooltip, Spin, Icon, Collapse, Table } from 'antd';
import { withAppContext } from '../context'

import { request, norm, Maybe } from '../utils/data'
import {  listaRegiao, listaSistema } from '../utils/mock'

import Header from '../components/Header'

const ButtonGroup = Button.Group;
const Search = Input.Search;
const Panel = Collapse.Panel;

const colsPeca = [
    {
        title: 'Peça',
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
        toDelete: null,
        open: false,
        pecas: [],
        originais: {
            pecas: [],
        }
    }

    componentDidMount() {
        this.onGetData();
    }

    render() {
        const { loading, history } = this.props;
        const { pecas, open } = this.state;

        return (
            <div style={{padding: 24}}>
                <h2 className='section' style={{ textAlign: 'center', marginTop: 30 }}>Lista de conteúdos das peças</h2>
                <div style={{ textAlign: 'right', marginBottom: 5 }}>
                    <Button onClick={() => history.push('/')} size='small' type='primary' ghost>Voltar para página inicial</Button>
                </div>
                <Collapse bordered={false} defaultActiveKey={['pecas']} >
                    <Panel className='anatome-panel' header={
                        <Header
                            loading={loading}
                            contentQ={<p>....</p>}
                            title="Conteúdos das peças"
                            extra={<Button type='primary' onClick={() => history.push('/peca/cadastrar')} style={{ marginRight: 25 }}><Icon type='plus' />Cadastrar peça</Button>}
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
                            locale={{ emptyText: loading ? <Spin /> : 'Nenhum conteúdo da peça foi encontrado' }}
                            columns={[
                                ...colsPeca,
                                {
                                    title: '',
                                    key: 'action',
                                    width: 100,
                                    render: (text, item) => <Crud onEdit={() => history.push({pathname: '/peca/editar/' + item._id, state: {model: item}})} onDelete={this.onShowDelete(item)} />,
                                }
                            ]}
                            pagination={{ style: { textAlign: 'center', width: '100%' } }}
                            dataSource={pecas}
                            rowKey='_id'
                        />
                    </Panel>
                </Collapse>
                <Modal
                    title={'Excluir conteúdo da peça'}
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
        const {toDelete} = this.state;
        if(toDelete !== null){
            return <div>Deseja realmente excluir o conteúdo da peça <span style={{fontWeight: 'bold'}}>{toDelete.nome}</span>?</div>
        }else{
            return null;
        }
    }

    onShowDelete = toDelete => () => {
        this.setState({ open: true, toDelete })
    }

    onClose = () => this.setState({ open: false, toDelete: null })

    onFilter = attr => val => {
        const list = this.state.originais[attr];

        const _val = norm(val);

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


    onGetData = () => {
        const { onOpenSnackbar, onSetAppState } = this.props;

        request('peca')
            .then(_pecas => {
                const pecas = _pecas.data.map(d => ({
                    ...d, 
                    sistema: listaSistema.find(s => s._id == d.sistema),
                    regiao: listaRegiao.find(s => s._id == d.regiao),
                }));

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

    onDelete = () => {
        this.props.onSetAppState({loading: true})
        this.props.onOpenSnackbar('Aguarde...', 'loading');

        const id = this.state.toDelete._id;

        request('peca/'+id, {method: 'DELETE'})
        .then(ret => {
            if(ret.status == 200){
                this.props.onOpenSnackbar('Peça excluída com sucesso!', 'success');
                this.onGetData();
            }else{
                throw ret.error
            }
        })
        .catch(e => {
            const msg = typeof e == 'string' ? e : 'Não foi possível excluir a peça selecionada';          
            this.props.onOpenSnackbar(msg);
        })
        .finally(() => {
            this.onClose()
            this.props.onSetAppState({loading: false})
        })
    }    

}

export default withAppContext(Main);
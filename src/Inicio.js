import React, { Component, Fragment } from 'react';
import { Card, Modal, Input, List, Button, Tooltip, Popover, Icon } from 'antd';
import request from './utils/request'

const ButtonGroup = Button.Group;
const Search = Input.Search;


const Crud = ({ onEdit, onDelete }) => {
    return (
        <ButtonGroup>
            <Tooltip title='Editar'><Button onClick={onEdit} icon='edit' /></Tooltip>
            <Tooltip title='Remover'><Button onClick={onDelete} icon='delete' /></Tooltip>
        </ButtonGroup>
    )
}



const Action = ({ icon, children, title, content, placement='top' }) => (
    <Popover placement={placement} content={content} title={title}>
        {children != undefined ? <Button shape="circle" style={{ marginRight: 3, fontSize: 12 }}>{children}</Button> : <Button shape="circle" style={{ marginRight: 3 }} icon={icon} />}
    </Popover>
)



class Inicio extends Component {

    state = {
        visible: false,
        pecas: []
    }

	componentDidMount(){
        const {onOpenSnackbar, onRequest} = this.props;

        onRequest(request('/api/pecas'))
            .then(ret => {
                this.setState({pecas: ret.data})
            })
            .catch(e => {
                onOpenSnackbar('Não foi possível salvar a peça')
                console.error(e)
            })
            .finally(() => {
                this.setState({loading: false})
            })		
	}    

    render() {
        const { view, pecas } = this.state;
        const { onChangeMenu } = this.props;

        return (
            <Fragment>
                <Card title="Bem vindo ao An@tom-AT" extra={
                    <Fragment>
                        <Search
                            placeholder="Filtrar conteúdo"
                            onSearch={value => console.log(value)}
                            style={{ width: 200, marginRight: 5 }}
                        />
                        <Action
                            placement='left'
                            icon='info'
                            title='Passos para criar Peças Anatômicas Interativas'
                            content={
                                <div>
                                    <p>1. Adicione o conteúdo digital das peças genéricas.</p>
                                    <p>2. Monte roteiros de aprendizagem selecionando os conteúdos das peças genéricas abordados em uma disciplina.</p>
                                    <p>3. Mapeie o nome das partes anatômicas do roteiro à sua localização na peça.</p>
                                </div>
                            }
                        />
                    </Fragment>
                }>
                    <p
                        style={{
                            fontSize: 14,
                            color: 'rgba(0, 0, 0, 0.59)',
                            marginBottom: 20,
                            fontWeight: 500,
                            textAlign: 'center'
                        }}
                    >
                        Crie Peças Anatômicas Interativas para os alunos treinarem a identificação anatômica.
                    </p>

                    <Card
                        type="inner"
                        title="1 - Peças genéricas"
                        bodyStyle={{ padding: 0 }}
                        extra={
                            <Fragment>
                                <Button onClick={() => onChangeMenu({key: 'peca'})} style={{marginRight: 25}}><Icon type='plus' />Criar peça</Button>
                                <Action
                                    icon='question'
                                    title='Sobre as peças genéricas'
                                    content={
                                        <div>
                                            <p>Conteúdos trabalhados em várias disciplinas</p>
                                        </div>
                                    }
                                />
                                <Action title title='Exemplo 1' content='...'>e1</Action>
                                <Action title='Exemplo 2' content='...'>e2</Action>
                            </Fragment>
                        }
                    >
                        <List
                            size="small"
                            locale={{emptyText: 'Nenhuma peça foi encontrada'}}
                            dataSource={pecas}
                            renderItem={item => (<List.Item actions={[<Crud onEdit={() => { }} onDelete={() => { }} />]} style={{ paddingLeft: 24 }}>{item.nome}</List.Item>)}
                        />
                    </Card>
                    <Card
                        style={{ marginTop: 16 }}
                        bodyStyle={{ padding: 0 }}
                        type="inner"
                        title="2 - Roteiros de aprendizagem"
                        extra={
                            <Fragment>
                                 <Button onClick={() => onChangeMenu({key: 'roteiro'})} style={{marginRight: 25}}><Icon type='plus' />Criar roteiro</Button>
                                <Action 
                                icon='question' 
                                title='Sobre os roteiros de aprendizagem'
                                content={
                                    <div>
                                        <p>Seleção dos conteúdos das peças genéricas que são trabalhados em uma disciplina </p>
                                    </div>
                                }                                 
                                />
                                <Action title='Exemplo 1' content='...'>e1</Action>
                                <Action title='Exemplo 2' content='...'>e2</Action>
                            </Fragment>
                        }
                    >
                        <List
                            size="small"
                            locale={{emptyText: 'Nenhum roteiro foi encontrado'}}
                            dataSource={['Roteiro 1', 'Roteiro 2', 'Roteiro 3']}
                            renderItem={item => (<List.Item actions={[<Crud onEdit={() => { }} onDelete={() => { }} />]} style={{ paddingLeft: 24 }}>{item}</List.Item>)}
                        />
                    </Card>
                    <Card
                        style={{ marginTop: 16 }}
                        bodyStyle={{ padding: 0 }}
                        type="inner"
                        title="3 - An@tom-P (Peças anatômicas interativas)"
                        extra={
                            <Fragment>
                                 <Button disabled onClick={() => onChangeMenu({key: 'mapeamento'})} style={{marginRight: 25}}><Icon type='plus' />Criar An@tom-P</Button>
                                <Action 
                                    icon='question' 
                                    title='Sobre as peças anatômicas interativas' 
                                    content={
                                        <div>
                                            <p>Roteiro com Peças Anatômicas Interativa (com localização já mapeada nas peças)</p>
                                        </div>
                                    }
                                />
                                <Action title='Exemplo 1' content='...'>e1</Action>
                                <Action title='Exemplo 2' content='...'>e2</Action>
                            </Fragment>
                        }
                    >
                        <List
                            size="small"
                            locale={{emptyText: 'Nenhuma An@tom-P foi encontrada'}}
                            dataSource={['An@tom-P 1', 'An@tom-P 2', 'An@tom-P 3']}
                            renderItem={item => (<List.Item actions={[<Crud onEdit={() => { }} onDelete={() => { }} />]} style={{ paddingLeft: 24 }}>{item}</List.Item>)}
                        />
                    </Card>
                </Card>
            </Fragment>
        )
    }
}


export default Inicio
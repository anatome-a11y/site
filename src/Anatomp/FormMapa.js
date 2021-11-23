import { Button, Card, Checkbox, Col, Form, Icon, InputNumber, List, Modal, Row, Select, Tooltip } from 'antd';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ImageMappedPoints from '../components/ImageMappedPoints';
import Label from '../components/Label';
import { filter } from '../utils/data';
import FormLocalizacao from './FormLocalizacao';


const { v4: uuidv4 } = require('uuid');
const { Option } = Select;

const { Item } = List;
const FormItem = Form.Item;
class FormMapa extends Component {

    state = {
        loading: false,
        open: false,
        erroLocalizacao: null,
        toEditRefRel: {
            model: {},
            idx: '',
            idxLoc: '',
            item: null
        },
        tipoPecaMapeamento: "pecaDigital",
        offsetTop: 0,
        partesFormLocalizacao: []
    }

    showModal = (pecaFisicaDigital, idxPecaFisica, mapa) => {
        var rect = ReactDOM.findDOMNode(this).getBoundingClientRect();

        var idsPecasFisicas = this.props.pecasFisicas.filter(p => p.pecaGenerica == pecaFisicaDigital.pecaGenerica).map(function (item) {
            return item._id;
        });


        this.setState({
            visible: true,
            offsetTop: rect.offsetTop,
            pecaFisicaDigital: pecaFisicaDigital,
            idsPecasFisicas: idsPecasFisicas,
            pecaFisicaDigitalBkp: JSON.parse(JSON.stringify(pecaFisicaDigital)),
            idxPecaFisicaDigital: idxPecaFisica,
            mapaBkp: mapa
        });
    };

    hideModalOk = () => {
        this.setState({
            visible: false,
        });
    };

    render() {
        const { loading, open, toEditRefRel, erroLocalizacao, partesFormLocalizacao } = this.state;
        const { onChangeMapa, onChangeMapaCompleto, mapa, pecasFisicas, onAddPecaFisica, onRemovePecaFisica, erros, tipoPecaMapeamento, onChangePecaFisica, onOpenSnackbar } = this.props;

        const _erros = {
            mapa: erros.campos.indexOf('mapa'),
        }

        for (let idx = 0; idx < mapa.length; idx++) {
            mapa[idx].pontos = [];
        }

        const hideModalCancel = () => {
            this.setState({
                visible: false,
            });

            onChangePecaFisica('midias', this.state.idxPecaFisicaDigital)(this.state.pecaFisicaDigitalBkp.midias)
        };

        if (toEditRefRel.item) {
            const mapaFiltrado = mapa.filter(m => m.localizacao[0].pecaFisica == toEditRefRel.item.localizacao[0].pecaFisica);
            this.state.partesFormLocalizacao = mapaFiltrado.map(i => i.parte).filter(p => p._id != toEditRefRel.item.parte._id);
        }

        return (
            <Form style={{ margin: 20 }}>
                <FormItem
                    validateStatus={_erros.mapa != -1 ? 'error' : ''}
                    help={erros.msgs[_erros.mapa] || ''}
                >
                    <div hidden={tipoPecaMapeamento != 'pecaDigital'}>
                        <Label>Selecione imagens digitais depois clique na imagem para associar o nome a cada parte anatômica</Label>

                        <List
                            grid={{ gutter: 16, column: 4 }}
                            dataSource={pecasFisicas}
                            renderItem={(item, idxPecaFisica) => (
                                <List.Item>
                                    <Card title={<div style={{ fontWeight: 'bold' }}>{item.nome}</div>}
                                        bodyStyle={{ padding: 10, height: 320 }}
                                    >
                                        <Row style={{ height: 250, overflowY: 'auto' }}>
                                            {item.midias.map((t, idxMidia) =>
                                                <Col span={12}>
                                                    <img key={t._id}
                                                        style={{
                                                            maxWidth: '100%',
                                                            display: 'block',
                                                            marginLeft: 'auto',
                                                            marginRight: 'auto',
                                                            padding: 10,
                                                        }}
                                                        src={item.midias[idxMidia].url}
                                                    />
                                                </Col>
                                            )}
                                        </Row>
                                        <Row style={{ position: 'absolute', bottom: 0, width: '100%' }}>
                                            <Col span={24} >
                                                <Button type='primary'
                                                    onClick={e => this.showModal(item, idxPecaFisica, mapa)}
                                                    style={{
                                                        marginLeft: 'auto',
                                                        marginRight: '-50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)'
                                                    }}>
                                                    <Icon type='edit' />Setar localização
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Card>
                                </List.Item>
                            )}
                        />

                        <Modal title="Mapear peça digital"
                            visible={this.state.visible}
                            onOk={this.hideModalOk}
                            onCancel={hideModalCancel}
                            width={1000}
                            okText="Salvar"
                            cancelText="Cancelar"
                            centered="false"
                            maskClosable={false}
                            closable={false}
                            style={{}}
                        >
                            <ImageMappedPoints
                                key={mapa._id}
                                enableOnClick="true"
                                idsPecasFisicas={this.state.idsPecasFisicas}
                                pecaFisicaDigital={this.state.pecaFisicaDigital}
                                mapa={mapa}
                                style={{ top: 0 }}
                                onChangeMapa={onChangeMapa}
                                onOpenSnackbar={onOpenSnackbar}
                            />
                        </Modal>
                    </div>

                    <div hidden={tipoPecaMapeamento != 'pecaFisica'}>
                        <Label>Associe ao nome de cada parte anatômica o número da seta (ou etiqueta) que indica a sua localização na peça física</Label>
                        <List
                            rowKey='_id'
                            size="small"
                            bordered={true}
                            locale={{ emptyText: 'Nenhum roteiro foi selecionado' }}
                            dataSource={mapa}
                            renderItem={(item, idx) => (
                                <Item key={item._id} actions={[
                                    <Tooltip title='Adicionar peça física'><Button type='primary' ghost onClick={onAddPecaFisica(idx)} icon='plus' shape='circle' /></Tooltip>
                                ]}>
                                    <div style={_style.item}>
                                        <div style={{ width: '20%', marginRight: 5 }}>{item.parte.nome}</div>
                                        <div style={{ width: '80%' }}>
                                            <List
                                                rowKey='_id'
                                                size="small"
                                                bordered={false}
                                                locale={{ emptyText: 'Nenhuma peça física foi adicionada' }}
                                                dataSource={item.localizacao}
                                                renderItem={(itemLoc, idxLoc) => {
                                                    const hasRefRel = itemLoc.referenciaRelativa.referencia != null;

                                                    return (
                                                        <Item key={itemLoc._id} actions={[
                                                            <div>
                                                                <Checkbox checked={hasRefRel} onChange={this.onOpenRefRel(itemLoc.referenciaRelativa, idx, idxLoc, item)} />
                                                                <a onClick={() => this.onOpenRefRel(itemLoc.referenciaRelativa, idx, idxLoc, item)({ target: { checked: true } })}>Loc. Relativa</a>
                                                            </div>,
                                                            <Tooltip title='Excluir'><Button type='primary' ghost onClick={onRemovePecaFisica(idx, idxLoc)} icon='delete' shape='circle' /></Tooltip>
                                                        ]}>
                                                            <div style={_style.item}>
                                                                <div style={{ width: 'calc(100% - 155px)', marginRight: 5 }}>
                                                                    <Select
                                                                        showSearch
                                                                        notFoundContent='Nenhuma peça física foi adicionada'
                                                                        style={{ width: '100%' }}
                                                                        placeholder="Peça física"
                                                                        value={itemLoc.pecaFisica}
                                                                        optionFilterProp="children"
                                                                        filterOption={filter}
                                                                        onChange={onChangeMapa('pecaFisica', idx, idxLoc)}
                                                                    >
                                                                        {(pecasFisicas.length == 1 && pecasFisicas[0].nome == '') ? null : pecasFisicas.map(({ nome, _id }) => <Option value={_id} key={_id}>{nome}</Option>)}
                                                                    </Select>
                                                                </div>
                                                                <div style={{ width: 150 }}>
                                                                    <InputNumber disabled={hasRefRel} style={{ width: '100%' }} value={itemLoc.numero} onChange={onChangeMapa('numero', idx, idxLoc)} min={0} placeholder={`Nº da etiqueta`} />
                                                                </div>
                                                            </div>
                                                        </Item>)
                                                }}
                                            />
                                        </div>
                                    </div>
                                </Item>)}
                        />
                        <Modal
                            destroyOnClose={true}
                            title='Localização Relativa'
                            visible={open}
                            okText='Salvar'
                            onOk={() => this.onAppyChangeRefRel(this.state.toEditRefRel)}
                            cancelText='Cancelar'
                            onCancel={this.onClose}
                        >
                            <FormLocalizacao
                                erroLocalizacao={erroLocalizacao}
                                {...toEditRefRel}
                                onChange={this.onChangeRefRel}
                                partes={this.state.partesFormLocalizacao}
                            />
                        </Modal>
                    </div>
                </FormItem>
            </Form>
        )
    }


    onChangeRefRel = field => value => {
        const { toEditRefRel } = this.state;

        this.setState({
            erroLocalizacao: null,
            toEditRefRel: {
                ...toEditRefRel,
                model: {
                    ...toEditRefRel.model,
                    [field]: value
                }
            }
        })
    }


    onAppyChangeRefRel = ({ idx, idxLoc, model }) => {
        const itemMapa = this.props.mapa.find(m => m.parte._id == model.referencia);
        if (itemMapa) {
            const { numero } = itemMapa.localizacao[idxLoc];
            if (numero) {
                this.props.onChangeMapa('referenciaRelativa', idx, idxLoc, { numero })({ ...model });
                this.onClearRefRel()
            } else {
                this.setState({ erroLocalizacao: 'A localização desta parte ainda não foi setada' })
                this.props.onOpenSnackbar(`Informe a localização desta parte para utilizá-la como referência`, 'warning');
            }
        } else {
            this.props.onChangeMapa('referenciaRelativa', idx, idxLoc)({ ...model });
            this.onClearRefRel()
        }
    }

    onClearRefRel = () => {
        this.setState({
            open: false,
            erroLocalizacao: null,
            toEditRefRel: {
                model: {},
                idx: '',
                idxLoc: '',
                item: null
            }
        })
    }

    onOpenRefRel = (model, idx, idxLoc, item) => e => {
        if (e.target.checked) {
            this.setState({
                open: true,
                erroLocalizacao: null,
                toEditRefRel: { model, idx, idxLoc, item }
            })
        } else {
            this.props.onChangeMapa('referenciaRelativa', idx, idxLoc)({ ...model, referencia: null });
            this.onClearRefRel()
        }
    }

    onClose = () => this.setState({ open: false })

}


const _style = {
    item: {
        display: 'flex',
        padding: 0,
        margin: 0,
        width: '100%'
    },
    textos: { display: 'flex', alignItems: 'center', flexDirection: 'column', width: '60%', marginRight: 5 }
}

export default FormMapa;
import { Badge, Checkbox, Col, Icon, List, Modal, Row } from 'antd';
import React, { Component } from 'react';
import FormLocalizacao from '../Anatomp/FormLocalizacao';
import MappedPoint from './MappedPoint';

export default class ImageMappedPoints extends Component {

    pontos = [];
    enableOnClick = false;
    idxProximo = 0;
    selecionou = false;
    referenciasImagens = [];

    openModalLocRelativa = false;
    openModalExcluirPonto = false;
    pontosExcluidos = [];

    indexPontoExcluir = null;
    labelPontoExcluir = null;
    nomePartePontoExcluir = null;

    toEditRefRelLocal = {};

    constructor(props) {
        super(props);
    }

    imageClick = e => idx => {

        if (this.enableOnClick) {
            if (this.idxProximo != -1) {
                var label = null;

                if (this.selecionou) {
                    var existePonto = this.getPointByLabel(this.labelProximo);
                    if (existePonto == true) {
                        label = this.labelProximo;
                    } else {
                        label = this.getNextLabel();
                    }
                } else {
                    label = this.getNextLabel();
                }
                this.selecionou = false;

                var offset = this.referenciasImagens[idx].current.getBoundingClientRect();
                var x = Math.floor((e.pageX - 10 - offset.left) / offset.width * 10000) / 100;
                var y = (Math.floor((e.clientY - 15 - offset.top) / offset.height * 10000) / 100);

                this.state.mapa[this.idxProximo].pontos[0] = label;

                var mapa = this.state.mapa[this.idxProximo];

                this.pontos.push({
                    x: x,
                    y: y,
                    label: label,
                    parte: mapa.parte
                });

                let ponto = {
                    x: x,
                    y: y,
                    label: label,
                    parte: mapa.parte
                }

                this.state.pecaFisicaDigital.midias[idx].pontos.push(ponto);
                this.forceUpdate();
                this.setState({ pontos: this.pontos });
                this.getNextPart();

                this.verificaPontoExcluido(label);

            } else {
                //    this.enableOnClick = false;
            }
        }

    }

    verificaPontoExcluido(label) {

        var index = this.pontosExcluidos.indexOf(label);
        if (index !== -1) {
            this.pontosExcluidos.splice(index, 1);
        }

    }

    getPointByLabel(label) {

        if (label) {
            for (let idx = 0; idx < this.state.mapa.length; idx++) {
                if (this.state.mapa[idx].pontos[0] == label) {
                    return true;
                }
            }
        }
        return false;

    }

    removerPontoMapa(label) {

        for (let idx = 0; idx < this.state.mapa.length; idx++) {
            for (let idxPonto = 0; idxPonto < this.state.mapa[idx].pontos; idxPonto++) {
                if (this.state.mapa[idx].pontos[idxPonto] == label) {
                    this.state.mapa[idx].pontos.splice(idxPonto, 1);
                }
            }
        }

    }

    deletePoint = (idx, idxPonto) => {

        this.state.pecaFisicaDigital.midias[idx].pontos.splice(idxPonto, 1);
        this.forceUpdate();

    }

    getNextLabel = () => {

        if (this.pontos.length == 0) {
            return 1;
        }
        var labelMaior = 1;
        for (let idx = 0; idx < this.pontos.length; idx++) {
            if (parseInt(this.pontos[idx].label) > parseInt(labelMaior)) {
                labelMaior = this.pontos[idx].label;
            }
        }

        return labelMaior + 1;

    }



    getNextPart = () => {

        for (let idx = this.idxProximo; idx < this.state.mapa.length; idx++) {
            if (
                this.state.mapa[idx] !== undefined &&
                this.state.mapa[idx].localizacao[0].referenciaRelativa.referencia == null &&
                (this.state.mapa[idx].pontos[0] === undefined
                    || this.state.mapa[idx].pontos[0] == null
                    || this.state.mapa[idx].pontos[0] == "")
            ) {
                this.idxProximo = idx;
                return;
            }
        }

        for (let idx = 0; idx < this.state.mapa.length; idx++) {
            if (this.state.mapa[idx].pontos[0] === undefined && this.state.mapa[idx].localizacao[0].referenciaRelativa.referencia == null) {
                this.idxProximo = idx;
                return;
            }
        }
        this.idxProximo = -1;

    }

    getIcon(idx) {

        if (this.idxProximo != -1 && idx == this.idxProximo) {
            return <Icon type='arrow-right' style={{ color: '#1890ff' }} />;
        }
        return <div></div>;

    }

    setIdxProximo(index, label) {

        if (this.state.mapa[index].localizacao[0].referenciaRelativa.referencia == null) {
            this.selecionou = true;
            this.idxProximo = index;
            this.labelProximo = label ? label : this.getNextLabel();
            this.forceUpdate();
        }

    }

    getLabelParte(idParte) {

        for (let idx = 0; idx < this.state.pecaFisicaDigital.midias.length; idx++) {
            for (let idxP = 0; idxP < this.state.pecaFisicaDigital.midias[idx].pontos.length; idxP++) {
                if (this.state.pecaFisicaDigital.midias[idx].pontos[idxP].parte._id == idParte) {
                    return this.state.pecaFisicaDigital.midias[idx].pontos[idxP].label;
                }
            }
        }

        return "";

    }

    limparPontosReferenciaRelativa(item, idx) {

        // Remove os pontos da imagem
        const filteredObjs = this.state.pecaFisicaDigital.midias.map((image) => {
            image.pontos = image.pontos.filter((point) => {
                if (point.label == item.localizacao[0].numero) {
                    return false
                }
                return true
            })
        });

        this.state.mapa[idx].pontos = [];

        this.getNextPart();

    }

    openModalExcluirPontoFunction = (index, label, nomeParte) => {

        this.setState({
            openModalExcluirPonto: true
        })
        this.indexPontoExcluir = index;
        this.labelPontoExcluir = label;
        this.nomePartePontoExcluir = nomeParte;
        this.openModalExcluirPonto = true;

    }

    closeModalExcluirPontoFunction = () => {

        this.setState({
            openModalExcluirPonto: false
        })
        this.indexPontoExcluir = null;
        this.labelPontoExcluir = null;
        this.nomePartePontoExcluir = null;
        this.openModalExcluirPonto = false;

    }

    excluirLabelPonto = () => {

        if (this.indexPontoExcluir != null) {
            this.pontosExcluidos.push(this.labelPontoExcluir);
            this.state.mapa[this.indexPontoExcluir].pontos = [];
            this.removerPontoMapa(this.labelPontoExcluir);
            this.closeModalExcluirPontoFunction();
        }

    }

    onChangeLocalizacaoRelativa = (model, idx, idxLoc, item) => e => {

        if (e.target.checked) {
            this.setState({
                open: true,
                erroLocalizacao: null,
                toEditRefRel: { model, idx, idxLoc, item }
            })
            this.openModalLocRelativa = true;
            this.toEditRefRelLocal = { model, idx, idxLoc, item };

            this.state.mapa[idx].localizacao[idxLoc].referenciaRelativa.referencia = ' ';
            this.limparPontosReferenciaRelativa(item, idx);

        } else {
            this.idxProximo = idx;
            this.state.mapa[idx].localizacao[idxLoc].referenciaRelativa.referencia = null;
            this.onClearRefRel()
        }

    }

    onOpenRefRel = (model, idx, idxLoc, item) => e => {

        if (this.state.mapa[idx].localizacao[idxLoc].referenciaRelativa.referencia != null) {
            if (e.target.checked) {
                this.setState({
                    open: true,
                    erroLocalizacao: null,
                    toEditRefRel: { model, idx, idxLoc, item }
                })
                this.toEditRefRelLocal = { model, idx, idxLoc, item };
                this.openModalLocRelativa = true;
            } else {
                this.state.mapa[idx].localizacao[idxLoc].referenciaRelativa.referencia = null;
                this.onClearRefRel()
            }
        }

    }

    onAppyChangeRefRel = ({ idx, idxLoc, model }) => {

        const itemMapa = this.props.mapa.find(m => m.parte._id == model.referencia);
        if (itemMapa) {
            const { numero } = itemMapa.localizacao[idxLoc];
            if (numero) {
                this.state.mapa[idx].localizacao[idxLoc].referenciaRelativa = model;
                this.onClearRefRel()
            } else {
                this.setState({ erroLocalizacao: 'A localização desta parte ainda não foi setada' })
                this.props.onOpenSnackbar(`Informe a localização desta parte para utilizá-la como referência`, 'warning');
            }
        } else {
            this.state.mapa[idx].localizacao[idxLoc].referenciaRelativa = model;
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
        this.openModalLocRelativa = false;
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

        this.toEditRefRelLocal.model[field] = value;
    }

    render() {

        if (this.props.enableOnClick == "true") {
            this.enableOnClick = true;
        }

        this.state = {
            maxWidth: 400,
            maxHeight: 400,
            idsPecasFisicas: this.props.idsPecasFisicas,
            pecaFisicaDigital: this.props.pecaFisicaDigital,
            mapa: this.props.mapa,
            open: false,
            openModalExcluirPonto: false,
            erroLocalizacao: null,
            toEditRefRel: {
                model: {},
                idx: '',
                idxLoc: '',
                item: null
            },
            partesFormLocalizacao: []
        };

        for (let idx = 0; idx < this.state.pecaFisicaDigital.midias.length; idx++) {
            this.referenciasImagens[idx] = React.createRef();
        }

        this.pontos = [];
        for (let idx = 0; idx < this.state.pecaFisicaDigital.midias.length; idx++) {
            for (let idxP = 0; idxP < this.state.pecaFisicaDigital.midias[idx].pontos.length; idxP++) {
                if (this.state.pecaFisicaDigital.midias[idx].pontos[idxP] != null && !this.pontosExcluidos.includes(this.state.pecaFisicaDigital.midias[idx].pontos[idxP].label)) {
                    this.pontos.push(this.state.pecaFisicaDigital.midias[idx].pontos[idxP])
                } else {
                    this.state.pecaFisicaDigital.midias[idx].pontos.splice(idxP, 1)
                }
            }
        }

        for (let idx = 0; idx < this.state.mapa.length; idx++) {
            let label = this.getLabelParte(this.state.mapa[idx].parte._id);

            if (!this.pontosExcluidos.includes(label)) {
                this.state.mapa[idx].pontos.push(label)
                if (this.state.pecaFisicaDigital._id == this.state.mapa[idx].localizacao[0].pecaFisica) {
                    this.state.mapa[idx].localizacao[0].numero = label;
                }
            }
        }

        if (this.toEditRefRelLocal.item) {
            const mapaFiltrado = this.state.mapa.filter(m => m.localizacao[0].pecaFisica == this.toEditRefRelLocal.item.localizacao[0].pecaFisica);
            this.state.partesFormLocalizacao = mapaFiltrado.map(i => i.parte).filter(p => p._id != this.toEditRefRelLocal.item.parte._id);
        }

        return (
            <div>
                <Row>
                    <Col span={8} style={{ height: this.state.maxHeight, overflowY: 'auto' }}>
                        <List
                            size="small"
                            header={<div style={{ fontWeight: 'bold' }}>Partes anatômicas</div>}
                            bordered
                            dataSource={this.state.mapa}
                            renderItem={(item, index) => (

                                <div style={{}}>
                                    {
                                        this.state.idsPecasFisicas.includes(item.localizacao[0].pecaFisica) && <List.Item key={index} style={{ border: '1px solid #e8e8e8' }}>
                                            <div onClick={() => this.setIdxProximo(index, item.pontos[0])} style={{ textAlign: 'left' }}>
                                                {this.getIcon(index)}
                                                {item.parte.nome}
                                            </div>
                                            <div style={{
                                                float: 'right'
                                            }}>
                                                <div>
                                                    <a
                                                        onClick={() => this.openModalExcluirPontoFunction(index, item.pontos[0], item.parte.nome)}
                                                        key={item.parte._id}>
                                                        <Badge count={item.pontos[0]} />
                                                    </a>
                                                    <Checkbox
                                                        checked={item.localizacao[0].referenciaRelativa.referencia != null}
                                                        onChange={this.onChangeLocalizacaoRelativa(item.localizacao[0].referenciaRelativa, index, 0, item)}
                                                        style={{ marginLeft: 5 }} />
                                                    <a onClick={() => this.onOpenRefRel(item.localizacao[0].referenciaRelativa, index, 0, item)({ target: { checked: true } })}>
                                                        <Icon type='environment' />
                                                    </a>
                                                </div>
                                            </div>

                                        </List.Item>
                                    }
                                </div>
                            )
                            }
                        />
                    </Col>
                    <Col span={16} style={{ overflowX: 'auto', overflowY: 'auto', display: 'flex' }}>
                        {this.state.pecaFisicaDigital.midias.map((image, idx) =>
                            <div
                                key={idx}
                                style={{
                                    position: 'relative',
                                    width: this.state.maxWidth,
                                    height: this.state.maxHeight,
                                    top: '0px',
                                    bottom: '0px',
                                    left: '0px',
                                    right: '0px',
                                }}>
                                <img onClick={e => this.imageClick(e)(idx)} ref={this.referenciasImagens[idx]}
                                    style={{
                                        width: this.state.maxWidth,
                                        height: this.state.maxHeight,
                                        position: 'relative',
                                    }}
                                    src={image.url}
                                />
                                {image.pontos.map((point, idxPonto) =>
                                    <MappedPoint
                                        key={idxPonto}
                                        point={point}
                                        enableDelete={true}
                                        idx={idx}
                                        idxPonto={idxPonto}
                                        deletePoint={this.deletePoint}
                                    />
                                )}
                            </div>
                        )}
                    </Col>
                </Row>

                <Modal
                    destroyOnClose={true}
                    title='Localização Relativa'
                    visible={this.openModalLocRelativa}
                    okText='Salvar'
                    onOk={() => this.onAppyChangeRefRel(this.toEditRefRelLocal)}
                    cancelText='Cancelar'
                    onCancel={this.onClearRefRel}
                >
                    <FormLocalizacao
                        erroLocalizacao={this.state.erroLocalizacao}
                        {...this.toEditRefRelLocal}
                        onChange={this.onChangeRefRel}
                        partes={this.state.partesFormLocalizacao}
                    />
                </Modal>

                <Modal
                    title={'Excluir Mapeamento de Peça Digital'}
                    visible={this.openModalExcluirPonto}
                    onOk={() => this.excluirLabelPonto()}
                    onCancel={this.closeModalExcluirPontoFunction}
                >
                    <div>  Deseja realmente excluir o mapeamento da parte <span style={{ fontWeight: 'bold' }}>{this.nomePartePontoExcluir} </span>?</div>
                </Modal>

            </div >
        );
    }
}


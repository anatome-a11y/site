import React, { Component } from 'react';
import { Row, Col, List, Badge, Icon } from 'antd';
import MappedPoint from './MappedPoint';


export default class ImageMappedPoints extends Component {

    pontos = [];
    enableOnClick = false;
    idxProximo = -1;
    selecionou = false;

    referenciasImagens = [];

    constructor(props) {
        super(props);
    }

    imageClick = e => idx => {
        if (this.enableOnClick) {
            if (this.idxProximo != -1) {

                if (this.selecionou) {
                    var existePonto = this.getPointByLabel(this.idxProximo + 1);
                    if (existePonto == true) {
                        var label = this.idxProximo + 1;
                    } else {
                        var label = this.getNextLabel();
                    }
                } else {
                    var label = this.getNextLabel();
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
                this.setState({ pontos: this.pontos });

                this.oldx = x; this.oldy = y;

                this.getNextPart();
            } else {
                //    this.enableOnClick = false;
            }
        }
    }

    getPointByLabel(label) {
        for (let idx = 0; idx < this.state.mapa.length; idx++) {
            if (this.state.mapa[idx].pontos[0] == label) {
                return true;
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
        const label = this.state.pecaFisicaDigital.midias[idx].pontos[idxPonto].label;
        this.state.pecaFisicaDigital.midias[idx].pontos.splice(idxPonto, 1);
        //  this.removerPontoMapa(label);
        this.forceUpdate();
    }

    getNextLabel = () => {
        if (this.pontos.length == 0) {
            return 1;
        }

        var labelMaior = this.pontos[0].label;
        for (let idx = 0; idx < this.pontos.length; idx++) {
            if (parseInt(this.pontos[idx].label) > parseInt(labelMaior)) {
                labelMaior = this.pontos[idx].label;
            }
        }
        return labelMaior + 1;
    }

    getNextPart = () => {
        for (let idx = this.idxProximo; idx < this.state.mapa.length; idx++) {
            if (this.state.mapa[idx].pontos[0] === undefined
                || this.state.mapa[idx].pontos[0] == null
                || this.state.mapa[idx].pontos[0] == "") {
                this.idxProximo = idx;
                return;
            }
        }

        for (let idx = 0; idx < this.state.mapa.length; idx++) {
            if (this.state.mapa[idx].pontos[0] === undefined) {
                this.idxProximo = idx;
                return;
            }
        }
        this.idxProximo = -1;
    }

    getIcon(idx) {
        if (idx == this.idxProximo) {
            return <Icon type='arrow-right' style={{ color: '#1890ff' }} />;
        }
        return <div></div>;
    }

    setIdxProximo(index) {
        this.selecionou = true;
        this.idxProximo = index;
        this.forceUpdate();
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

    render() {

        if (this.props.enableOnClick == "true") {
            this.enableOnClick = true;
        }

        this.state = {
            maxWidth: 400,
            maxHeight: 400,
            pecaFisicaDigital: this.props.pecaFisicaDigital,
            mapa: this.props.mapa
        };

        for (let idx = 0; idx < this.state.pecaFisicaDigital.midias.length; idx++) {
            this.referenciasImagens[idx] = React.createRef();
        }

        this.pontos = [];
        for (let idx = 0; idx < this.state.pecaFisicaDigital.midias.length; idx++) {
            for (let idxP = 0; idxP < this.state.pecaFisicaDigital.midias[idx].pontos.length; idxP++) {
                this.pontos.push(this.state.pecaFisicaDigital.midias[idx].pontos[idxP])
            }
        }

        for (let idx = 0; idx < this.state.mapa.length; idx++) {
            this.state.mapa[idx].pontos.push(this.getLabelParte(this.state.mapa[idx].parte._id))
        }

        if (this.pontos.length == 0) {
            this.idxProximo = 0;
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
                            renderItem={(item, index) =>
                                <div onClick={() => this.setIdxProximo(index)}>
                                    <List.Item>
                                        {this.getIcon(index)}
                                        {item.parte.nome}
                                        <div style={{
                                            float: 'right'
                                        }}>
                                            <Badge count={item.pontos[0]} />
                                        </div>
                                    </List.Item>
                                </div>}
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
            </div >
        );
    }
}
import { Badge, Checkbox, Col, Icon, List, Modal, Row } from 'antd';
import React, { Component } from 'react';
import FormLocalizacao from '../Anatomp/FormLocalizacao';
import MappedPoint from './MappedPoint';
import ObjectPointMapper from '../ObjectPointMapper';
import { is3dFile, getExtensionFromFileName } from '../utils/fileUtils';
import { mediaUrl } from '../utils/data';

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

    handleObject3DPointClick = ponto => {
        if (!ponto || !ponto.parte) {
            return;
        }
        const index = this.state.mapa.findIndex(m => m.parte._id == ponto.parte._id);
        if (index !== -1) {
            this.openModalExcluirPontoFunction(index, ponto.label, ponto.parte.nome);
        }
    }

    getNomeProximaParte() {
        const item = this.idxProximo != -1 ? this.state.mapa[this.idxProximo] : null;
        return item && item.parte ? item.parte.nome : null;
    }

    handleObject3DClick = (x, y, z, idx, destaque) => {
        if (this.enableOnClick) {
            this.alinharIdxProximo();
            if (this.idxProximo != -1 && this.parteDaPecaSelecionada(this.state.mapa[this.idxProximo])) {
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
                if (label == null) {
                    return;
                }
                this.registrarPonto(idx, label, {
                    x: x,
                    y: y,
                    z: z,
                    malha: destaque && destaque.malha,
                    faces: destaque && destaque.faces,
                    recorte: destaque && destaque.recorte,
                    traco: destaque && destaque.traco,
                });
            }
        }
    }

    imageClick = e => idx => {

        if (this.enableOnClick) {
            this.alinharIdxProximo();
            if (this.idxProximo != -1 && this.parteDaPecaSelecionada(this.state.mapa[this.idxProximo])) {
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
                if (label == null) {
                    return;
                }

                var offset = this.referenciasImagens[idx].current.getBoundingClientRect();
                var x = Math.floor((e.pageX - 10 - offset.left) / offset.width * 10000) / 100;
                var y = (Math.floor((e.clientY - 15 - offset.top) / offset.height * 10000) / 100);

                this.registrarPonto(idx, label, { x: x, y: y });

            } else {
                //    this.enableOnClick = false;
            }
        }

    }

    labelsIguais = (a, b) => String(a) === String(b)

    labelEstaExcluido = label => this.pontosExcluidos.some(item => this.labelsIguais(item, label))

    // O render seguinte descarta pontos cujo número está em pontosExcluidos.
    // A liberação tem de acontecer antes do forceUpdate, senão a marcação nova
    // (que reaproveita o número removido) é apagada e o pino não aparece.
    verificaPontoExcluido(label) {
        this.pontosExcluidos = this.pontosExcluidos.filter(item => !this.labelsIguais(item, label));
    }

    removerPontos = predicado => {
        const midias = (this.state.pecaFisicaDigital && this.state.pecaFisicaDigital.midias) || [];
        midias.forEach(midia => {
            if (!Array.isArray(midia.pontos)) {
                return;
            }
            midia.pontos = midia.pontos.filter(point => !(point && predicado(point)));
        });
        this.pontos = this.pontos.filter(point => !(point && predicado(point)));
    }

    registrarPonto = (idx, label, coords) => {
        const mapa = this.state.mapa[this.idxProximo];
        this.selecionou = false;
        this.verificaPontoExcluido(label);
        const malhaInteira = coords.malha
            && !(coords.faces && coords.faces.length)
            && !(coords.traco && coords.traco.length);
        const partesLiberadas = [];
        this.removerPontos(point => {
            const mesmaParte = this.mesmoId(point.parte, mapa.parte);
            const mesmaMalha = malhaInteira
                && point.malha === coords.malha
                && !(point.faces && point.faces.length);
            if (mesmaMalha && !mesmaParte) {
                partesLiberadas.push(point.parte);
            }
            return mesmaParte || mesmaMalha;
        });
        partesLiberadas.forEach(parte => {
            this.state.mapa.forEach(item => {
                if (!item || !this.mesmoId(item.parte, parte)) {
                    return;
                }
                item.pontos = [];
                if (item.localizacao && item.localizacao[0]
                    && this.state.pecaFisicaDigital._id == item.localizacao[0].pecaFisica) {
                    item.localizacao[0].numero = '';
                }
            });
        });

        const ponto = {
            x: coords.x,
            y: coords.y,
            label: label,
            parte: mapa.parte
        };
        if (coords.z != null) {
            ponto.z = coords.z;
        }
        if (coords.malha) {
            ponto.malha = coords.malha;
        }
        if (coords.faces && coords.faces.length) {
            ponto.faces = coords.faces;
        }
        if (coords.recorte && coords.recorte.length >= 3) {
            ponto.recorte = coords.recorte;
        }
        if (coords.traco && coords.traco.length > 1) {
            ponto.traco = coords.traco;
        }

        const midia = this.state.pecaFisicaDigital.midias[idx];
        midia.pontos = [...(midia.pontos || []), ponto];
        this.state.mapa[this.idxProximo].pontos = [label];
        this.forceUpdate();
        this.getNextPart();
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
            const pontos = this.state.mapa[idx].pontos;
            if (!Array.isArray(pontos)) {
                continue;
            }
            this.state.mapa[idx].pontos = pontos.filter(item => !this.labelsIguais(item, label));
        }

    }

    deletePoint = (idx, idxPonto) => {

        this.state.pecaFisicaDigital.midias[idx].pontos.splice(idxPonto, 1);
        this.forceUpdate();

    }

    quantidadePartesPeca = () => {
        const mapa = (this.state && this.state.mapa) || [];
        const daPeca = mapa.filter(item => this.parteDaPecaSelecionada(item));
        if (daPeca.length > 0) {
            return daPeca.length;
        }
        return (this.state && this.state.idsPartesPeca || []).length;
    }

    getNextLabel = () => {

        // O número fica entre 1 e a quantidade de partes. Remover uma marcação
        // devolve esse número para a próxima, em vez de continuar a sequência.
        const usados = {};
        for (let idx = 0; idx < this.pontos.length; idx++) {
            const numero = parseInt(this.pontos[idx].label, 10);
            if (!isNaN(numero) && numero > 0) {
                usados[numero] = true;
            }
        }

        const limite = this.quantidadePartesPeca();
        const teto = limite > 0 ? limite : Object.keys(usados).length + 1;
        for (let numero = 1; numero <= teto; numero++) {
            if (!usados[numero]) {
                return numero;
            }
        }

        return null;

    }



    mesmoId = (a, b) => String((a && a._id) || a || '') === String((b && b._id) || b || '')

    parteDaPecaSelecionada = item => {
        if (!item || !item.parte) {
            return false;
        }
        const idsPartes = this.state.idsPartesPeca || [];
        if (idsPartes.length > 0) {
            const parteId = item.parte._id || item.parte;
            return idsPartes.some(id => this.mesmoId(id, parteId));
        }
        const idsPecas = this.state.idsPecasFisicas || [];
        return (item.localizacao || []).some(localizacao => idsPecas.some(id => this.mesmoId(id, localizacao && localizacao.pecaFisica)));
    }

    parteProntaParaMarcar = item => {
        if (!item || !item.localizacao || !item.localizacao[0] || !item.localizacao[0].referenciaRelativa) {
            return false;
        }
        if (!this.parteDaPecaSelecionada(item)) {
            return false;
        }
        if (item.localizacao[0].referenciaRelativa.referencia != null) {
            return false;
        }
        const ponto = item.pontos && item.pontos[0];
        return ponto === undefined || ponto == null || ponto === "";
    }

    getNextPart = () => {
        const total = this.state.mapa.length;
        const inicio = this.idxProximo >= 0 && this.idxProximo < total ? this.idxProximo : 0;

        for (let passo = 0; passo < total; passo++) {
            const idx = (inicio + passo) % total;
            if (this.parteProntaParaMarcar(this.state.mapa[idx])) {
                this.idxProximo = idx;
                return;
            }
        }
        this.idxProximo = -1;
    }

    alinharIdxProximo = () => {
        const atual = this.state.mapa[this.idxProximo];
        if (this.selecionou && atual && this.parteDaPecaSelecionada(atual)) {
            return;
        }
        if (!this.parteProntaParaMarcar(atual)) {
            this.getNextPart();
        }
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
                const ponto = this.state.pecaFisicaDigital.midias[idx].pontos[idxP];
                if (ponto && this.mesmoId(ponto.parte, idParte)) {
                    return ponto.label;
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
            const label = this.labelPontoExcluir;
            if (!this.labelEstaExcluido(label)) {
                this.pontosExcluidos.push(label);
            }
            this.removerPontos(point => this.labelsIguais(point.label, label));
            this.state.mapa[this.indexPontoExcluir].pontos = [];
            const item = this.state.mapa[this.indexPontoExcluir];
            if (item && item.localizacao && item.localizacao[0]
                && this.state.pecaFisicaDigital._id == item.localizacao[0].pecaFisica) {
                item.localizacao[0].numero = '';
            }
            this.removerPontoMapa(label);
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
            idsPartesPeca: this.props.idsPartesPeca || [],
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
            const origem = this.state.pecaFisicaDigital.midias[idx].pontos || [];
            const mantidos = [];
            for (let idxP = 0; idxP < origem.length; idxP++) {
                const point = origem[idxP];
                if (point != null && !this.labelEstaExcluido(point.label)) {
                    mantidos.push(point);
                    this.pontos.push(point);
                }
            }
            this.state.pecaFisicaDigital.midias[idx].pontos = mantidos;
        }

        for (let idx = 0; idx < this.state.mapa.length; idx++) {
            const itemMapa = this.state.mapa[idx];
            if (!itemMapa.parte || !itemMapa.localizacao || !itemMapa.localizacao[0]) {
                continue;
            }
            if (!Array.isArray(itemMapa.pontos)) {
                itemMapa.pontos = [];
            }
            let label = this.getLabelParte(itemMapa.parte._id);

            if (label !== '' && label != null && !this.labelEstaExcluido(label)) {
                itemMapa.pontos = [label];
                if (this.state.pecaFisicaDigital._id == itemMapa.localizacao[0].pecaFisica) {
                    itemMapa.localizacao[0].numero = label;
                }
            }
        }

        if (this.toEditRefRelLocal.item) {
            const mapaFiltrado = this.state.mapa.filter(m => m.localizacao[0].pecaFisica == this.toEditRefRelLocal.item.localizacao[0].pecaFisica);
            this.state.partesFormLocalizacao = mapaFiltrado.map(i => i.parte).filter(p => p._id != this.toEditRefRelLocal.item.parte._id);
        }

        this.alinharIdxProximo();

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
                                        this.parteDaPecaSelecionada(item) && <List.Item key={index} style={{ border: '1px solid #e8e8e8' }}>
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
                                {
                                    is3dFile(image.name) ? (
                                        <ObjectPointMapper 
                                            url={mediaUrl(image.url)} 
                                            fileType={getExtensionFromFileName(image.name)}
                                            onObject3DClick={this.handleObject3DClick}
                                            onPointClick={this.handleObject3DPointClick}
                                            idx={idx}
                                            pontos={this.state.pecaFisicaDigital.midias[idx].pontos}
                                            enableOnClick={this.enableOnClick}
                                            instrucao={this.getNomeProximaParte()}
                                        />
                                    ) : (
                                        <img onClick={e => this.imageClick(e)(idx)} ref={this.referenciasImagens[idx]}
                                            style={{
                                                width: this.state.maxWidth,
                                                height: this.state.maxHeight,
                                                position: 'relative',
                                            }}
                                            src={mediaUrl(image.url)}
                                        />
                                    )
                                }
                                {
                                    !is3dFile(image.name) && image.pontos.map((point, idxPonto) =>
                                        <MappedPoint
                                            key={idxPonto}
                                            point={point}
                                            enableDelete={true}
                                            idx={idx}
                                            idxPonto={idxPonto}
                                            deletePoint={this.deletePoint}
                                        />
                                    )
                                }       
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


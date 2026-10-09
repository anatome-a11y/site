import { Button, Form, Input, List, Radio, Select, Spin, Tooltip, Upload } from 'antd';
import React, { Component, Fragment } from 'react';
import Label from '../components/Label';
import MidiaImage from '../components/MidiaImage';
import { filter, uploadMedia } from '../utils/data';
import { is3dFile } from '../utils/fileUtils';

const { v4: uuidv4 } = require('uuid');

const { Item } = List;
const { Option } = Select;

const FormItem = Form.Item;

const _modelPecaFisica = {
    _id: uuidv4(),
    nome: '',
    descricao: '',
    pecaGenerica: '',
    midias: [],
}

const _styleMidia = {
    item: {
        display: 'flex',
        padding: 0,
        margin: 0,
        width: '20%'
    },
}

class FormPecasFisicas extends Component {

    state = {
        loading: false,
        pecasFisicas: this.props.pecasFisicas.length > 0 ? this.props.pecasFisicas : [_modelPecaFisica()]
    }

    componentWillReceiveProps(next) {
        this.setState({ pecasFisicas: this.props.pecasFisicas });

        if (this.props.pecasFisicas.length != next.pecasFisicas.length) {
            this.props.onBlurPecaFisica()
        }
    }

    beforeUpload = _id => () => {
        this.setState({ loading: _id })
        return false
    }

    onAdd = () => {
        const { pecasFisicas } = this.state;

        this.setState({
            sinalNovo: + new Date(),
            pecasFisicas: [
                ...pecasFisicas,
                _modelPecaFisica,
            ]
        })
    }

    render() {
        const { loading } = this.state;
        const { onChangePecaFisica, erros, isEdit, partes, onAddPecaFisica, pecasFisicas, onDeletePecaFisica, listaPecasGenericas, tipoPecaMapeamento, onChange, onOpenSnackbar } = this.props;

        const _erros = {
            pecasFisicas: erros.campos.indexOf('pecasFisicas'),
        }

        const onChangeRadio = e => {
            onChange("tipoPecaMapeamento")(e.target.value);
        };

        const digital = tipoPecaMapeamento == 'pecaDigital';
        const pecaLabel = digital ? 'peça digital' : 'peça física';

        const onUpload = (idx, midias, _id) => info => {
            const [main, type] = info.file.type.split('/');
            
            if (main === "image" || is3dFile(info.file.name)) {
                const { onOpenSnackbar } = this.props;
                if (info.file.status !== 'uploading') {
                    //Adiciona
                    if (midias.find(f => f.uid == info.file.uid) == undefined) {
                        uploadMedia(info.file.originFileObj || info.file)
                            .then(uploaded => {
                                this.setState({ loading: false });
                                onChangePecaFisica('midias', idx)([...midias, {
                                    _id: uuidv4(),
                                    type: uploaded.type || info.file.type,
                                    name: uploaded.name,
                                    tags: [],
                                    url: uploaded.url,
                                    original: info.file,
                                    img: "",
                                    pontos: [],
                                }])
                            })
                            .catch(err => {
                                this.setState({ loading: false });
                                onOpenSnackbar(err.message)
                            });
                    } else {
                        this.setState({ loading: false });
                        onChangePecaFisica('midias', idx)(midias.filter(f => f.uid != info.file.uid))
                    }
                }
            } else {
                this.beforeUpload(_id);
                this.setState({ loading: false });
                onOpenSnackbar("Formato inválido. Use .png, .jpg, .jpeg, .glb, .gltf ou .obj.");
            }
        }

        return (
            <Form style={{ margin: 20 }}>
                <FormItem
                    validateStatus={_erros.pecasFisicas != -1 ? 'error' : ''}
                    help={erros.msgs[_erros.pecasFisicas] || ''}
                >
                    <Label>Selecione o tipo de peça</Label>
                    <Radio.Group onChange={onChangeRadio} value={tipoPecaMapeamento}>
                        <Radio value={'pecaDigital'}>Peças digitais</Radio>
                        <Radio value={'pecaFisica'}>Peças físicas</Radio>
                    </Radio.Group>

                    <Label>Inclua as informações sobre as peças que terão 
                        as partes anatômicas etiquetadas e serão disponibilizadas aos estudantes para 
                        aprenderem o conteúdo deste roteiro usando o APP Anatome
                    </Label>

                    <List
                        rowKey='_id'
                        size="small"
                        bordered={true}
                        locale={{ emptyText: `Nenhuma ${pecaLabel} foi adicionada` }}
                        dataSource={pecasFisicas}
                        renderItem={(item, idx) => (
                            <Item key={item._id} actions={[
                                <div hidden={tipoPecaMapeamento != 'pecaDigital'}>
                                    <Upload
                                        hidden={tipoPecaMapeamento != 'pecaDigital'}
                                        showUploadList={false}
                                        onChange={onUpload(idx, item.midias, item._id)}
                                        beforeUpload={this.beforeUpload(item._id)}
                                        accept="image/png, image/jpeg, .glb, .obj">
                                        <Tooltip title='Adicionar mídia'>
                                            <Button type='primary' ghost shape='circle' icon='paper-clip' disabled={loading} />
                                        </Tooltip>
                                    </Upload>
                                </div>
                                ,
                                <Tooltip title='Excluir'><Button type='primary' ghost onClick={onDeletePecaFisica(idx)} icon='delete' shape='circle' /></Tooltip>
                            ]}>
                                <div style={_style.item}>
                                    <div style={{ width: isEdit ? '40%' : '30%', marginRight: 5 }}>
                                        <Input value={item.nome} onChange={e => onChangePecaFisica('nome', idx)(e.target.value)} placeholder={`Nome da ${pecaLabel}`} />
                                    </div>
                                    <div style={{ width: '30%', marginRight: 5 }}>
                                        <Select
                                            showSearch
                                            disabled={isEdit}
                                            value={item.pecaGenerica == "" ? undefined : item.pecaGenerica}
                                            onChange={onChangePecaFisica('pecaGenerica', idx)}
                                            notFoundContent='Nada foi encontrado'
                                            optionFilterProp="children"
                                            filterOption={filter}
                                            placeholder='Conteúdo da peça correspondente'
                                            style={{ width: '100%' }}
                                        >
                                            {listaPecasGenericas.map(i => <Option key={i._id} value={i._id}>{i.nome}</Option>)}
                                        </Select>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', width: isEdit ? '60%' : '40%', marginRight: 5 }}>
                                        <Input value={item.descricao} onChange={e => onChangePecaFisica('descricao', idx)(e.target.value)} placeholder={`Descrição da ${pecaLabel}`} />
                                    </div>
                                </div>
                                <div style={_styleMidia.item}>
                                    <div hidden={tipoPecaMapeamento != 'pecaDigital'} style={{ alignSelf: 'center' }}>
                                        {item.midias.map((t, idxMidia) =>
                                            <Fragment key={t._id}>
                                                <MidiaImage file={t} idx={idxMidia} midias={item.midias} onChange={onChangePecaFisica('midias', idx)} />
                                            </Fragment>)
                                        }
                                        {loading == item._id ? <Spin /> : null}
                                    </div>
                                </div>
                            </Item>)}
                    />
                </FormItem>
            </Form>
        )
    }
}


const _style = {
    item: {
        display: 'flex',
        padding: 0,
        margin: 0,
        width: '100%'
    }
}

export default FormPecasFisicas;
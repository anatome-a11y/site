
import { Badge, Button, Icon, Modal } from 'antd';
import React, { useState } from 'react';

const MappedPoint = ({ key_, point, enableDelete, idx, idxPonto, deletePoint, nomePeca }) => {

    const [isModalVisible, setIsModalVisible] = useState(false);

    const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const showModalDelete = () => {
        setIsModalDeleteVisible(true);
    };

    const handleOkDelete = () => {
        setIsModalDeleteVisible(false);
        setIsModalVisible(false);
        deletePoint(idx, idxPonto);
    };

    const handleCancelDelete = () => {
        setIsModalDeleteVisible(false);
    };

    return (
        <div>
            <div
                onClick={showModal}
                key={key_}
                style={{ /*borderRadius: 100, width: 20, height: 20, backgroundColor: 'red',*/ top: point.y + "%", left: point.x + "%", position: 'absolute' }}>
                {/*}<div style={{ fontSize: 7, padding: 2, textAlign: "center", color: 'white' }} key={key_2}>{point.label}</div>{*/}
                <Badge count={point.label} />
            </div>

            <Modal
                title={point.parte.nome}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <div key={'id' + (new Date()).getTime()}>
                        <Button onClick={showModalDelete}>
                            <Icon type="delete" />Excluir
                        </Button>
                        <Button key="submit" type="primary" onClick={handleOk}>
                            Ok
                        </Button>
                    </div>
                ]}
            >
                {point.parte.descricao}
            </Modal>

            <Modal
                title={'Excluir Mapeamento de Peça Digital'}
                visible={isModalDeleteVisible}
                onOk={handleOkDelete}
                onCancel={handleCancelDelete}
            >
                <div>  Deseja realmente excluir o mapeamento da parte <span style={{ fontWeight: 'bold' }}>{point.parte.nome} </span> da peça <span style={{ fontWeight: 'bold' }}>{nomePeca} </span> ?</div>
            </Modal>

        </div>
    )
}

export default MappedPoint;

import React, { useState } from 'react';
import { Modal, Button, Badge, Icon } from 'antd';

const MappedPoint = ({ key, point, enableDelete, idx, idxPonto, deletePoint }) => {

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
                key={key}
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
                    <div>
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
                <div>  Deseja realmente excluir o mapeamento da parte <span style={{ fontWeight: 'bold' }}>{point.parte.nome} </span>?</div>
            </Modal>

        </div>
    )
}

export default MappedPoint;
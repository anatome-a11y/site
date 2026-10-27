import React from 'react';
import { Collapse } from 'antd';

import Header from '../../components/Header'

const Panel = Collapse.Panel;

const Barra = ({title,children}) => {

    return (
        <div style={{ paddingLeft: 24 , paddingRight: 24 }}>
            <Collapse
                bordered={false}
                className="anatome-collapse"
                defaultActiveKey={['key']}
            >
                <Panel 
                    className='anatome-panel' 
                    key='key' 
                    header={ <Header contentQ={<p>....</p>} title={title} /> } 
                >
                {children}
                </Panel>
            </Collapse>
        </div>
    )

}

export default Barra

import React, { Component, Fragment } from 'react';

import { Tooltip, Button } from 'antd';

const Action = ({ icon, onClick, label, children }) => {

    return (
        <Tooltip title={label}>
            {children == undefined ? <Button type='primary' ghost={true} style={{marginRight: 2}} shape="circle" icon={icon} onClick={onClick} /> : <Button style={{marginRight: 2, fontSize: '1em'}} shape="circle" onClick={onClick} >{children}</Button>}            
        </Tooltip>
    )
}

export default Action;
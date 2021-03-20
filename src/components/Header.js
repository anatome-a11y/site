
import React, { Component, Fragment } from 'react';
import Helper from './Helper'
import { Spin } from 'antd';


const Header = ({ title, contentQ, error, loading, extra = null }) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
            paddingRight: 24,
        }}>
            <div style={error ? {color: '#f5222d'} : undefined}>{title}{loading ? <Spin size='small' style={{marginLeft: 5}} /> : null}</div>
            <div style={{ display: 'flex' }}>
                {extra}
                <Helper title={title} contentQ={contentQ} />
            </div>            
        </div>
    )
}

export default Header

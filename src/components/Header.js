
import React, { Component, Fragment } from 'react';
import Helper from './Helper'


const Header = ({ title, contentQ, error }) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
            paddingRight: 24,
        }}>
            <div style={error ? {color: '#f5222d'} : undefined}>{title}</div>
            <Helper title={title} contentQ={contentQ} />
        </div>
    )
}

export default Header
import React, { Component, Fragment } from 'react';

import Action from './ActionHelper'

const Helper = ({ title, contentQ }) => (
    <div>
        <Action
            placement='left'
            icon='question'
            title={title}
            content={contentQ}
        />
        <Action placement='top' title='Exemplo 1' content='...'>e1</Action>
        <Action placement='topRight' title='Exemplo 2' content='...'>e2</Action>
    </div>
)


export default Helper;
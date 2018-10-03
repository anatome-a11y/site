
import React, { Component, Fragment } from 'react';

import { Popover, Button } from 'antd';

const Action = ({ icon, children, title, content, placement = 'left' }) => (
    <Popover placement={placement} content={content} title={title}>
        {children != undefined ? <Button  shape="circle" style={{ marginRight: 3, fontSize: 12 }}>{children}</Button> : <Button  shape="circle" style={{ marginRight: 3 }} icon={icon} />}
    </Popover>
)


export default Action;
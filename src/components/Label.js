import React from 'react';


const Label = ({ children, style = {} }) => <div style={{
    lineHeight: '1.6rem',
    marginBottom: 15,
    color: 'rgba(0, 0, 0, 0.85)',
    ...style
}}>
    {children}
</div>

export default Label;
import React from 'react';


const Label = ({ children, style = {} }) => <div className="anatome-label" style={{
    lineHeight: '1.6rem',
    marginBottom: 15,
    ...style
}}>
    {children}
</div>

export default Label;
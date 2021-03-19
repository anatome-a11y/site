import React from 'react'

const Titulo = ({title,modo}) => {
    return (
        <h2
            className='section'
            style={{textAlign: 'center', marginTop: modo === 'assoc' ? 0 : 30}}>
            {title}
        </h2>
    )
}

export default Titulo

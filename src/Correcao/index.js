import React from 'react'

const Correcao = () => {
    const title = 'Corrigir avaliação';
    const modo = 'assoc';

    return (
        <div style={{padding: 24}}>
            <h2
                className='section'
                style={{textAlign: 'center', marginTop: modo === 'assoc' ? 0 : 30}}>
                {title}
            </h2>
        </div>
    )
}

export default Correcao

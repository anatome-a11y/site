import React, {useState} from 'react'
import { Button, Input, message } from 'antd';

import iconLock from './lock-icon.svg';

const TelaLogin = ({history}) => {

    const [userName, setUserName] = useState(null);
    const [password, setPassword] = useState(null);

    return (
        <div style={styles.center}>
            <div style={styles.container}>
                <div style={styles.center}>
                    <div style={styles.circle}>
                        <img style={styles.image} src={iconLock} alt='asd'/>
                    </div>
                </div>
                <div style={styles.input}>
                    <span>Usuário</span>
                    <Input value={userName} onChange={e => setUserName(e.target.value)} />
                </div>
                <div style={styles.input}>
                    <span>Senha</span>
                    <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div style={styles.center}>
                    <Button
                        style={styles.button}
                        type='primary'
                        onClick={() => {
                            if (userName === 'anatome' && password === 'prj._anatome21') {
                                history.push('/');
                            } else {
                                message['error']('Usuário ou senha incorreto');
                            }
                        }}
                    >Entrar</Button>
                </div>
            </div>
        </div>
    )
}

const styles = {
    container: {
        marginTop: '50px',
        backgroundColor: '#E8E8E8',
    },
    circle: {
        width: 70,
        height: 70,
        borderRadius: '50%',
        backgroundColor: '#e518a7',
        marginTop: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    center: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        paddingLeft: '85px',
        paddingRight: '85px',
        marginTop: '15px',
        marginBottom: '20px'
    },
    input: {
        marginLeft: '30px',
        marginRight: '30px',
        marginBottom: '25px'
    },
    image: {
        width: '40px',
        height: '40px'
    }
}

export default TelaLogin

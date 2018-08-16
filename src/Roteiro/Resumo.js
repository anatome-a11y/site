
import React, { Component, Fragment } from 'react';

import {Tag} from 'antd'

const Resumo = ({
    nome,
    curso,
    disciplina,
    proposito,
    partes
}) => (
    <div style={{border: '1px solid #e8e8e8', padding: 5, borderRadius: 3}}>
        <table style={{ width: '100%' }}>
            <tbody>
                <tr>
                    <th>Nome</th>
                    <td>{nome}</td>
                    <th>Curso</th>
                    <td>{curso}</td>
                </tr>
                <tr>
                    <th>Disciplina</th>
                    <td>{disciplina}</td>
                    <th>Propósito</th>
                    <td>{proposito}</td>
                </tr>
                {(partes && partes.length > 0) && (
                    <tr>
                        <th>Partes</th>
                        <td colSpan={3}>
                            {partes.map(p => <Tag>{p}</Tag>)}
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
    )

export default Resumo
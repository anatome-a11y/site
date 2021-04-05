import React from 'react'

import { Typography , Checkbox , Input , Button } from 'antd'

const Text = Typography.Text
const Title = Typography.Title

const CardRespostaEdit = ({res,style,edit,onEdit,onTrash}) => {

    const bg = ( style && style.backgroundColor ) ? style.backgroundColor : '#f3f3f3'

    return (
        <div style={{
            display:'flex', 
            flexDirection:'column', 
            flex:1,
        }}>

            <div style={{display:'flex',backgroundColor:bg,marginBottom:5,padding:5}}>
                <Input 
                    style={{flex:1}} 
                    value={res.pai} 
                    onChange={ ({target}) => edit('pai',target.value) }
                />
                <div style={{flex:1,textAlign:'right'}}>
                   <Button onClick={onEdit} type='secondary' icon='edit'></Button> 
                   <Button onClick={onTrash} type='secondary' icon='delete'></Button> 
                </div>
            </div>

            <div style={{display:'flex',flexDirection:'column',backgroundColor:bg,padding:5}}>

                <div style={{display:'flex',marginBottom:5,width:'100%',justifyContent:'center'}}>
                    <div style={{flex:1,width:0}}></div>
                    <Text type="secondary" style={{flex:1,textAlign:'center'}}>Parte</Text>
                    <Input 
                        style={{flex:1,minWidth:0}}
                        type="number"
                        value={res.numero}
                        onChange={ ({target}) => edit('numero',target.value) }
                    />
                    <div style={{flex:1}}></div>
                </div>

                <div style={{display:'flex'}}>
                    <Input 
                        style={{flex:1}} 
                        value={res.nome} 
                        onChange={ ({target}) => edit('nome',target.value) }
                    />
                    <div style={{flex:1,textAlign:'right'}}>
                        Correta:
                        <Checkbox 
                            style={{paddingLeft:8}}
                            checked={res.correta} 
                            onChange={ ({target}) => edit('correta',target.checked) } 
                        />
                    </div>
                </div>

            </div>

            { res.descricao.map( (d,i) => ( 
                <div key={i} style={{backgroundColor:bg,padding:5,flex:1}}>
                    <div style={{backgroundColor:bg,display:'flex'}}>
                        <div style={{flex:0.15}}> </div>
                        <div style={{flex:2}}><hr/></div>
                    </div>
                    <div><Input.TextArea 
                        value={d} 
                        onChange={ 
                            ({target}) => edit(
                                'descricao',
                                [ 
                                  ...res.descricao.slice(0,i), 
                                  target.value,
                                  ...res.descricao.slice(i+1)
                                ]
                            )
                        }
                   /></div>
                </div>
            ))}


        </div>
    )
}

export default CardRespostaEdit

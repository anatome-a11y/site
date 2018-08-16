import React, { Component, Fragment } from 'react';

import 'antd/dist/antd.css';
import { Menu, Icon, message } from 'antd';
import Inicio from './Inicio'
import Peca from './Peca'
import Roteiro from './Roteiro'

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const { Item } = Menu;


class App extends Component {
	state = {
		current: 'roteiro',
		loading: false,
	}


	render() {
		return (
			<Fragment>
				<div style={{height: 20, backgroundColor: '#1890ff', color: '#fff', textAlign: 'right'}}>Acessibilidade...</div>
				<Menu
					onClick={this.onChangeMenu}
					selectedKeys={[this.state.current]}
					mode="horizontal"
				>
					<Item key="inicio"><Icon type="home" />Página inicial</Item>
					<SubMenu style={{ float: 'right' }} title={<span><Icon type="user" />Thiago Goveia</span>}>
						<MenuItemGroup title="Sua conta">
							<Item key="setting:1">Preferências</Item>
							<Item key="setting:2">Editar perfil</Item>
						</MenuItemGroup>
						<MenuItemGroup title="Sessão">
							<Item key="setting:3">Sair</Item>
						</MenuItemGroup>
					</SubMenu>
				</Menu>
				<div style={{padding: 25}}>
				{this.getBody()}				
				</div>
			</Fragment>
		)
	}

	onChangeMenu = (e) => {
		this.setState({
			current: e.key,
		});
	}	

	getBody = () => {
		const {current} = this.state;

		switch(current){
			case 'inicio': return <Inicio 
			onChangeMenu={this.onChangeMenu} 
			onRequest={this.onRequest} 
			onOpenSnackbar={this.onOpenSnackbar} 
			/>;
			case 'peca': return <Peca onRequest={this.onRequest} onOpenSnackbar={this.onOpenSnackbar}  />;
			case 'roteiro': return <Roteiro onRequest={this.onRequest} onOpenSnackbar={this.onOpenSnackbar}  />;
		}
	}

	onRequest = promise => {
		return promise
			.then(ret => {
				return new Promise((res, rej) => {
					if (ret.code !== 200) {
						rej(ret)
						throw ret.data
					} else {
						res(ret)
					}
				})
			})
			.catch(e => {
				console.error(e)
				const msg = typeof e === 'string' ? e : 'Ocorreu um erro no tratamento de dados';
				this.onOpenSnackbar(msg)
			})
			.finally(() => this.setState({ loading: false }))
	}
	
	onCloseSnackbar = () => {
		const { snackbar } = this.state;
		this.setState({ snackbar: { ...snackbar, open: false } })
	}

	onOpenSnackbar = (msg, type = 'error') => {
		message[type](msg);
	  };		
}

export default App;

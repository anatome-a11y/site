import React, { Component, Fragment } from 'react';

import 'antd/dist/antd.css';
import { Menu, Icon, message } from 'antd';
import Inicio from './Inicio'
import Peca from './Peca'
import Roteiro from './Roteiro'
import Anatomp from './Anatomp'


const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const { Item } = Menu;

const _initialClicked = {
	res: '',
	mode: '',
	item: {
		_id: ''
	}
}


class App extends Component {
	state = {
		current: 'anatomp',
		loading: false,
        clicked: {..._initialClicked}		
	}


	render() {
		return (
			<Fragment>
				<div style={{ height: 20, backgroundColor: '#1890ff', color: '#fff', textAlign: 'right' }}>Acessibilidade...</div>
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
				<div style={{ padding: 25 }}>
					{this.getBody()}
				</div>
			</Fragment>
		)
	}

    onSetClicked = (res = '', mode = '', item = {_id: ''}) => () => this.setState({clicked: {res, mode, item}})  	

	onChangeMenu = (e) => {
		this.setState({ current: e.key });
	}

	onSetAppState = state => this.setState(state)

	getBody = () => {
		const { current, clicked } = this.state;

		switch (current) {
			case 'inicio': return <Inicio
				clicked={clicked}
				onChangeMenu={this.onChangeMenu}
				onSetAppState={this.onSetAppState}
				onOpenSnackbar={this.onOpenSnackbar}
				onSetClicked={this.onSetClicked}
			/>;
			case 'peca': return <Peca
				onOpenSnackbar={this.onOpenSnackbar}
				onSetAppState={this.onSetAppState}
				model={clicked.res == 'peca' ? clicked.item : undefined}
			/>;
			case 'roteiro': return <Roteiro
				onOpenSnackbar={this.onOpenSnackbar}
				onSetAppState={this.onSetAppState}
				model={clicked.res == 'roteiro' ? clicked.item : undefined}
			/>;
			case 'anatomp': return <Anatomp
				onOpenSnackbar={this.onOpenSnackbar}
				onSetAppState={this.onSetAppState}
				model={clicked.res == 'anatomp' ? clicked.item : undefined}
			/>;			
		}
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

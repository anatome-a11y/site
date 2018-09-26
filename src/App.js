import React, { Component, Fragment } from 'react';

import 'antd/dist/antd.css';
import { Menu, Icon, message, Button, Divider } from 'antd';
import Inicio from './Inicio'
import Peca from './Peca'
import Roteiro from './Roteiro'
import Anatomp from './Anatomp'
import { injectGlobal } from 'styled-components';


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
		current: 'inicio',
		loading: false,
		clicked: { ..._initialClicked },
		zoom: 1
	}


	render() {
		const {zoom} = this.state;

		return (
			<Fragment>
				<div className='shadow2'>
					<div style={{ backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 24, paddingLeft: 24, borderBottom: '1px solid #e8e8e8' }}>
						<div>Acessibilidade</div>
						<div>
							<Button shape='circle' icon='bulb' style={{ margin: '4px 4px' }} />
							<Divider type='vertical' />
							<Button disabled={zoom == 1} onClick={this.onZoomOut} shape='circle' icon='minus' style={{ margin: '4px 4px' }} />
							<Button disabled={zoom == 2} onClick={this.onZoomIn} shape='circle' icon='plus' style={{ margin: '4px 4px' }} />
						</div>
					</div>
					<Menu
						onClick={this.onChangeMenu}
						selectedKeys={[this.state.current]}
						mode="horizontal"
					>
						<Item key="inicio" style={{fontSize: '1rem'}}><Icon type="home" />Página inicial</Item>
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
				</div>
				<div style={{ padding: 25 }}>
					{this.getBody()}
				</div>
			</Fragment>
		)
	}

	onZoomIn = () => {
		const {zoom} = this.state;		
		zoom < 2 && this.setState({zoom: zoom + 0.2}, () => {
			injectGlobal`
			html * {
				font-size: ${zoom + 0.2}rem !important
			}
			.randomico {
				zoom: ${Math.random()};
			}			
			`			
		})
	}

	onZoomOut = () => {
		const {zoom} = this.state;
		zoom > 1 && this.setState({zoom: zoom - 0.2}, () => {
			injectGlobal`
			html * {
				font-size: ${zoom - 0.2}rem !important
			}
			.randomico {
				zoom: ${Math.random()};
			}			
			`			
		})
	}	

	onSetClicked = (res = '', mode = '', item = { _id: '' }) => () => this.setState({ clicked: { res, mode, item } })

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

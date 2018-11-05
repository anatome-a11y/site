import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import 'antd/dist/antd.css';
import { Menu, Icon, message, Button, Divider } from 'antd';
import { injectGlobal } from 'styled-components';

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {withRouter} from 'react-router'

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const { Item } = Menu;

class Content extends React.Component{
    state = {
        isLogged: true,
        loading: true,
        zoom: 16,
		title: '',
        erros: {
            campos: [],
            msgs: []
        }		
    }

    render(){

		const {isLogged, zoom, loading, erros} = this.state;
		const {history, location} = this.props;

        return (
            <div>
				<div className='shadow2'>
					<div style={{ backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 24, paddingLeft: 24, borderBottom: '1px solid #e8e8e8' }}>
						<div>Acessibilidade</div>
						<div>
							<Button type='primary' ghost shape='circle' icon='bulb' style={{ margin: '4px 4px' }} />
							<Divider type='vertical' />
							<Button type='primary' ghost disabled={zoom == 16} onClick={this.onZoomOut} shape='circle' icon='minus' style={{ margin: '4px 4px' }} />
							<Button type='primary' ghost disabled={zoom == 25} onClick={this.onZoomIn} shape='circle' icon='plus' style={{ margin: '4px 4px' }} />
						</div>
					</div>
					<Menu
						onClick={() => history.push('/')}
						mode="horizontal"
						selectedKeys={location.pathname == '/'? ['inicio'] : []}
					>
						<Item key="inicio" style={{fontSize: '1rem'}}><Icon type="home" />Página inicial</Item>
						{/* <SubMenu style={{ float: 'right' }} title={<span><Icon type="user" />Márcia V.</span>}>
							<MenuItemGroup title="Sua conta">
								<Item key="setting:1">Preferências</Item>
								<Item key="setting:2">Editar perfil</Item>
							</MenuItemGroup>
							<MenuItemGroup title="Sessão">
								<Item key="setting:3">Sair</Item>
							</MenuItemGroup>
						</SubMenu> */}
					</Menu>
				</div>
                {/* <h1 style={{textAlign: 'center',marginBottom: 0,marginTop: 18,fontSize: '1.5rem'}}>{title}</h1> */}
                {isLogged ? <App history={history} erros={erros} onOpenSnackbar={this.onOpenSnackbar} onSetAppState={this.onSetAppState} loading={loading} isLogged={isLogged} /> : null}                
            </div>
        )
    }

	onZoomIn = () => {
		const {zoom} = this.state;		
		zoom < 25 && this.setState({zoom: zoom + 1}, () => {
			injectGlobal`
			html{
				font-size: ${this.state.zoom}px !important
			}
			.randomico {
				zoom: ${Math.random()};
			}			
			`			
		})
	}

	onZoomOut = () => {
		const {zoom} = this.state;
		zoom > 16 && this.setState({zoom: zoom - 1}, () => {
			injectGlobal`
			html{
				font-size: ${this.state.zoom}px !important
			}
			.randomico {
				zoom: ${Math.random()};
			}			
			`			
		})
    } 

	onOpenSnackbar = (msg, type = 'error') => {
		message[type](msg);
	};    
    
    onSetAppState = state => this.setState(state)
}

const RoutingContent = withRouter(Content)

const Root = props => (
	<Router>
		<RoutingContent/>
	</Router>
)

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();

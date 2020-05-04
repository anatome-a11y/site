import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import 'antd/dist/antd.css';
import { Menu, Icon, message, Button, Divider, Select } from 'antd';
import { injectGlobal } from 'styled-components';

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { withRouter } from 'react-router'

import { version } from '../package.json'
import 'intl'
import 'intl/locale-data/jsonp/pt-BR.js'
import { IntlProvider } from 'react-intl'
import { flattenMessages, messages } from './messages'
import { withI18n } from './messages/withI18n';


class Content extends React.Component {
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


	componentWillReceiveProps(next) {
		if (this.props.location.pathname !== next.location.pathname) {
			window.scrollTo(0, 0);
		}
	}

	render() {

		const { isLogged, zoom, loading, erros } = this.state;
		const { history, i18n, lang, onChangeLang } = this.props;

		return (
			<div>
				<div className='shadow2'>
					<div style={{ backgroundColor: '#e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 24, paddingLeft: 24, borderBottom: '1px solid #d9d9d9' }}>
						<div></div>
						<div>
							<Select style={{minWidth: 100}} value={lang} onChange={onChangeLang}>
								<Select.Option value="pt-BR">PT-BR</Select.Option>
								<Select.Option value="en">EN</Select.Option>
							</Select>
							<Divider type='vertical' />
							<Button type='primary' ghost shape='circle' icon='bulb' style={{ margin: '4px 4px' }} />
							<Divider type='vertical' />
							<Button type='primary' ghost disabled={zoom == 16} onClick={this.onZoomOut} style={{ margin: '4px 4px', width: 35, padding: 0 }} >A-</Button>
							<Button type='primary' ghost disabled={zoom == 25} onClick={this.onZoomIn} style={{ margin: '4px 4px', width: 35, padding: 0 }} >A+</Button>
						</div>
					</div>
					<div id='anatome-title-bar' onClick={() => history.push('/')}>
						<div id='anatome-title' style={{ display: 'flex', flexDirection: 'column', padding: 5, paddingLeft: 24 }}>
							<span style={{ color: '#1890ff' }}>Anatome-AT<span id='anatome-version'>v.{version}</span></span>
							<span style={{ opacity: 0.75, marginTop: -10 }}> {i18n('layout.subtitle')}</span>
						</div>
					</div>
				</div>
				{/* <h1 style={{textAlign: 'center',marginBottom: 0,marginTop: 18,fontSize: '1.5rem'}}>{title}</h1> */}
				{isLogged ? <App history={history} erros={erros} onOpenSnackbar={this.onOpenSnackbar} onSetAppState={this.onSetAppState} loading={loading} isLogged={isLogged} /> : null}
			</div>
		)
	}

	onZoomIn = () => {
		const { zoom } = this.state;
		zoom < 25 && this.setState({ zoom: zoom + 1 }, () => {
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
		const { zoom } = this.state;
		zoom > 16 && this.setState({ zoom: zoom - 1 }, () => {
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

const RoutingContent = withRouter(withI18n(Content))

const langs = []

class Root extends React.Component {
	state = {
		lang: 'en'
	}

	onChangeLang = (lang) => this.setState({lang})

	render() {
		return (
			<IntlProvider locale="pt-BR" defaultLocale="pt-BR" messages={flattenMessages(messages[this.state.lang])}>
				<Router>
					<RoutingContent lang={this.state.lang} onChangeLang={this.onChangeLang} />
				</Router>
			</IntlProvider>
		)
	}
}

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();

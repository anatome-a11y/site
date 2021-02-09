const post = (path, body, reject, resolve) => {
	if(body == null){
		reject({
			code: 400,
			data: 'Corpo da mensagem não informado'
		})
	}else{
		const { v4: uuidv4 } = require('uuid');
		const _id = uuidv4();		
		const previous = localStorage.getItem(path);
		const previousJS = previous == null ? [] : JSON.parse(previous);
		const postData = [...previousJS, {...body, _id}]
		localStorage.setItem(path, JSON.stringify(postData))
		resolve({
			code: 200,
			data: postData					
		});
	}	
}


const put = (path, body, _id, reject, resolve) => {
	if(body == null){
		reject({
			code: 400,
			data: 'Corpo da mensagem não informado'
		})
	}else{
		const previous = localStorage.getItem(path);
		const previousJS = JSON.parse(previous);
		const idx = previousJS.findIndex(pj => pj._id == _id);
		const putData = [...previousJS.slice(0, idx), {...body, _id}, ...previousJS.slice(idx+1)];
		localStorage.setItem(path, JSON.stringify(putData))
		resolve({
			code: 200,
			data: putData					
		});
	}	
}


const del = (path, _id, reject, resolve) => {
	const previous = localStorage.getItem(path);
	const previousJS = JSON.parse(previous);
	const idx = previousJS.findIndex(pj => pj._id == _id);	
	if(idx == -1){
		reject({
			code: 400,
			data: 'O registro a ser excluído não pôde ser encontrado'
		})
	}else{
		const delData = [...previousJS.slice(0, idx), ...previousJS.slice(idx+1)];
		localStorage.setItem(path, JSON.stringify(delData))
		resolve({
			code: 200,
			data: delData					
		});
	}	
}

const get = (path, _id, reject, resolve) => {
	const getData = localStorage.getItem(path);
	if(getData == null){
		resolve({
			code: 400,
			data: 'Nenhum recurso foi encontrado'
		});					
	}else{					
		resolve({
			code: 200,
			data: _id == null ? JSON.parse(getData) : JSON.parse(getData).find(j => j._id == _id)
		});						
	}	
}




const request = (path, method = 'GET', body = null, _id =  null) => {
	console.log(path, method, body)
	return new Promise((resolve, reject) => {
		switch(method){
			case 'POST': post(path, body, reject, resolve); break;
			case 'PUT': put(path, body, _id, reject, resolve); break;				
			case 'DELETE': del(path, _id, reject, resolve); break;				
			case 'GET': get(path, _id, reject, resolve); break;
			default: reject({
				code: 400,
				data: 'Método HTTP inválido'
			})
		}
	})
}



export default request;
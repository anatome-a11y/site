const post = (path, body, reject, resolve) => {
	if(body == null){
		reject({
			code: 400,
			data: 'Corpo da mensagem não informado'
		})
	}else{
		const uuidv4 = require('uuid/v4');
		const id = uuidv4();		
		const previous = localStorage.getItem(path);
		const previousJS = previous == null ? [] : JSON.parse(previous);
		const postData = [...previousJS, {...body, id}]
		localStorage.setItem(path, JSON.stringify(postData))
		resolve({
			code: 200,
			data: postData					
		});
	}	
}


const put = (path, body, id, reject, resolve) => {
	if(body == null){
		reject({
			code: 400,
			data: 'Corpo da mensagem não informado'
		})
	}else{
		const previous = localStorage.getItem(path);
		const previousJS = JSON.parse(previous);
		const idx = previousJS.findIndex(pj => pj.id == id);
		const putData = [...previousJS.slice(0, idx), {...body, id}, ...previousJS.slice(idx+1)];
		localStorage.setItem(path, JSON.stringify(putData))
		resolve({
			code: 200,
			data: putData					
		});
	}	
}


const del = (path, id, reject, resolve) => {
	const previous = localStorage.getItem(path);
	const previousJS = JSON.parse(previous);
	const idx = previousJS.findIndex(pj => pj.id == id);	
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

const get = (path, id, reject, resolve) => {
	const getData = localStorage.getItem(path);
	if(getData == null){
		resolve({
			code: 400,
			data: 'Nenhum recurso foi encontrado'
		});					
	}else{					
		resolve({
			code: 200,
			data: id == null ? JSON.parse(getData) : JSON.parse(getData).find(j => j.id == id)
		});						
	}	
}




const request = (path, method = 'GET', body = null, id =  null) => {
	console.log(path, method, body)
	return new Promise((resolve, reject) => {
		switch(method){
			case 'POST': post(path, body, reject, resolve); break;
			case 'PUT': put(path, body, id, reject, resolve); break;				
			case 'DELETE': del(path, id, reject, resolve); break;				
			case 'GET': get(path, id, reject, resolve); break;
			default: reject({
				code: 400,
				data: 'Método HTTP inválido'
			})
		}
	})
}



export default request;
export const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

export const norm = str => str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()

export const filter = (input, option) => norm(option.props.children).indexOf(norm(input)) >= 0

const apiUrl = 'https://anatome-api.onrender.com';
// export const apiUrl = 'http://localhost:8080';

export const mediaUrl = url => (
  typeof url === 'string'
    ? url.replace(/^http:\/\/(anatome-api\.onrender\.com)/i, 'https://$1')
    : url
);

export const request = (path, options = {}) => fetch(`${apiUrl}/${path}`, {headers, ...options}).then(r => r.json())

export const uploadMedia = (file, onProgress) => new Promise((resolve, reject) => {
  const body = new FormData();
  body.append('file', file, file.name);
  const xhr = new XMLHttpRequest();
  xhr.open('POST', `${apiUrl}/midia`);
  xhr.upload.onprogress = event => {
    if (!onProgress || !event.lengthComputable || !event.total) return;
    onProgress(Math.min(99, Math.round(event.loaded / event.total * 100)));
  };
  xhr.upload.onload = () => {
    if (onProgress) onProgress(100);
  };
  xhr.onload = () => {
    let result = {};
    try {
      result = JSON.parse(xhr.responseText || '{}');
    } catch (e) {
      result = {};
    }
    if (xhr.status < 200 || xhr.status >= 300) {
      reject(new Error(result.error || 'Não foi possível enviar o arquivo.'));
      return;
    }
    resolve({
      ...result.data,
      url: mediaUrl(result.data && result.data.url),
    });
  };
  xhr.onerror = () => reject(new Error('Não foi possível enviar o arquivo.'));
  xhr.send(body);
});

export const textoEnvio = progresso => (
  progresso >= 100 ? 'Salvando...' : `Enviando ${Math.max(0, progresso || 0)}%`
);

export const isEmpty = (prop) => (
    prop === null ||
    prop === false ||
    prop === undefined ||
    (prop.hasOwnProperty('length') && prop.length === 0) ||
    (prop.hasOwnProperty('size') && prop.size === 0) ||
    (prop.constructor === Object && Object.keys(prop).length === 0)
  );
  
  
  /**
  *  Monad Maybe para o tratamento de dados incertos
  **/
  export const Maybe = function(value) {
    let Nothing = {
      bind: function(fn) {
        return this;
      },
      isNothing: function() {
        return true;
      },
      val: function() {
        throw new Error("cannot call val() nothing");
      },
      maybe: function(def, fn) {
        return def;
      }
    };
  
    let Something = function(value) {
      return {
        bind: function(fn) {
          return Maybe(fn.call(this, value));
        },
        isNothing: function() {
          return false;
        },
        val: function() {
          return value;
        },
        maybe: function(def, fn) {
          return fn.call(this, value);
        }
      };
    };
  
    if (isEmpty(value))
      return Nothing;
  
    return Something(value);
  };

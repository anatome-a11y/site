export const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

export const norm = str => str.normalize('NFD').replace(/[\u0300-\u036f]/g, "")

export const filter = (input, option) => norm(option.props.children).toLowerCase().indexOf(norm(input).toLowerCase()) >= 0

export const request = (path, options = {}) => fetch('https://frozen-thicket-97625.herokuapp.com/' + path, {headers, ...options}).then(r => r.json())

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
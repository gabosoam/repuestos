var connection = require('../config/connection.js');


module.exports = {

    read: function (callback) {
        connection.query('SELECT  * FROM v_modelview ORDER BY description;', function (error, results, fields) {
            if (error) {
                console.log(error);
                callback('error en la consulta: ' + error, null);
            } else {
            
                callback(null, results);
            }
        });
    },

    readmodel: function (callback) {
        connection.query('SELECT  * FROM v_model;', function (error, results, fields) {
            if (error) {
                console.log(error);
                callback('error en la consulta: ' + error, null);
            } else {
           
                callback(null, results);
            }
        });
    },

    readOne: function (code, callback) {
        connection.query('SELECT  * FROM model where id=?', code, function (error, results, fields) {
            if (error) {
                callback('error en la consulta: ' + error, null);
            } else {
                callback(null, results);
            }
        });
    },

    readBil: function (callback) {

        connection.query('SELECT * FROM v_modelbill;', function (error, results, fields) {
            if (error) {
                callback('error en la consulta: ' + error, null);
            } else {
                callback(null, results);
            }
        });
    },

    read2: function (callback) {
        connection.query('SELECT  * FROM v_model;', function (error, results, fields) {
            if (error) {
                callback('error en la consulta: ' + error, null);
            } else {
                callback(null, results);
            }
        });
    },

    update: function (datos, callback) {
        console.log(datos.brand)
      
        connection.query('UPDATE model SET code=?, description=?,  brand=?, category=? WHERE (id=?) LIMIT 1', [datos.code.toUpperCase(), datos.description.toUpperCase(),datos.brand, datos.category, datos.id], function (error, results, fields) {
            if (error) {
                console.log(error);
                callback('error en la consulta: ' + error, null);
            } else {
                callback(null, results);
            }
        });
    },

    delete: function (datos, callback) {
        connection.query('DELETE FROM model WHERE id=?', [datos.id], function (error, results, fields) {//
            if (error) {
                callback('error en la consulta: ' + error, null);
            } else {
                callback(null, results);
            }
        });
    },


    create: function (datos, callback) {
        connection.query('INSERT INTO model (code, description, category, brand) VALUES (?, ?, ?, ?)', [datos.code.toUpperCase(), datos.description.toUpperCase(), datos.category, datos.brand], function (error, results, fields) {
            if (error) {
                console.log(error)
                callback('error en la consulta: ' + error, null);
            } else {
                callback(null, results);
            }
        });
    },




}

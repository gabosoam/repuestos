
var connection = require('../config/connection.js');

module.exports = {
    searchModel: function (data, callback) {
        connection.query({
            sql: 'SELECT * FROM model WHERE code=? ',
            values: [data.data]
        }, function (err, results, fields) {
            if (err) {
                callback(false);
            } else {
           
                if (results.length == 0) {
                    callback(true);
                } else {
                    callback(false);
                }

            }
        })

    },
    insertBarcode: function(data, callback) {
        
      
        var variant,location,barcode, code;
        connection.query({
            sql: 'SELECT * FROM model where code=?',
            values: [data.variant]
        },function(err,results, fields) {
            if (err) {
                callback(err)
            } else {
                if (results[0]) {
                    variant = results[0].id;
                    connection.query({
                        sql: 'SELECT * FROM location WHERE name=?',
                        values: [data.location]
                    },function(err, results, fields) {
                        if (err) {
                            callback(err);
                        } else {
                            if (results[0]) {
                                location = results[0].id;
                                
                                connection.query({
                                    sql:'SELECT * from product WHERE barcode=? AND model=?',
                                    values: [data.barcode, variant]
                                },function(err, results, fields) {
                                    if (err) {
                                        callback(err)
                                    } else {
                                        if (results[0]) {

                                            
                                    
                                            barcode= results[0].barcode;
                                            code= results[0].id

                                            connection.query({
                                                sql:'SELECT * FROM billdetail INNER JOIN product ON billdetail.product = product.id WHERE bill=? AND product=? AND product.barcode!=? AND product.barcode!=?',
                                                values: [data.bill, code, 'S/N', 'S/S']
                                            }, function(err, results, fields) {
                                                if (err) {
                                                    callback(err);
                                                } else {
                                                    if (results[0]) {
                                                        callback('El producto ya existe en el ingreso actual');
                                                    }else{
                                                        connection.query({
                                                            sql: 'INSERT INTO `billdetail` (`bill`, `product`, `location`, `comment`, `fdr`, `cso`, `wbs`) VALUES (?,?,?,?,?,?,?)',
                                                            values: [data.bill,code,location, data.observation,data.fdr, data.cso, data.wbs]
                                                        }, function(err, results, fields) {
                                                            if (err) {
                                                                console.log(err)
                                                                callback(err);
                                                            } else {
                                                                if (results.affectedRows>0) {
                                                                    callback('Guardado')
                                                                } else {
                                                                    callback('Existió un error inesperado 2');
                                                                }
                                                            }
                                                        })
            
                                                        
                                                    }
                                                }
                                            })

                                       

                                            
                                        } else {
                                            connection.query({
                                                sql: 'INSERT INTO `product` (`barcode`, `model`) VALUES (?,?)',
                                                values: [data.barcode.toUpperCase(), variant]
                                            },function(err,results, fields) {
                                                if (err) {
                                                    console.log(err);
                                                    callback(err)
                                                } else {
                                                    if (results.affectedRows>0) {

                                                     
                                                        code= results.insertId

                                                        connection.query({
                                                            sql:'SELECT * FROM billdetail INNER JOIN product ON billdetail.product = product.id WHERE bill=? AND product=? AND product.barcode!=? AND product.barcode!=?',
                                                            values: [data.bill, code, 'S/N', 'S/S']
                                                        }, function(err, results, fields) {
                                                            if (err) {
                                                                callback('Existió un error inesperado');
                                                            } else {
                                                                if (results[0]) {
                                                                    callback('El producto ya existe en el ingreso actual');
                                                                }else{
                                                                    connection.query({
                                                                        sql: 'INSERT INTO `billdetail` (`bill`, `product`, `location`, `comment`, `fdr`, `cso`, `wbs`) VALUES (?,?,?,?,?,?,?)',
                                                                        values: [data.bill,code,location, data.observation, data.fdr, data.cso, data.wbs]
                                                                    }, function(err, results, fields) {
                                                                        if (err) {
                                                                            console.log(err)
                                                                            callback('Existió un error inesperado 1');
                                                                        } else {
                                                                            if (results.affectedRows>0) {
                                                                                callback('Guardado')
                                                                            } else {
                                                                                callback('Existió un error inesperado 2');
                                                                            }
                                                                        }
                                                                    })
                                                                    
                                                                }
                                                            }
                                                        })

                                                     
                                                    } else {
                                                        callback('Existió un error inesperado 2');
                                                    }
                                               
                                              
                                                }
                                            })
                                        }
                                    }
                                })




                            } else {
                                callback('NO EXISTE EL ALMACEN '+data.location);
                            }
                        }
                    })








                } else {
                    callback('NO EXISTE EL CÓDIGO '+data.variant);
                }
            }
        })
    }
}


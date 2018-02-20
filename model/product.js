var connection = require('../config/connection.js');


module.exports = {

    read: function (callback) {
        connection.query('SELECT  * FROM  v_product', function (error, results, fields) {
            if (error) {

                callback('error en la consulta: ' + error, null);
            } else {

                callback(null, results);

            }
        });
    },

    searchBarcode: function (barcode, callback) {
        connection.query('SELECT  id FROM product WHERE barcode=?;', barcode, function (error, results, fields) {
            if (error) {
                callback(error, null);
            } else {

                if (results.length == 0) {
                    callback(false);
                } else {
                    callback(true);
                }

            }
        });
    },

    searchBarcodes: function (model, callback) {
        connection.query('SELECT  * FROM product WHERE model=?;', model, function (error, results, fields) {
            if (error) {
                callback(error, null);
            } else {

                if (results.length == 0) {
                    callback(false);
                } else {
                    callback(results);
                }

            }
        });
    },

    updateFromBill: function (data, cb) {
        connection.query({
            sql: 'UPDATE `product` SET `location`=?, `observation`=? WHERE (`id`=?)',
            values: [data.idlocation, data.observation.toUpperCase(), data.id]
        }, function (err, results, fields) {
            if (err) {

                cb(err, null);
            } else {
                cb(null, results)
            }
        })

    },

    readBill: function (bill, callback) {
        connection.query('Select * from v_billdetail where bill=?', bill, function (error, results, fields) {
            if (error) {

                callback('error en la consulta: ' + error, null);
            } else {

                callback(null, results);

            }
        });
    },

    readBillPrice: function (bill, callback) {
        connection.query('CALL p_billprice(?)', bill, function (error, results, fields) {
            if (error) {

                callback('error en la consulta: ' + error, null);
            } else {
                callback(null, results[0]);

            }
        });
    },

    update: function (datos, callback) {

        connection.query('UPDATE product SET barcode=?,model=? WHERE (id=?) LIMIT 1', [datos.barcode.toUpperCase(), datos.code, datos.id], function (error, results, fields) {//
            if (error) {
                console.log(error)
                callback('error en la consulta: ' + error, null);
            } else {
                callback(null, results);

            }
        });
    },


    delete: function (datos, callback) {
        connection.query('DELETE FROM product WHERE id=?', [datos.id], function (error, results, fields) {//
            if (error) {
                callback('error en la consulta: ' + error, null);
            } else {
                callback(null, results);

            }
        });
    },

    delete2: function (datos, callback) {
        connection.query('DELETE FROM billdetail WHERE id=?', [datos.id], function (error, results, fields) {//
            if (error) {
                callback('error en la consulta: ' + error, null);
            } else {
                callback(null, results);

            }
        });
    },

    create: function (datos, callback) {
        connection.query('INSERT INTO product (barcode,model) VALUES (?,?)', [datos.barcode.toUpperCase(), datos.code], function (error, results, fields) {
            if (error) {

                callback(error, null)
            } else {
                callback(null, results)
            }
        });
    },

    create2: function (data, callback) {



        if (!data.fdr) { data.fdr = '' }
        if (!data.wbs) { data.wbs = '' }
        if (!data.cso) { data.cso = '' }
        if (!data.comment) { data.comment = '' }

        console.log(data)




        connection.query({
            sql: 'SELECT * FROM product WHERE barcode = ? and model =?',
            timeout: 40000, // 40s
            values: [data.barcode_input, data.code]
        }, function (error, results, fields) {
            if (error) {

                callback('existió un error', null);
            } else {

                if (results[0]) {

                    var sql = 'INSERT INTO `billdetail` (`bill`, `product`, `fdr`, `cso`, `wbs`, `location`, `comment`) VALUES';

                    for (var i = 0; i < data.cant; i++) {
                        sql = sql + " ('" + data.bill + "','" + results[0].id + "','" + data.fdr.toUpperCase() + "','" + data.cso.toUpperCase() + "','" + data.wbs.toUpperCase() + "','" + data.location + "','" + data.comment.toUpperCase() + "'),"
                    }



                    connection.query({
                        sql: sql.substr(0, (sql.length - 1)),
                        timeout: 40000, // 40s
                        values: [data.bill, results[0].id, data.fdr.toUpperCase(), data.cso.toUpperCase(), data.wbs.toUpperCase(), data.location, data.comment.toUpperCase()]
                    }, function (error, results, fields) {
                        if (error) {
                            console.log(error)
                            callback('existió un error', null);
                        } else {
                            callback(null, 'Todo salió bien')

                        }
                    });




                } else {

                    connection.query({
                        sql: 'INSERT INTO `product` (`barcode`, `model`) VALUES (?,?)',
                        timeout: 40000, // 40s
                        values: [data.barcode_input.toUpperCase(), data.code]
                    }, function (error, results, fields) {
                        if (error) {
                            console.log(error)
                            callback('existió un error', null);
                        } else {

                            if (results.affectedRows == 1) {

                                var sql = 'INSERT INTO `billdetail` (`bill`, `product`, `fdr`, `cso`, `wbs`, `location`, `comment`) VALUES';

                                for (var i = 0; i < data.cant; i++) {
                                    sql = sql + " ('" + data.bill + "','" + results.insertId + "','" + data.fdr.toUpperCase() + "','" + data.cso.toUpperCase() + "','" + data.wbs.toUpperCase() + "','" + data.location + "','" + data.comment.toUpperCase() + "'),"
                                }

                        
                                    connection.query({
                                        sql: sql.substr(0, (sql.length - 1)),
                                        timeout: 40000, // 40s
                                    }, function (error, results, fields) {
                                        if (error) {
                                            console.log(error)
                                            callback('existió un error', null);
                                        } else {

                                            callback(null, 'Todo salió bien')

                                        }
                                    });


                          




                            } else {
                                callback('existió un error', null);
                            }



                        }
                    });

                }





            }
        });
    },



    createSalida: function (data, callback) {

        if (!data.fdr) { data.fdr = '' }
        if (!data.wbs) { data.wbs = '' }
        if (!data.cso) { data.cso = '' }
        if (!data.comment) { data.comment = '' }

        connection.query({
            sql: 'SELECT * FROM product WHERE barcode = ? and model =?',
            timeout: 40000, // 40s
            values: [data.barcode_input, data.code]
        }, function (error, results, fields) {
            if (error) {

                callback('existió un error', null);
            } else {

                if (results[0]) {

                    var sql = 'INSERT INTO `billdetail` (`bill`, `product`, `fdr`, `cso`, `wbs`, `comment`) VALUES';

                    for (var i = 0; i < data.cant; i++) {
                        sql = sql + " ('" + data.bill + "','" + results[0].id + "','" + data.fdr.toUpperCase() + "','" + data.cso.toUpperCase() + "','" + data.wbs.toUpperCase() + "','" + data.comment.toUpperCase() + "'),"
                    }

                    connection.query({
                        sql: sql.substr(0, (sql.length - 1)),
                        timeout: 40000, // 40s
                    }, function (error, results, fields) {
                        if (error) {
                            console.log(error)
                            callback('existió un error', null);
                        } else {
                            callback(null, 'Todo salió bien')

                        }
                    });

                } else {
                    connection.query({
                        sql: 'INSERT INTO `product` (`barcode`, `model`) VALUES (?,?)',
                        timeout: 40000, // 40s
                        values: [data.barcode_input.toUpperCase(), data.code]
                    }, function (error, results, fields) {
                        if (error) {
                            console.log(error)
                            callback('existió un error', null);
                        } else {

                            if (results.affectedRows == 1) {

                                var sql = 'INSERT INTO `billdetail` (`bill`, `product`, `fdr`, `cso`, `wbs`, `comment`) VALUES';

                                for (var i = 0; i < data.cant; i++) {
                                    sql = sql + " ('" + data.bill + "','" + results.insertId + "','" + data.fdr.toUpperCase() + "','" + data.cso.toUpperCase() + "','" + data.wbs.toUpperCase() + "','" + data.comment.toUpperCase() + "'),"
                                }

                                connection.query({
                                    sql: sql.substr(0, (sql.length - 1)),
                                    timeout: 40000, // 40s

                                }, function (error, results, fields) {
                                    if (error) {
                                        console.log(error)
                                        callback('existió un error', null);
                                    } else {

                                        callback(null, 'Todo salió bien')

                                    }
                                });

                            } else {
                                callback('existió un error', null);
                            }

                        }
                    });

                }





            }
        });
    },


    update2: function (data, callback) {



        connection.query({
            sql: 'SELECT * FROM product WHERE barcode = ? and model =?',
            timeout: 40000, // 40s
            values: [data.barcode, data.code]
        }, function (error, results, fields) {
            if (error) {
                console.log(error);
                callback('existió un error', null);
            } else {
                if (results[0]) {



                    connection.query({
                        sql: 'UPDATE `billdetail` SET `bill`=?, `product`=?, `fdr`=?, `cso`=?, `wbs`=?, `comment`=? WHERE (`id`=?) LIMIT 1',
                        timeout: 40000, // 40s
                        values: [data.bill, results[0].id, data.fdr.toUpperCase(), data.cso.toUpperCase(), data.wbs.toUpperCase(), data.comment.toUpperCase(), data.id]
                    }, function (error, results, fields) {
                        if (error) {
                            console.log(error)
                            callback('existió un error', null);
                        } else {
                            console.log(results)
                            callback(null, results)

                        }
                    });




                } else {
                    connection.query({
                        sql: 'INSERT INTO `product` (`barcode`, `model`) VALUES (?,?)',
                        timeout: 40000, // 40s
                        values: [data.barcode.toUpperCase(), data.code]
                    }, function (error, results, fields) {
                        if (error) {
                            console.log(error)
                            callback('existió un error', null);
                        } else {

                            if (results.affectedRows == 1) {

                                connection.query({
                                    sql: 'UPDATE `billdetail` SET `bill`=?, `product`=?, `fdr`=?, `cso`=?, `wbs`=?, `comment`=? WHERE (`id`=?) LIMIT 1',
                                    timeout: 40000, // 40s
                                    values: [data.bill, results.insertId, data.fdr.toUpperCase(), data.cso.toUpperCase(), data.wbs.toUpperCase(), data.comment.toUpperCase(), data.id]
                                }, function (error, results, fields) {
                                    if (error) {
                                        console.log(error)
                                        callback('existió un error', null);
                                    } else {

                                        callback(null, results)

                                    }
                                });



                            } else {
                                callback('existió un error', null);
                            }



                        }
                    });
                }

            }
        });
    },


}



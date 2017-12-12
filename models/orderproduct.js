/**
 * Created by Carlos on 11/4/15.
 */
/* Object/Relational mapping for instances of the Users class.
 - classes correspond to tables
 - instances correspond to rows
 - fields correspond to columns
 In other words, this code defines how a row in the postgres order table
 maps to the JS Order object.
 */
module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Orderproduct", {
            qty: {type: DataTypes.INTEGER, allowNull: false},
            priceTotal: {type: DataTypes.DECIMAL(10, 2), allowNull: false},
            productID: {type: DataTypes.INTEGER, allowNull: false},
            orderID: {type: DataTypes.INTEGER, allowNull: false}
        },
        {
            classMethods: {

                addProductToOrder: function (req, order, callback) {
                    var _Orderproduct = this;

                    global.db.Product.productPriceById(req.params.id, function (price) {
                        // Calculate qty x price = total price
                        var totalPrice = parseFloat(price.price) * parseFloat(req.body.qty);

                        var newOrderproduct = _Orderproduct.build({
                            qty: req.body.qty,
                            priceTotal: totalPrice,
                            productID: req.params.id,
                            orderID: order.id
                        });

                        newOrderproduct.save().then(function (savedOrderproduct) {
                            callback(savedOrderproduct);
                        }).error(function (error) {

                            // Do something with error
                            console.log("Error!, we must do something: 'orderproduct.js, line 40");
                        });

                    });

                },

                countProductsInOrder: function (orderID, callback) {
                    var _Orderproduct = this;

                    _Orderproduct.sum('qty', {where: {orderID: orderID}}).then(function (sum) {
                        // return the sum of items for the order
                        callback(sum);
                    })
                },

                getProductsFromOrder: function (orderID, callback) {
                    var _Orderproduct = this;

                    // Get all products Ids from OrderProducts
                    _Orderproduct.findAll({
                        where: {orderID: orderID},
                        order: [['productID', 'ASC']]
                    }).then(function (orderProducts) {

                        // Loop thru products to get IDs and store them in array
                        var idsArray = [];
                        for (var productID in orderProducts) {
                            idsArray.push(orderProducts[productID].productID);
                        }

                        // Get all products listed in the Products ids Array
                        global.db.Product.getProductsByIDsArray(idsArray, function (products) {
                            callback(products, orderProducts);
                        });
                    })

                },

                getProductsByOrderID: function(orderIDArray, callback){
                    var _OrderProduct=this;
                    // Get all products Ids from OrderProducts
                    //loop through to get product data for each orderID
                    var productArray=[]; // to store returned Products
                    var orderProductArray=[]; // to store returned orderProducts
                   // for(var i=0;i<orderIDArray.length;i++) {


                        _OrderProduct.findAll({
                            where: {orderID: orderIDArray},
                            order: [['productID', 'ASC']]
                        }).then(function (orderProducts) {

                            // Loop thru products to get IDs and store them in array
                            var idsArray = [];
                            for (var productID in orderProducts) {
                                orderProductArray.push(orderProducts[productID]);
                                idsArray.push(orderProducts[productID].productID);
                            }

                            // Get all products listed in the Products ids Array
                            global.db.Product.getProductsByIDsArray(idsArray, function (products) {


                                callback(products, orderProductArray);
                            });

                        })

                   // } end of for loop

                    },

                checkProductInCart: function (pendingOrderId, productId, callback) {
                    var _Orderproduct = this;

                    _Orderproduct.findOne({
                        where: {
                            orderID: pendingOrderId,
                            productID: productId
                        }
                    }).then(function (productInCart) {
                        callback(productInCart);
                    });
                },

                updateProductQtyOnOrder: function (productID, productQty, pendingOrderID, orderProductFound, callback) {
                    var _Orderproduct = this;
                    var newQty = parseInt(productQty) + parseInt(orderProductFound.qty);
                    var productPrice = (parseInt(orderProductFound.priceTotal)) / (parseInt(orderProductFound.qty));
                    var newPriceTotal = parseFloat(newQty * productPrice);

                    // Update quantity
                    _Orderproduct.update(
                        {qty: newQty, priceTotal: newPriceTotal} /* set attributes' value */,
                        {where: {productID: productID, orderID: pendingOrderID}} /* where criteria */
                    ).then(function (affectedRows) {
                            callback(affectedRows);
                    });
                },

                deleteOrderProductById: function (orderProductId, callback) {
                    var _Orderproduct = this;

                    _Orderproduct.destroy({where: {id: orderProductId}}).then(function (linesDeleted) {
                        callback(linesDeleted);
                    });
                }
            }
        });
};
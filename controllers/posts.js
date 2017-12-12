/**
 * Created by Carlos on 11/7/15.
 */
var Help = require('../helper/help.js')
    , fs = require('fs')
    , path = require('path')
    , AWS = require('aws-sdk')
    , stripe = require('stripe')(process.env.STRIPE_API_KEY);

module.exports = function (app, db, passport) {

    /* Routes for APIs Calls
     =========================*/
    app.post('/signup', function(req, res){

        global.db.User.createUser(req, function(savedUser) {
            if(savedUser) {
                // User created, send 'OK' response and a JSON object of the new User.
                res.status(200).json(savedUser);
            }
        });

    });

    // '/checkuser' - Check if users exists
    app.post('/checkuser', function(req, res) {
        // Query the database to verify if user exists
        global.db.User.userExist(req, function(exist){
            if(exist) res.send({available:false});
            else res.send({available:true});
        });
    });

    // '/login' - Handle Login Reguest
    app.post('/login', function(req, res, next) {
        // Use Passport with a 'Local' strategy for Authentication
        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err) }
            if (!user) {
                req.session.messages =  [info.message];
                //return res.redirect('/');
            }

            // Redirect to login after successful authentication
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                req.session.messages = "";
                //return res.redirect('/');
                res.status(200).json({id:1});
            });
        })(req, res, next);

    });

    app.post('/products', function(req, res) {

        global.db.Product.saveProduct(req,function(savedProduct,error){
            if(error){
                console.log("An Error Occurred Saving the product: "+error);
                res.status(300).send('error');
            } else {
                console.log("OK, Returned response");
                res.status(200).json(savedProduct);
            }
        });

    });

    app.post('/delete', function(req, res) {

        global.db.Product.deleteProduct(req,function(result){
            if(result == 'Error'){
                console.log("An Error Occurred Saving the product: "+result);
                res.status(300).send('error');
            } else {
                console.log("OK Object Deleted, Returned response");
                res.status(200).send('success');
            }
        });

    });

    app.post('/getuserinfo', function(req, res) {

        global.db.User.getUser(req, function(user){
            res.send(user);
        })

    });

    app.post('/updateuserinfo', function(req, res) {

        global.db.User.updateuser(req, function(affectedRows){
            res.send(affectedRows);
        })

    });


    app.post('/image', function(req, res) {

        //Create Time Stamp for file naming before uploading: 'timestamp+filename'
        var currentDate = new Date().getTime() / 1000;
        var timeStamp = Math.round(currentDate);

        //AWS Credentials
        AWS.config.update({accessKeyId: process.env.AWS_ID, secretAccessKey: process.env.AWS_SECRET});

        //Set Region.
        AWS.config.update({region:process.env.REGION});

        // Constructs a service interface object with Bucket ecommerce
        var s3 = new AWS.S3({ params: {Bucket:process.env.BUCKET} });

        // Variable for storing 'File Write Stream'
        var fstream;

        // Establish 'temp' directory path and store in var baseUrl
        var baseUrl = path.join(__dirname,'../public/temp/');



        // Get Multi-part file uploaded
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename, mimetype) {

            fstream = fs.createWriteStream(baseUrl+timeStamp + filename);
            file.pipe(fstream);

            // When Uploading and Writing to file is finished
            fstream.on('close', function () {

                // Read the file back to store in Amazon S3 service
                var urlToErase = baseUrl+timeStamp+filename;
                fs.readFile(urlToErase, function (error, data) {
                    if (error) {
                        // Error Occurred Return with message
                        res.send({success:0,error:"error",name:"none"});
                    } else {
                        s3.putObject({Key: 'uploads/' + timeStamp + filename, Body: data}, function (err, data) {
                            if (err) {
                                // Error Occurred Return with message
                                res.send({success: 0, error: "error", name: "none"});
                            }
                            else {
                                // successful response - Now Erase File on Local Directory
                                fs.unlink(baseUrl + timeStamp + filename, function (err) {
                                    if (err) {
                                        // Error Occurred Return with message
                                        res.send({success: 0, error: "error", name: "none"});
                                    } else {
                                        // Send timestamp and filename back to Frontend
                                        var name = timeStamp + filename;
                                        res.send({success: 1, error: "none", name: name});
                                    }
                                });
                            }
                        });
                    }
                });
            });
        });
    });

    app.post('/addtocart/:id', function(req, res) {

        // Query DB to find is this user has a pending order
        global.db.Order.pendingOrderForUser(req, function(pendingOrder, user){

            if(pendingOrder){

                // Check if product already exists in Cart
                global.db.Orderproduct.checkProductInCart(pendingOrder.id, req.params.id, function(orderProductFound){
                    if(orderProductFound){
                        // Update product Qty
                        global.db.Orderproduct.updateProductQtyOnOrder(req.params.id, req.body.qty,pendingOrder.id, orderProductFound, function(affectedRows){
                            if(affectedRows){
                                global.db.Orderproduct.countProductsInOrder(orderProductFound.orderID, function(totalProducts){

                                    res.status(200).send({productAdded:true, qtyInCart:totalProducts});

                                });
                            } else {
                                res.status(300).send({productAdded:false, qtyInCart:false});
                            }
                        });
                    } else {

                        // Add Product to current order
                        global.db.Orderproduct.addProductToOrder(req, pendingOrder, function(orderProduct){
                            if(orderProduct){
                                global.db.Orderproduct.countProductsInOrder(orderProduct.orderID, function(totalProducts){

                                    res.status(200).send({productAdded:true, qtyInCart:totalProducts});

                                });
                            } else {
                                res.status(300).send({productAdded:false, qtyInCart:false});
                            }
                        });

                    }
                });



            } else {
                if(user) {
                    // create order with sent product
                    global.db.Order.createOrderWithProduct(req, function (newOrder) {
                        if (newOrder) {
                            res.status(200).send({productAdded: true, qtyInCart: req.body.qty, userID:user});
                        } else {
                            res.status(200).send({productAdded: false, qtyInCart: false, userID:user});
                        }
                    });
                } else {
                    // User is not Logged In
                    res.status(200).send({productAdded: false, qtyInCart: false, userID:user});
                }

            }
        });


    });

    app.post('/delete/orderproduct/:orderProductId', function (req, res) {

        // Delete order by orderProductID
        global.db.Orderproduct.deleteOrderProductById(req.params.orderProductId, function(linesDeleted){
            res.send({linesDeleted:linesDeleted});
        });
    });

    app.post('/checkout/:orderID', function(req, res){

        //var to store the returned Stripe customer Id
        var customerID = null;
        //var to store the returned Stripe charge Id
        var chargeID = null;
        try {
            userID = req.user.id;
        }
        catch (error) {
            // No user Log-in - Authorization Required code
            res.send({result:false, message:"User Not Logged In"});
        }

        //Verify if Token available. If Yes: Create Stripe Account and Charge Card
        if(req.body.stripeToken){
            //STRIPE CREATE USER
            stripe.customers.create({
                    email: req.user.email,
                    card: req.body.stripeToken,
                    description: req.user.name
                },
                function(err, customer) {
                    if (err) {
                        console.log(err.message);
                        res.send({result:false, message:"Error Creating Customer"});

                        //Send Error by email to Administration
                        sendErrorEmail(err, req.body.stripeToken);

                        return;
                    }
                    //STRIPE CHARGE CARD
                    stripe.charges.create({
                            amount: parseInt(req.body.orderTotal*100),
                            currency: "usd",
                            customer: customer.id,
                            description: "New Product Order"
                        },
                        function(err, charge) {
                            if (err) {
                                console.log(err.message);
                                res.send({result:false, message:"Error CHARGING Customer"});

                                //Send Error by email to Administration
                                sendErrorEmail(err, customer.id);
                                return;
                            }
                            chargeID = charge.id;
                            global.db.Order.checkoutOrderWithChargeID(req,chargeID, function(linesDeleted){
                                res.send({result:true, message:"Checkout Successful"});
                            });

                        }
                    );
                }
            );
        }
    });
};
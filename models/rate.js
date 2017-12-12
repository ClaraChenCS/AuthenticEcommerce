/**
 * Created by Tech-Team on 11/4/15.
 */
/*
 Object/Relational mapping for instances of the Rates class.

 - classes correspond to tables
 - instances correspond to rows
 - fields correspond to columns

 In other words, this code defines how a row in the PostgreSQL "Rates"
 table maps to the JS Order object. Note that we've omitted a fair bit of
 error handling from the classMethods and instanceMethods for simplicity.
 */
var oxr = require('open-exchange-rates');

// Set the Open Exchange ID
oxr.set({
    app_id: process.env.OPEN_EXCHANGE_ID
});

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Rate", {
        date: {type: DataTypes.DATE, allowNull: false},
        INR: {type: DataTypes.DECIMAL(10,2), allowNull: false},
        MMK: {type: DataTypes.DECIMAL(10,2), allowNull: false}
    }, {
        classMethods: {
            getRates: function(successcb, errcb) {
                var _Rates = this;

                // Get latest exchange rates from API; pass to callback function when loaded:
                oxr.latest(function(error) {

                    if ( error ) {
                        // `error` will contain debug info if something went wrong:
                        console.log( 'ERROR loading data from Open Exchange Rates API! Error was:' );
                        console.log( error.toString() );

                        // Fall back to hard-coded rates if there was an error (see readme)
                        return false;
                    }

                    // Rates are  stored in `oxr` object as `oxr.rates`

                    // The timestamp (published time) of the rates is in `oxr.timestamp`:
                    console.log( 'Exchange rates published: ' + (new Date(oxr.timestamp)).toUTCString() );

                    // Conversion Rate console log from USD Base
                    console.log( 'USD -> USD (USA Dollar): ' + oxr.rates.USD );
                    console.log( 'USD -> INR (Indian Rupee): ' + oxr.rates.INR );
                    console.log( 'USD -> MMK (Myanmar Kyat): ' + oxr.rates.MMK );

                    // Store Rates in Database - call sequalize function above
                    var newRates = _Rates.build({
                        date: oxr.timestamp,
                        INR: oxr.rates.INR ,
                        MMK: oxr.rates.MMK
                    });

                    //save() sequalize function - save the oject into database as information
                    newRates.save().then(function (savedData) {
                    }).error(function(error) {
                        console.log("Error Storing Rates Info. Msg: "+error);
                    });

                });

            }
        }
    });
};

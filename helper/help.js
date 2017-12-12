/**
 * Created by Carlos on 11/7/15.
 */
var db = require('../models')
    , https = require('https'); //Pretty multipart form maker

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 * Taken from http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
exports.shuffleArray = function(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};

// Print Method to display Sequelize Query Results
exports.displayResults = function(results) {
    results.forEach(function (c) {
        console.dir(c.toJSON());
    });
    console.log('------------------------------------');
};
/**
 * Created by ClaraChen on 11/23/15.
 */

$(document).ready(function(){

    var getRandom = function(arraySize){
        for(var i=0; i<arrazySize; i++){
            var r = Math.random()* products.length();
            var j=0;
            var indexNumb=[]; //to store random index number for displaying products
            while(indexNumb[j]== r && j<=i){
                r= Math.random()* products.length();
                j++;
            }
            indexNumb[i]=r;
        }
    }
});



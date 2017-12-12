/**
 * Created by ClaraChen on 11/30/15.
 */
/** this will execute when the document is ready and
 * will prevent the default loading the food.html page
 * ========================================================
 */


$(document).ready(function(){

    // Intercept clicks to links in the main page
    $('a').click(function (event) {

        getClickedLink (this,event); // 'this' = clicked link ; 'event'= click
    });

});


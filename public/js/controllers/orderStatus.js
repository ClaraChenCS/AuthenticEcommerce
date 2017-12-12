/**
 * Created by ClaraChen on 11/18/15.
 */
/**
 * The document will excute when it is ready
 -----------------------------------------------*/

$(document).ready(function(){

    /* Need to detach "click" listener, before attaching it again; or we get some elements with duplicated 'Click'
     listeners attached */
    $("a").off("click");

    // Intercept clicks to links in the main page
    $('a').click(function (event) {
        getClickedLink (this,event); // 'this' = clicked link ; 'event'= click
    });
});
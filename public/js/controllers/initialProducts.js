/**
 * Created by Carlos on 11/24/15.
 */
/* Execute When Document is Ready
 ------------------------------------------------ */
$(document).ready(function(){

    /* Need to detach "click" listener, before attaching it again; or we get some elements with duplicated 'Click'
     listeners attached */
    $("a").off("click");

    // Intercept clicks to links on the page
    $("a").click(function (event) {
        getClickedLink (this,event); // 'this' = clicked link ; 'event'= click
    });

});



/*

$("a.view-product, a.view-category").click(function (event) {
    getClickedLink (this,event); // 'this' = clicked link ; 'event'= click
});
    */
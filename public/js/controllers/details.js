/**
 * Created by Carlos on 11/25/15.
 */
/* Execute When Document is Ready
 ------------------------------------------------ */
$(document).ready(function(){

    $("a").off("click");

    // Intercept clicks to links in the main page
    $('a').click(function (event) {
        getClickedLink (this,event); // 'this' = clicked link ; 'event'= click
    });


        //  Code to handle 'Add Product to Cart
    $( "form" ).submit(function( event ) {
        event.preventDefault();

        // Get the form ID
        var formId = "#"+$(this).attr("id");

        // Post the form data to the Server
        $.post($(formId).attr("action"), $(formId).serialize(), function (data) {
            if (data.productAdded) {
                // Show Message to User - Modal Window
                $('#productAddedToShoppingCartAlert').slideDown();

                // Update Shopping Cart Badge
                $('#cartBadge').html(data.qtyInCart);

            }
            else {
                if(!data.userID){
                    // Show Message to User - Modal Window
                    $('#loginForShoppingCartAlert').slideDown();
                }
                // Code to handle error

            }
        });

    });

    // Hide Alert on "x" click
    $("#closeShoppingCartAlert").click(function() {
        // Hide Alert
        $('#productAddedToShoppingCartAlert').fadeOut();
    });

    // Hide Alert on "x" click
    $("#closeLoginForShoppingCartAlert").click(function() {
        // Hide Alert
        $('#loginForShoppingCartAlert').fadeOut();
    });


});

/* Execute When Loading Code
 ------------------------------------------------------------ */

// Hide Shopping Cart Alerts
$('#productAddedToShoppingCartAlert').hide();
$('#loginForShoppingCartAlert').hide();
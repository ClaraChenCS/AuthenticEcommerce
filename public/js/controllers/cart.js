/**
 * Created by Carlos on 11/30/15.
 */
/* Execute When Document is Ready
 ------------------------------------------------ */
$(document).ready(function(){
    // Attache Validation to checkout form
    $("#checkoutForm").validationEngine('attach', {promptPosition : "topRight", scroll: false, showOneMessage:true});

    //  Code to handle 'Delete Product from Cart
    $("a.cart_quantity_delete").click(function (event) {
        event.preventDefault();

        // Get the link URL
        var url = $(this).attr('href');
        var callerElement = $(this).closest("tr");

        // Post the form data to the Server
        $.post(url, function (data) {

            console.log("Lines Deleted", data.linesDeleted);

            if (data.linesDeleted) {
                // Show Message for Cart Update
                $("#loadingMessage").slideDown();
                // Show Message to User - Modal Window
                $('#productRemovedFromShoppingCartAlert').slideDown().delay(2000).queue(function() {
                    // GET qty in shopping cart
                    $.get('/shoppingcart/qtys', function (data) {
                        // Update Shopping Cart Badge
                        $('#cartBadge').html(data.qtyInCart);

                        if(data.qtyInCart < 1){
                            loadInitialProducts ();
                        } else {
                            // Reload Cart, since we need to recalculate totals
                            getClickedLink(null, event, '/cart');
                        }
                    });
                });

                $(callerElement).fadeOut( "slow", function() {
                    $(callerElement).remove();
                });

            }
            else {
                // Error Deleting product - Warn User

            }
        });

    });

    // Hide Alert on "x" click
    $("#closeProductRemovedFromShoppingCartAlert").click(function() {
        // Hide Alert
        $('#productRemovedFromShoppingCartAlert').fadeOut();
    });

    // Send Checkout form to server
    $('#checkoutForm_submit').on('click', function(event) {
        event.preventDefault();

        // Get the form ID
        var formId = "#"+$(this).attr("id");

        // Validate form before sending
        if( $(this).validationEngine('validate') ) {

            // Call Stripe

            //Get Button and Form
            var $button = $(this);
            var $form = $button.parents('form');

            //Change Value of button Amount
            var total = $("#totalOrder").val()*100;
            $button.data("amount",total);

            //Change Descriptio of Modal Dialog
            description = "New Order Payment";

            //Modify button data
            $button.data("description", description);

            var opts = $.extend({}, $button.data(), {
                token: function(result) {
                    $form.append($('<input>').attr({type: 'hidden', name: 'stripeToken', value: result.id}));

                    $.post($form.attr("action"), $form.serialize(), function(data) {
                        /** code to handle response **/
                        if(data.result) {

                            // Show Success page after checkout
                            showSuccessPage();
                            //$(location).attr('href', '/');  // Redirect after SuccessFul Order '/'
                        }
                        else {
                            // Show Error Message and Ask to Try Again with Message Returned from Server
                            console.log(data.message);
                        }
                    });
                }

            });

            //Call Open the Chechout Modal
            StripeCheckout.open(opts);
        }
    });
});

/* Execute When Loading Code
 ------------------------------------------------------------ */

// Hide Shopping Cart Alerts
$('#productRemovedFromShoppingCartAlert').hide();

// Get total products in shopping cart for logged user
function showSuccessPage() {
    $.get('/checkout/successful', function(data) {
        if(data){
            // Update Shopping Cart Badge
            $('#contentData').html(data);

            // Empty Shopping Cart
            $('#cartBadge').html(0);

        }
    });
}
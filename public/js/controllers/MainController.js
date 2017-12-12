/**
 * Created by Carlos on 11/11/15.
 */
/* GLOBAL VARIABLES
 ------------------------------------------------ */
var imageName;  // Variable used to temporarily store the image name returned after upload

/* Execute When Document is Ready
 ------------------------------------------------ */
$(document).ready(function(){

    $(function () {
        $.scrollUp({
            scrollName: 'scrollUp', // Element ID
            scrollDistance: 300, // Distance from top/bottom before showing element (px)
            scrollFrom: 'top', // 'top' or 'bottom'
            scrollSpeed: 300, // Speed back to top (ms)
            easingType: 'linear', // Scroll to top easing (see http://easings.net/)
            animation: 'fade', // Fade, slide, none
            animationSpeed: 200, // Animation in speed (ms)
            scrollTrigger: false, // Set a custom triggering element. Can be an HTML string or jQuery object
            //scrollTarget: false, // Set a custom target element for scrolling to the top
            scrollText: '<i class="fa fa-angle-up"></i>', // Text for element, can contain HTML
            scrollTitle: false, // Set a custom <a> title if required.
            scrollImg: false, // Set true to use image
            activeOverlay: false, // Set CSS color to display scrollUp active point, e.g '#00FFFF'
            zIndex: 2147483647 // Z-Index for the overlay
        });
    });

    // Call function to load initial products from 'initialProducts.html'
    loadInitialProducts();

    $("a").click(function (event) {
        getClickedLink (this,event); // 'this' = clicked link ; 'event'= click
    });

    // Call function to load Shopping Cart content qty for user
    loadShoppingCartQtys();

    // Submit a new product to the database
    $('#addProductForm_submit').click(function(e) {
        e.preventDefault();

        $.post($("#addProductForm").attr("action"), $("#addProductForm").serialize(), function(data,error) {
            if(error) {
                $('#addProductForm_status').html('An Error Occurred, Try Again');
            }
            else {
                $('#addProductForm_status').html('Success! Product Added');
                $("#addProductForm")[0].reset();
            }
        });

    });

});

/* Execute When Loading Code
 ------------------------------------------------------------ */

/* Function to get initial product data 'initialProducts.html'
 ------------------------------------------------------------ */
function loadInitialProducts () {
    $.get('/initialProducts', function(data) {
        if(data){
            $('#contentData').empty();  //Empty div 'contentData' from any previous code
            $('#contentData').html(data);   //Render new data on contentData section
        }
    });
}

/* Function to scroll to start of injected HMTL Code'
 ------------------------------------------------------------ */
function scrollToId (id) {
    $('html, body').animate({
        scrollTop: $(id).offset().top
    },
        {
            duration:"fast"
        },
            2000);
}



/* Function to get code from server and inject in main HTML page'
 --------------------------------------------------------------- */



function getClickedLink (link, event, urlPassed){
    event.preventDefault();

    var url;

    if(urlPassed) url = urlPassed
    else url = $(link).attr('href');

    // Verify what kind of address was received: if '#' = Scroll, if '/' = route
    if(!url.match(/^#/)) {
        $.get(url, function (data) {
            if (data != "logged_out") {
                if(url == '/login') {           // If the user wants to Login - Insert in Login modal Section
                    $('#loginModal').empty();
                    $('#loginModal').html(data);
                } else {                        // else, insert in Content Data Section.
                    $('#contentData').empty();     //Empty div 'contentData' from any previous code
                    $('#contentData').html(data);   //Render new data on contentData section
                    $('#slider').hide("slow", function () {
                        scrollToId('#contentData'); //Scroll to start of contentData section in case we are off.
                    });
                    return true;
                }
            } else {
                $(location).attr('href', '/');  // Redirect after logout to the main page '/'
            }
        });
    } else {
        scrollToId(url);  // if not a route or post - scroll to section id
    }
}

// Get total products in shopping cart for logged user
function loadShoppingCartQtys () {
    $.get('/shoppingcart/qtys', function(data) {
        if(data.qtyInCart > 0){
            // Update Shopping Cart Badge
            $('#cartBadge').html(data.qtyInCart);
        }
    });
}

var RGBChange = function() {
    $('#RGB').css('background', 'rgb('+r.getValue()+','+g.getValue()+','+b.getValue()+')')
};

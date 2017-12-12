/**
 * Created by Carlos on 11/14/15.
 */
/* Execute When Document is Ready
 ------------------------------------------------ */
$(document).ready(function(){

    /* Need to detach "click" listener, before attaching it again; or we get some elements with duplicated 'Click'
     listeners attached */
    $("a").off("click");

    // Intercept clicks to links in the main page
    $('a').click(function (event) {
        getClickedLink (this,event); // 'this' = clicked link ; 'event'= click
    });

    // Validate Add Product Form
    $("#addProductForm").validationEngine('attach', {promptPosition : "topRight", scroll: false, showOneMessage:true});
    $("#deleteProduct_submit").validationEngine('attach', {promptPosition : "topRight", scroll: false, showOneMessage:true});

    $('#addProductForm_submit').click(function(e) {
        e.preventDefault();

        // Get the form ID
        var formId = "#"+$(this).attr("id");

        // Check for errors in form before submitting
        if($(formId).validationEngine('validate') ) {

            $('#file').attr('type', 'text');
            $.post('/products', $("#addProductForm").serialize(), function (data) {
                if (data == 'error') {
                    $('#addProductForm_status').html('An Error Occurred, Try Again');
                    $('#file').attr('type', 'file');    // Change Attribute back to 'file'
                }
                else {
                    $('#addProductForm_status').html('Success! Product Added');
                    //  Reset Form, and remove PekeUpload elements and Initialize PekeUpload Again.
                    $("#addProductForm")[0].reset();
                    $( ".pkrw" ).remove();
                    $( ".pkuparea" ).remove();
                    $( ".pekecontainer" ).remove();
                    $('#file').attr('type', 'file');    // Change Attribute back to 'file'
                    $('#file').val("");                 // Erase value to accept new filename.
                    $("#file").pekeUpload({reset:true});
                }
            });
        }

    });

    $('#deleteProduct_submit').click(function(e){
        e.preventDefault();

        // Get the form ID
        var formId = "#"+$(this).attr("id");

        // Check for errors in form before submitting
        if($(formId).validationEngine('validate') ) {

            $.post('/delete', $("#deleteProductForm").serialize(), function (message) {
                if (message == 'error') {
                    $('#deleteProductForm_status').html('An Error Occurred, Try Again');
                }
                else {
                    $('#deleteProductForm_status').html('Success! Product Deleted');
                    $("#deleteProductForm")[0].reset();
                }
            });
        }
    });

    // Initialize File Upload Library
    initializePekeUpload();

    // Check if product is food, then allow Expiration date field.
    $("#producttype").on('change', function() {
        if($(this).val() == 'Food'){
            $('#expiration').prop('disabled', false);
        } else {
            $('#expiration').prop('disabled', true);
        }
    });
});

// load PekeUpload
function initializePekeUpload(){
    $("#file").pekeUpload({reset:false});
}
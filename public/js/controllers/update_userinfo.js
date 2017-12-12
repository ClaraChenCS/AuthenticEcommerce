/**
 * Created by Vaibhav on 11/26/2015.
 */
$(document).ready(function() {


    // Initialize Modal Window for Login / SignUp
    $('#userinfo_modal').modal({
        backdrop: 'static',
        show: true
    });

    $('#updateuserForm').submit(function(e) {
        e.preventDefault();

        // Get the form ID
        var formId = "#"+$(this).attr("id");

        // Check for errors in form before submitting
        if($(formId).validationEngine('validate') ) {


            $.post($(formId).attr("action"),$(formId).serialize(),function (affectedRows) {
                if (affectedRows) {
                    window.alert("You data updated successfully");
                   // $('#file').attr('type', 'file');    // Change Attribute back to 'file'
                    //$("#contentData").html(data);
                    $name = $("#name").val();

                    $(location).attr('href', '/');  // Redirect after login to the main page '/'

                }
                else {

                    window.alert("Sorry ,there is problem");
                    //$('#addProductForm_status').html('Success! Product Added');



                }
            });
        }

    });



});


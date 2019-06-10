var req = ocpu.call("templates_comtents", {
    id: window.location.href.split("#")[1]
}, function (session) {
    session.getObject(function (obj) {
        $("#method_name").text(obj.method_name)
        $("#method_description").html(obj.method_description)
    })
})


check_input_format = function(){
    $('#parameter_settings_card').hide();
    $("#inputFile").prop("disabled", true);
    $("#inputFile_validating").text("Validating")
    var inputFile_req = ocpu.call("templates_inputFile",{
        path:$("#inputFile")[0].files[0]
    },function(session){
        session.getObject(function(obj){
            oo = obj
            project_id = obj.project_id[0]
            $("#inputFile").prop("disabled", false);
            var text = "<p class='text-warning'>" + obj.message.warning_message.join("</p><p class='text-warning'>") + "</p>"
            text = text + "<p class='text-success'>" + obj.message.success_message.join("</p><p class='text-success'>") + "</p>"
            $("#inputFile_validating").html(text)
            $('#parameter_settings_card').show();
            // HERE load the missing_value_imputation html. <script src='missing_value_imputation.jb'></script>




            $("#parameter_settings").load(window.location.href.split("#")[1]+"_parameter_settings.html",init_selectpicker)
            $("#parameter_settings_description").html('loaded')
            loadjscssfile("js/"+window.location.href.split("#")[1]+".js",'js')
        })
    }).fail(function(e){
        //alert(e.responseText)
        Swal.fire('Oops...', e.responseText, 'error')
        $("#inputFile").prop("disabled", false);
        $("#inputFile_validating").text("Dataset file format is incorrect.")
    })
}
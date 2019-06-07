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
            ooo = obj
            $("#inputFile").prop("disabled", false);
            var text = "<p class='text-warning'>" + obj.warning_message.join("</p><p class='text-warning'>") + "</p>"
            text = text + "<p class='text-success'>" + obj.success_message.join("</p><p class='text-success'>") + "</p>"
            $("#inputFile_validating").html(text)
            $('#parameter_settings_card').show();
        })
    }).fail(function(e){
        //alert(e.responseText)
        Swal.fire('Oops...', e.responseText, 'error')
        $("#inputFile").prop("disabled", false);
        $("#inputFile_validating").text("Dataset file format is incorrect.")
    })
}
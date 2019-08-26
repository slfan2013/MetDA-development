console.log("data_subsetting_parameter_settings_description.js")


console.log("data_subsetting_parameter_settings_description.js")


 get_parameter_description = _.debounce(function(){

    
    parameter = {}
    $(".parameter").each(function () {
        if (this.id !== '') {
            //parameters.push({:$(this).val()})
            if ($(this).attr('type') !== "checkbox") { // this means that it is a select.
                parameter[this.id] = $(this).val()
            } else { // this means that it is a checkbox
                parameter[this.id] = $(this).prop("checked")
            }
        }
    })
    
    console.log("!")

    parameter.type = "parameter_settings_description"
    parameter.fun_name = "report_data_subsetting"
    parameter.project_id = project_id

    ocpu.call("call_fun",{parameter:parameter},function(session){
        console.log(session)
        session.getObject(function(obj){
            console.log(obj)
            $("#parameter_description").html(obj.text_html)
        })
    })

}, 250, { 'maxWait': 100 }); // this must be a global object.

$(".parameter").off("change").on("change",get_parameter_description)
get_parameter_description()

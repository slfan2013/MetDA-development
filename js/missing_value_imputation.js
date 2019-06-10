var defination_of_missing_value_onchange = function () {
    selected_values = $("#defination_of_missing_value").val()

    if (selected_values.includes("values less than ...")) {
        $("#defination_of_missing_value_values_less_than_form_group").show()
    } else {
        $("#defination_of_missing_value_values_less_than_form_group").hide()
    }
    if (selected_values.includes("other")) {
        $("#defination_of_missing_other_than_form_group").show()
    } else {
        $("#defination_of_missing_other_than_form_group").hide()
    }


}


var Submit = function(){
    $("#missing_value_imputation_submit").text("Calculating...")
    $("#missing_value_imputation_submit").prop('disabled', true);

    parameter = {}

    $(".parameter").each(function(){
        if(this.id !== ''){
            //parameters.push({:$(this).val()})
            parameter[this.id] = $(this).val()
        }
    })
    parameter.project_id = project_id
    parameter.fun_name = window.location.href.split("#")[1]
    var req = ocpu.call("call_fun",{parameter:parameter} , function (session) {
        console.log(session)
        session.getObject(function (obj) {
            ooo = obj
            console.log(ooo)
        })
    })
    

}
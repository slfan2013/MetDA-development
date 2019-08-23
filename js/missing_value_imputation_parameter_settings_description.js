console.log("missing_value_imputation_parameter_settings_description.js")


get_parameter_description = function(){

    
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
    ocpu.call("call_fun",{parameter:{
        defination_of_missing_other_than:parameter.defination_of_missing_other_than,
        defination_of_missing_value:parameter.defination_of_missing_value,
        defination_of_missing_value_values_less_than:parameter.defination_of_missing_value_values_less_than,
        missing_value_imputation_method:parameter.missing_value_imputation_method,
        remove_missing_values_more_than:parameter.remove_missing_values_more_than,
        remove_missing_values_more_than_value:parameter.remove_missing_values_more_than_value,
        type:"parameter_settings_description",
        fun_name:"report_missing_value_imputation"
    }},function(session){
        console.log(session)
        session.getObject(function(obj){
            console.log(obj)
            $("#parameter_description").html(obj.text_html)
        })
    })

}
$(".parameter").change(get_parameter_description)
get_parameter_description()
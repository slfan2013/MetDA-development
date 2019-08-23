console.log("volcano_parameter_settings_description.js")


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
        type:"parameter_settings_description",
        fun_name:"report_volcano"
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
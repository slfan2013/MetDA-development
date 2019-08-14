console.log("ssize_parameter_settings.js")

div_id = "sample_information_non_changing_levels_select_div"
id = "treatment_group"
$("#"+div_id).load("sample_information_non_changing_levels_select.html", init_selectpicker)


setTimeout(function(){
    div_id = "sample_information_non_changing_levels_select_div_sample_id"
    id = "sample_id"
    $("#"+div_id).load("sample_information_non_changing_levels_select.html", init_selectpicker)
}, 100)


$("#test_type").change(function(){
    if(['paired t-test','repeated ANOVA'].includes($("#test_type").val())){
        $("#sample_information_non_changing_levels_select_div_sample_id").show()
    }else{
        $("#sample_information_non_changing_levels_select_div_sample_id").hide()
    }
})
$("#sample_information_non_changing_levels_select_div_sample_id").hide()


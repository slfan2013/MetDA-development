div_id = "sample_information_changing_levels_select_div"
id = "treatment_group"
$("#"+div_id).load("sample_information_changing_levels_select.html", function(){
    $("#mean_or_median_div").load("mean_or_median.html", function(){
        $("#parameter_settings_description").load(window.location.href.split("#")[1] + "_parameter_settings_description.html", init_selectpicker)
    })

})


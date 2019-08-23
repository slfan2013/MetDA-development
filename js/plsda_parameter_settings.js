$("#scaling_method_div").load("scaling_method.html", function () {

    div_id = "sample_information_non_changing_levels_select_div"
    id = "treatment_group"
    $("#"+div_id).load("sample_information_non_changing_levels_select.html", function () {

        $("#parameter_settings_description").load(window.location.href.split("#")[1] + "_parameter_settings_description.html", init_selectpicker)

    })


})




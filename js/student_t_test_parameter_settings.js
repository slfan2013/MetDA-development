console.log("student_t_test_parameter_settings.js")

div_id = "sample_information_non_changing_levels_select_div"
id = "treatment_group"
$("#" + div_id).load("sample_information_non_changing_levels_select.html", function () {
    $("#equal_variance_assumption_div").load("equal_variance_assumption.html", function () {
        $("#FDR_div").load("FDR.html", function () {
            $("#parameter_settings_description").load(window.location.href.split("#")[1] + "_parameter_settings_description.html", init_selectpicker)
        })
    })
})



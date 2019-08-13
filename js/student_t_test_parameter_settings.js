console.log("student_t_test_parameter_settings.js")

div_id = "sample_information_non_changing_levels_select_div"
id = "treatment_group"
$("#"+div_id).load("sample_information_non_changing_levels_select.html", init_selectpicker)

$("#equal_variance_assumption_div").load("equal_variance_assumption.html")
$("#FDR_div").load("FDR.html", init_selectpicker)

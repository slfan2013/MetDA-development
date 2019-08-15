console.log("mann_whitney_test_parameter_settings.js")

div_id = "sample_information_non_changing_levels_select_div"
id = "treatment_group"
$("#"+div_id).load("sample_information_non_changing_levels_select.html", init_selectpicker)

$("#FDR_div").load("FDR.html", init_selectpicker)

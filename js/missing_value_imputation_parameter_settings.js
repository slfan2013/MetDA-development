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


$("#parameter_settings_description").load(window.location.href.split("#")[1] + "_parameter_settings_description.html", init_selectpicker)
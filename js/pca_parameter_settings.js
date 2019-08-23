$("#scaling_method_div").load("scaling_method.html", function () {
    $("#parameter_settings_description").load(window.location.href.split("#")[1] + "_parameter_settings_description.html", init_selectpicker)
})
console.log("data_transformation_parameter_settings.js")



p_column_names = Object.keys(p[0])
p_column_unique = {}
p_column_unique_length = {}
for (var i = 0; i < p_column_names.length; i++) {
    p_column_unique[p_column_names[i]] = unpack(p, p_column_names[i]).filter(unique)
    p_column_unique_length[p_column_names[i]] = p_column_unique[p_column_names[i]].length
    $('#heatmap_plot_order_sample_by').append($('<option>', {
        value: p_column_names[i],
        text: p_column_names[i]
    }));
    $('#treatment_group').append($('<option>', {
        value: p_column_names[i],
        text: p_column_names[i]
    }));
}


$("#treatment_group").selectpicker('refresh')

$("#method").off('change').on('change', function(){
    console.log("!")
    $("#method").selectpicker('refresh')
    if($("#method").val() == 'boxcox'){
        $("#show_when_boxcox").show()
    }else{
        $("#show_when_boxcox").hide()
    }
})
$("#show_when_boxcox").hide()



$("#parameter_settings_description").load(window.location.href.split("#")[1] + "_parameter_settings_description.html", function(){

    init_selectpicker()
 


})



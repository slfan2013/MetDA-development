console.log("volcano.js")
color_pallete = [["rgb(228, 59, 45)", "rgb(55, 126, 183)", "rgb(77, 175, 74)"],
["rgb(152, 78, 163)", "rgb(242, 126, 51)", "rgb(254, 248, 64)"],
["rgb(166, 86, 41)", "rgb(241, 128, 191)", "rgb(153, 153, 153)"],
["rgb(0,0,0)", "rgb(255,255,255)"]]



plot_url = {}




volcano_append_results = function (obj, session) {
    $("#results_description").html(obj.results_description)

    // for downloads.
    files_sources = [plot_url.volcano_plot];
    files_names = ['volcano_plot.svg']
    zipfile_name = "volcano_plot.zip"
    fold_name = "Volcano Plot"
    files_types = ["image/svg+xml"]
    $("#download_results").off("click").on("click", function () {


        //download_results(files_names, files_sources, zipfile_name)
        parameters = JSON.parse(localStorage.getItem('parameter'))
        parameters.volcano_plot = {}
        parameters.volcano_plot.p_value_cut_off = volcano_plot_parameters.p_value_cut_off
        parameters.volcano_plot.fold_change_cut_off = volcano_plot_parameters.fold_change_cut_off
        parameters.volcano_plot.colors = volcano_plot_parameters.colors
        parameters.volcano_plot.shapes = volcano_plot_parameters.shapes
        parameters.volcano_plot.sizes = volcano_plot_parameters.sizes
        parameters.volcano_plot.significancy_line_color = volcano_plot_parameters.significancy_line_color
        parameters.volcano_plot.significancy_line_dash = volcano_plot_parameters.significancy_line_dash
        parameters.volcano_plot.significancy_line_width = volcano_plot_parameters.significancy_line_width
        parameters.volcano_plot.names = volcano_plot_parameters.names
        parameters.volcano_plot.data = {}
        parameters.volcano_plot.data.x = unpack(volcano_plot_parameters.data,"x")
        parameters.volcano_plot.layout = volcano_plot_parameters.layout
        parameters.fun_name = "volcano"
        parameters.activate_data_id = $("#" + 'volcano_input_file')[0].files[0].name
        save_results(files_names, files_sources, files_types, fold_name, parameters, [0],['none'])

    })


    
    $("#save_results").off("click").on("click", function () {// open a dialog and ask where to save.
        parameters = JSON.parse(localStorage.getItem('parameter'))
        parameters.volcano_plot = {}
        parameters.volcano_plot.p_value_cut_off = volcano_plot_parameters.p_value_cut_off
        parameters.volcano_plot.fold_change_cut_off = volcano_plot_parameters.fold_change_cut_off
        parameters.volcano_plot.colors = volcano_plot_parameters.colors
        parameters.volcano_plot.shapes = volcano_plot_parameters.shapes
        parameters.volcano_plot.sizes = volcano_plot_parameters.sizes
        parameters.volcano_plot.significancy_line_color = volcano_plot_parameters.significancy_line_color
        parameters.volcano_plot.significancy_line_dash = volcano_plot_parameters.significancy_line_dash
        parameters.volcano_plot.significancy_line_width = volcano_plot_parameters.significancy_line_width
        parameters.volcano_plot.names = volcano_plot_parameters.names
        parameters.volcano_plot.data = {}
        parameters.volcano_plot.data.x = unpack(volcano_plot_parameters.data,"x")
        parameters.volcano_plot.layout = volcano_plot_parameters.layout


        //parameters.volcano_plot = volcano_plot_parameters
        save_results(files_names, files_sources, files_types, fold_name, parameters, [0],['none'])
    })




}
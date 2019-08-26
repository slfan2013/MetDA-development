console.log("boxplot.js")
color_pallete = [["rgb(228, 59, 45)", "rgb(55, 126, 183)", "rgb(77, 175, 74)"],
["rgb(152, 78, 163)", "rgb(242, 126, 51)", "rgb(254, 248, 64)"],
["rgb(166, 86, 41)", "rgb(241, 128, 191)", "rgb(153, 153, 153)"],
["rgb(0,0,0)", "rgb(255,255,255)"]]



plot_url = {}



boxplot_append_results = function (obj, session) {
    $("#results_description").html(obj.results_description)

    //obj = obj_boxplot_plot

    // boxplot is kind of special because I need to calculate all the boxplots here.
    // boxplot_parameter is the global parameter used to generate the single boxplot.
    // boxplot_data_layout_generate is the already generated data and layout.

    $("#download_results").off("click").on("click", function () {
        $(".download").prop("disabled", true);
        $("#download_results").text("Downloading ... ")
        download_or_save_function('download')
    })

    $("#save_results").off("click").on("click", function () {// open a dialog and ask where to save.
        download_or_save_function("save")
    })

    var download_or_save_function = function (type = "download") {
        Plotly.newPlot(boxplot_parameter.plot_id, boxplot_data_layout_generate.data, boxplot_data_layout_generate.layout).then(function () {
            var plotting_compound_index = 0;
            var quick_analysis = boxplot_parameter.quick_analysis;
            var plot_url = []
            var plot_loop = setInterval(function () {
                var main_group = $("#boxplot_plot_group_sample_main").val()
                var main_group_values = unpack(obj.p, main_group)
                var p_label = unpack(obj.p, 'label')
                var f_label = unpack(obj.f, 'label')
                
                var zip = new JSZip();
                if (plotting_compound_index === obj.f.length+1) {
                    console.log("Boxplots Generated")
                    clearInterval(plot_loop);

                    for (var i = 0; i < plot_url.length; i++) {
                        zip.file((i + 1) + "th " + f_label[i].replace(/[^0-9a-zA-Z _().]/g, "_") + ".svg", btoa(unescape(plot_url[i].replace("data:image/svg+xml,", ""))), { base64: true });
                    }

                    zip.generateAsync({ type: "base64" }).then(function (base64) {
                        bbb = base64
                        console.log("done")

                        files_sources = [base64];
                        files_names = ["boxplot_plot.zip"]
                        fold_name = "Boxplot"
                        files_types = ["application/x-zip-compressed"]

                        parameters = JSON.parse(localStorage.getItem('parameter'))
                        parameters.boxplot_plot = boxplot_plot_parameters

                        save_results(files_names, files_sources, files_types, fold_name, parameters, [0],['none'])
                        if(type === 'download'){
                            setTimeout(() => {
                                $(".download").prop("disabled", false);
                                $("#download_results").text("Download Results")
                            }, 2000);
                        }

                    })

                } else {
                    var y = obj.e[plotting_compound_index]

                    if($("#boxplot_plot_group_sample_by").val().length == 0){

                        var ys = [y]
                    }else{
                        var ys = array_split_by_one_factor(y, main_group_values, $("#group_sample_by_" + main_group).val().split("||"))

                    }



                    update_data = {
                        y: ys
                    }
                    boxplot_data_layout_generate.layout.title.text = f_label[plotting_compound_index]

                    Plotly.relayout(boxplot_parameter.plot_id, boxplot_data_layout_generate.layout)
                    //update_index = original_level_sequence.map(x => new_level_sequence.indexOf(x))

                    Plotly.restyle(boxplot_parameter.plot_id, update_data).then(function (gd) {
                        Plotly.toImage(gd, { format: 'svg' })
                            .then(
                                function (url) {
                                    var uuuu = url
                                    var uuu = uuuu.replace(/^data:image\/svg\+xml,/, '');
                                    uuu = decodeURIComponent(uuu);
                                    if (!quick_analysis) {
                                        //plot_url.boxplot_plot = btoa(unescape(encodeURIComponent(uuu)))
                                        //files_sources[2] = plot_url.boxplot_plot
                                        console.log(plotting_compound_index)
                                        plot_url.push(url)
                                    } else {
                                        //plot_base64[quick_analysis_project_time][quick_analysis_plot_name] = btoa(unescape(encodeURIComponent(uuu)))
                                    }
                                }
                            )
                    })

                }

                plotting_compound_index++;
            }, 1)
        })
    }



    // for downloads.
    /*files_sources = [session.loc + "files/sample_order.csv", session.loc + "files/compound_order.csv",plot_url.boxplot_plot];
    files_names = ['sample_order.csv','compound_order.csv','boxplot_plot.svg']
    zipfile_name = "boxplot_results.zip"
    $("#download_results").off("click").on("click", function () {
        download_results(files_names, files_sources, zipfile_name)
    })


    fold_name = "Boxplot"
    files_types = ["application/vnd.ms-excel", "application/vnd.ms-excel","image/svg+xml"]
    $("#save_results").off("click").on("click", function () {// open a dialog and ask where to save.
        parameters = JSON.parse(localStorage.getItem('parameter'))
        parameters.boxplot_plot = boxplot_plot_parameters
        save_results(files_names, files_sources, files_types, fold_name, parameters, [0],['none'])
    })*/




}

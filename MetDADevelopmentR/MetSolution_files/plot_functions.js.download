console.log("boxplot.js")
color_pallete = [["rgb(228, 59, 45)", "rgb(55, 126, 183)", "rgb(77, 175, 74)"],
["rgb(152, 78, 163)", "rgb(242, 126, 51)", "rgb(254, 248, 64)"],
["rgb(166, 86, 41)", "rgb(241, 128, 191)", "rgb(153, 153, 153)"],
["rgb(0,0,0)", "rgb(255,255,255)"]]
heatmap_plot_fun = function ({
    heatmap_x = undefined, heatmap_y = undefined, heatmap_z = undefined, sample_label = undefined, heatmap_x_text = undefined, heatmap_y_text = undefined, tickvals = undefined,
    colorscale = undefined, cell_height = undefined, cell_width = undefined,
    show_sample_dendrogram = undefined, sample_dendro_trace_x = undefined, sample_dendro_trace_y = undefined, order_sample_by = undefined,
    show_compound_dendrogram = undefined, compound_dendro_trace_x = undefined, compound_dendro_trace_y = undefined, order_compound_by = undefined,
    sample_annotations = undefined,
    sample_level_options = undefined, p = undefined, sample_order = undefined,
    sample_tree_height = undefined, sample_annotation_height = undefined, show_sample_label = undefined,
    compound_annotations = undefined,
    compound_level_options = undefined, f = undefined, compound_order = undefined,
    compound_tree_height = undefined, compound_annotation_height = undefined, show_compound_label = undefined,
    layout = undefined, plot_id = undefined, quick_analysis = false, quick_analysis_project_time = undefined, quick_analysis_plot_name = undefined } = {}
) {
    var myPlot = document.getElementById(plot_id)
    heatmap_trace = {
        x: heatmap_x,
        y: heatmap_y,
        z: heatmap_z,
        type: "heatmap",
        showscale: layout.legend.showlegend[0],
        colorbar: {
            thicknessmode: "pixels",
            thickness: 30,
            lenmode: "pixels",
            len: 200,
            x: layout.legend.x,
            y: layout.legend.y,
            bordercolor: layout.legend.bordercolor,
            borderwidth: layout.legend.borderwidth,
            bgcolor: layout.legend.bgcolor,
            outlinecolor: "white",
            nticks: 2,
            ticklen: 0,
            tickvals: tickvals,
            ticktext: ["low", "median", "high"],
            tickcolor: "black",
            tickfont: {
                family: layout.legend.font.family,
                color: layout.legend.font.color,
                size: layout.legend.font.size
            }
        },
        //autocolorscale:false,
        colorscale: colorscale,
        showlegend: false,
        xaxis: "x",
        yaxis: "y",
        hoverinfo: "text",
        name: "",
        xgap: 1,
        ygap: 1
    }

    layout.height = heatmap_y.length * cell_height
    //layout.width = heatmap_x.length * cell_width
    if (show_sample_dendrogram) {
        var sample_dendro_trace = {
            x: sample_dendro_trace_x,
            y: sample_dendro_trace_y,
            text: "",
            type: "scatter",
            mode: "lines",
            line: {
                width: 1,
                color: "black",
                dash: "solid"
            },
            hoveron: "points",
            showlegend: false,
            xaxis: "x2",
            yaxis: "y2",
            hoverinfo: "skip",
            name: ""
        }
    }
    if (show_compound_dendrogram) {
        var compound_dendro_trace = {
            x: compound_dendro_trace_x,
            y: compound_dendro_trace_y,
            text: "",
            type: "scatter",
            mode: "lines",
            line: {
                width: 1,
                color: "black",
                dash: "solid"
            },
            hoveron: "points",
            showlegend: false,
            xaxis: "x3",
            yaxis: "y3",
            hoverinfo: "skip",
            name: ""
        }
    }

    sample_annotation_traces = []
    for (var i = 0; i < sample_annotations.length; i++) {
        var temp_z = unpack(p, sample_annotations[i].column)
        var temp_color_scale = []
        for (var j = 0; j < sample_level_options[sample_annotations[i].column].length; j++) {
            if ((sample_level_options[sample_annotations[i].column].length - 1) === 0) {
                temp_color_scale[j] = [0, sample_annotations[i].colors[j]]
                temp_color_scale[j + 1] = [1, sample_annotations[i].colors[j]]
            } else {
                temp_color_scale[j] = [j / (sample_level_options[sample_annotations[i].column].length - 1), sample_annotations[i].colors[j]]
            }

        }
        sample_annotation_traces[i] = {
            x: heatmap_x,
            //y:Array.apply(0, Array(heatmap_x.length)).map(function() { return 0; }),
            y: [0],
            z: [sample_order.map(x => temp_z[x]).map(x => sample_level_options[sample_annotations[i].column].indexOf(x))],
            type: "heatmap",
            showscale: false,
            colorscale: temp_color_scale,
            autocolorscale: false,
            showlegend: false,
            xaxis: "x" + (i + 4),
            yaxis: "y" + (i + 4),
            hoverinfo: "text",
            name: "",
            xgap: 1,
            ygap: 1,
            zmin: 0,
            zmax: jStat.max(sample_order.map(x => temp_z[x]).map(x => sample_level_options[sample_annotations[i].column].indexOf(x)))
        }
    }


    var sample_tree_ratio = 1 - (sample_tree_height / layout.height) //!!!
    //var height_of_cell = (sample_tree_ratio*ctrl.parameters.height)/dta.length
    var height_of_sample_annotation = sample_annotation_height
    var mid_yrang_from = Array.apply(null, { length: sample_annotations.length }).map(Function.call, Number).map(x => x + 1).reverse().map(x => x * height_of_sample_annotation).map(x => layout.height * sample_tree_ratio - x).map(x => x / layout.height)


    var yrange_from = [0].concat(mid_yrang_from).concat([sample_tree_ratio])
    var yrange_to = mid_yrang_from.concat([sample_tree_ratio, 1])


    compound_annotation_traces = []
    for (var i = 0; i < compound_annotations.length; i++) {
        var temp_z = unpack(f, compound_annotations[i].column)
        var temp_color_scale = []
        for (var j = 0; j < compound_level_options[compound_annotations[i].column].length; j++) {
            if ((compound_level_options[compound_annotations[i].column].length - 1) === 0) {
                temp_color_scale[j] = [0, compound_annotations[i].colors[j]]
                temp_color_scale[j + 1] = [1, compound_annotations[i].colors[j]]
            } else {
                temp_color_scale[j] = [j / (compound_level_options[compound_annotations[i].column].length - 1), compound_annotations[i].colors[j]]
            }

        }
        compound_annotation_traces[i] = {
            x: [0],
            //y:Array.apply(0, Array(heatmap_x.length)).map(function() { return 0; }),
            y: heatmap_y,
            z: compound_order.map(x => temp_z[x]).map(x => [compound_level_options[compound_annotations[i].column].indexOf(x)]),
            type: "heatmap",
            showscale: false,
            colorscale: temp_color_scale,
            autocolorscale: false,
            showlegend: false,
            xaxis: "x" + (i + 4 + sample_annotations.length),
            yaxis: "y" + (i + 4 + sample_annotations.length),
            hoverinfo: "text",
            name: "",
            xgap: 1,
            ygap: 1,
            zmin: 0,
            zmax: jStat.max(compound_order.map(x => temp_z[x]).map(x => compound_level_options[compound_annotations[i].column].indexOf(x)))

        }
    }

    var compound_tree_ratio = 1 - (compound_tree_height / layout.width)

    //var height_of_cell = (compound_tree_ratio*ctrl.parameters.height)/dta.length
    var height_of_compound_annotation = compound_annotation_height
    var mid_xrang_from = Array.apply(null, { length: compound_annotations.length }).map(Function.call, Number).map(x => x + 1).reverse().map(x => x * height_of_compound_annotation).map(x => layout.width * compound_tree_ratio - x).map(x => x / layout.width)

    var xrange_from = [0].concat(mid_xrang_from).concat([compound_tree_ratio])
    var xrange_to = mid_xrang_from.concat([compound_tree_ratio, 1])

    //!!! layout
    layout.xaxis3 = {
        showgrid: false,
        zeroline: false,
        showline: false,
        autotick: true,
        ticks: '',
        showticklabels: false,
        domain: [xrange_from[xrange_from.length - 1], xrange_to[xrange_to.length - 1]]
    }
    layout.yaxis3 = {
        autorange: false,
        range: [0.25, jStat.max(heatmap_y) + 1.5],
        showgrid: false,
        zeroline: false,
        showline: false,
        autotick: true,
        ticks: '',
        showticklabels: false,
        domain: [yrange_from[0], yrange_to[0]]
    }

    layout.xaxis2 = {
        autorange: false,
        range: [0.5, jStat.max(heatmap_x) + 1.5],
        showgrid: false,
        zeroline: false,
        showline: false,
        autotick: true,
        ticks: '',
        showticklabels: false,
        domain: [xrange_from[0], xrange_to[0]]
    }

    layout.yaxis2 = {
        autorange: true,
        showgrid: false,
        zeroline: false,
        showline: false,
        autotick: true,
        ticks: '',
        showticklabels: false,
        domain: [yrange_from[yrange_from.length - 1], yrange_to[yrange_to.length - 1]]
    }

    layout.xaxis.range = [-0.5, jStat.max(heatmap_x) + 0.5]
    layout.xaxis.domain = [xrange_from[0], xrange_to[0]]
    layout.xaxis.tickvals = heatmap_x
    layout.xaxis.ticktext = heatmap_x_text
    layout.xaxis.ticklen = show_sample_label ? 5 : 0
    layout.xaxis.showticklabels = show_sample_label


    layout.yaxis.domain = [yrange_from[0], yrange_to[0]]
    layout.yaxis.tickvals = heatmap_y
    layout.yaxis.ticktext = heatmap_y_text
    layout.yaxis.ticklen = show_compound_label ? 5 : 0
    layout.yaxis.showticklabels = show_compound_label




    //sample_annotation_layout = {}
    for (var i = 0; i < sample_annotations.length; i++) {
        layout["xaxis" + (i + 4)] = {
            autorange: false,
            range: [-0.5, jStat.max(heatmap_x) + 0.5],
            type: "linear",
            tickmode: "array",
            domain: [xrange_from[0], xrange_to[0]],
            ticklen: 0,
            showticklabels: false,
            showline: false,
            showgrid: false,
            zeroline: false,
            title: ""
        }
        layout["yaxis" + (i + 4)] = {
            autorange: false,
            range: [-0.5, 0],
            type: "linear",
            tickmode: "array",
            domain: [yrange_from[i + 1], yrange_to[i + 1]],
            ticklen: 0,
            tickvals: [-0.25],
            ticktext: [sample_annotations[i].column],
            showline: false,
            showgrid: false,
            zeroline: false,
            title: ""
        }
    }
    //compound_annotation_layout = {}
    for (var i = 0; i < compound_annotations.length; i++) {
        layout["xaxis" + (i + 4 + sample_annotations.length)] = {
            autorange: false,
            range: [-0.5, 0],
            type: "linear",
            tickmode: "array",
            domain: [xrange_from[i + 1], xrange_to[i + 1]],
            ticklen: 0,
            tickvals: [-0.25],
            ticktext: [compound_annotations[i].column],
            tickangle: 90,
            showline: false,
            showgrid: false,
            zeroline: false,
            title: ""
        }
        layout["yaxis" + (i + 4 + sample_annotations.length)] = {
            autorange: true,
            //range:[0.25,jStat.max(heatmap_y)+1.5],
            type: "linear",
            tickmode: "array",
            domain: [yrange_from[0], yrange_to[0]],
            ticklen: 0,
            showticklabels: false,
            showline: false,
            showgrid: false,
            zeroline: false,
            title: ""
        }
    }




    data = [heatmap_trace]
    if (show_sample_dendrogram) {
        data = data.concat(sample_dendro_trace)
    }
    if (show_compound_dendrogram) {
        data = data.concat(compound_dendro_trace)
    }
    data = data.concat(sample_annotation_traces).concat(compound_annotation_traces)
    lll = layout

    layout.showlegend = false



    Plotly.newPlot(plot_id, data, layout, { editable: false })


        .then(gd => {
            heatmap_plot_gd = gd
            if (!quick_analysis) {
                // Note: cache should not be re-used by repeated calls to JSON.stringify.
                /*var cache = [];
                fullLayout = JSON.stringify(heatmap_plot_gd._fullLayout, function (key, value) {
                    if (typeof value === 'object' && value !== null) {
                        if (cache.indexOf(value) !== -1) {
                            // Duplicate reference found, discard key
                            return;
                        }
                        // Store value in our collection
                        cache.push(value);
                    }
                    return value;
                });
                cache = null; // Enable garbage collection
                // Note: cache should not be re-used by repeated calls to JSON.stringify.
                var cache = [];
                fullData = JSON.stringify(heatmap_plot_gd._fullData, function (key, value) {
                    if (typeof value === 'object' && value !== null) {
                        if (cache.indexOf(value) !== -1) {
                            // Duplicate reference found, discard key
                            return;
                        }
                        // Store value in our collection
                        cache.push(value);
                    }
                    return value;
                });
                cache = null; // Enable garbage collection*/


                heatmap_plot_parameters = {
                    //full_data: JSON.parse(fullData),
                    //full_layout: JSON.parse(fullLayout),
                    data: heatmap_plot_gd.data,
                    layout: heatmap_plot_gd.layout,
                }

                heatmap_plot_parameters.sample_annotation = $("#heatmap_plot_sample_annotation").val()
                heatmap_plot_parameters.sample_annotations = sample_annotations
                heatmap_plot_parameters.compound_annotation = $("#heatmap_plot_compound_annotation").val()
                heatmap_plot_parameters.compound_annotations = compound_annotations

                heatmap_plot_parameters.order_sample_by = order_sample_by
                heatmap_plot_parameters.order_compound_by = order_compound_by

                if (typeof (order_sample_levels) === "undefined") {
                    order_sample_levels = ""
                }
                heatmap_plot_parameters.order_sample_levels = order_sample_levels
                if (typeof (order_compound_levels) == "undefined") {
                    order_compound_levels = ""
                }
                heatmap_plot_parameters.order_compound_levels = order_compound_levels

                heatmap_plot_parameters.show_sample_label = $("#show_sample_label").prop("checked")
                heatmap_plot_parameters.show_compound_label = $("#show_compound_label").prop("checked")


                heatmap_plot_parameters.colorscale = $("#colorscale").val()
                heatmap_plot_parameters.cell_height = $("#cell_height").val()
                heatmap_plot_parameters.cell_width = $("#cell_width").val()
                heatmap_plot_parameters.sample_tree_height = $("#sample_tree_height").val()
                heatmap_plot_parameters.sample_annotation_height = $("#sample_annotation_height").val()
                heatmap_plot_parameters.compound_tree_height = $("#compound_tree_height").val()
                heatmap_plot_parameters.compound_annotation_height = $("#compound_annotation_height").val()
            }





            Plotly.toImage(gd, { format: 'svg' })
                .then(
                    function (url) {
                        console.log("!!")
                        var heatmap_plot_url = url
                        var heatmap_plot_url2 = heatmap_plot_url.replace(/^data:image\/svg\+xml,/, '');
                        heatmap_plot_url2 = decodeURIComponent(heatmap_plot_url2);
                        if (!quick_analysis) {
                            plot_url.heatmap_plot = btoa(unescape(encodeURIComponent(heatmap_plot_url2)))
                            files_sources[2] = plot_url.heatmap_plot
                        } else {
                            plot_base64[quick_analysis_project_time][quick_analysis_plot_name] = btoa(unescape(encodeURIComponent(heatmap_plot_url2)))
                        }

                        /*var canvas = document.createElement("canvas");
                        var context = canvas.getContext("2d");
                        canvas.width = 4000;
                        canvas.height = 3000;
                        var image = new Image();
                        context.clearRect ( 0, 0, 4000, 3000 );
                        var imgsrc = 'data:image/svg+xml;base64,'+ btoa(unescape(url.replace("data:image/svg+xml,",""))); // Convert SVG string to data URL

                        var image = new Image();
                        image.onload = function() {
                            context.drawImage(image, 0, 0, 4000, 3000);
                            var img = canvas.toDataURL("image/png");
                            base64 = img.replace("data:image/png;base64,","")
                            plot_url.heatmap_plot = base64
                        };
                        image.src = imgsrc*/
                    }
                )



        });
}

ssize_plot_fun = function ({ x = undefined, y = undefined, title = undefined, y_lab = undefined, names = undefined,
    layout = undefined, plot_id = undefined, quick_analysis = false, quick_analysis_project_time = undefined, quick_analysis_plot_name = undefined
} = {}) {

    var myPlot = document.getElementById(plot_id)
    ssize_plot_data = []
    ssize_plot_data[0] = {
        x: [0], y: [0], name: '<b>Powers</b>', line: { 'color': 'rgba(0, 0, 0, 0)' }
    }
    for (var i = 0; i < x.length; i++) {
        ssize_plot_data.push({
            x: x[i],
            y: y[i],
            text: "",
            type: 'scatter',
            showlegend: true,
            mode: 'lines',
            name: names[i],
            line: {
                color: layout.traces.line.color,
                width: layout.traces.line.width,
                shape: layout.traces.line.shape,
                smoothing: Number(layout.traces.line.smoothing)
            },
            hovertemplate: "%{y:.0%} of compounds achieves " + ssize_plot_layout.title.text.match(/\d+/g).map(Number)[0] + "% statistical power when having %{x:.0f} samples."
        })
    }

    layout.title.text = title
    layout.yaxis.title.text = y_lab
    Plotly.newPlot(plot_id, ssize_plot_data, layout)
        .then(gd => {
            ssize_plot_gd = gd

            ssize_plot_parameters = {
                data: ssize_plot_gd.data,
                layout: ssize_plot_gd.layout,
            }


            Plotly.toImage(gd, { format: 'svg' })
                .then(
                    function (url) {
                        var ssize_plot_url = url
                        var ssize_plot_url2 = ssize_plot_url.replace(/^data:image\/svg\+xml,/, '');
                        ssize_plot_url2 = decodeURIComponent(ssize_plot_url2);


                        if (!quick_analysis) {
                            plot_url.ssize_plot = btoa(unescape(encodeURIComponent(ssize_plot_url2)))
                            files_sources[1] = plot_url.ssize_plot
                        } else {
                            plot_base64[quick_analysis_project_time][quick_analysis_plot_name] = btoa(unescape(encodeURIComponent(ssize_plot_url2)))
                        }
                    }
                )
        });
}



power_plot_fun = function ({ x = undefined, y = undefined, title = undefined, y_lab = undefined, names = undefined,
    layout = undefined, plot_id = undefined, quick_analysis = false, quick_analysis_project_time = undefined, quick_analysis_plot_name = undefined
} = {}) {

    //var y = y.map(x=>x*100)
    console.log(y)
    var myPlot = document.getElementById(plot_id)
    power_plot_data = []
    power_plot_data[0] = {
        x: [0], y: [0], name: '<b>Sample Sizes</b>', line: { 'color': 'rgba(0, 0, 0, 0)' }
    }
    for (var i = 0; i < x.length; i++) {
        power_plot_data.push({
            x: x[i],
            y: y[i],
            text: "",
            type: 'scatter',
            showlegend: true,
            mode: 'lines',
            name: names[i],
            line: {
                color: layout.traces.line.color,
                width: layout.traces.line.width,
                shape: layout.traces.line.shape,
                smoothing: Number(layout.traces.line.smoothing)
            },
            hovertemplate: "%{y:.0%} of compounds achieves %{x:.2f} statistical power when having " + layout.title.text.match(/\d+/g).map(Number)[0] + " samples."
        })
    }

    console.log(Number(layout.traces.line.smoothing))
    layout.title.text = title
    layout.yaxis.title.text = y_lab



    Plotly.newPlot(plot_id, power_plot_data, layout)
        .then(gd => {
            f
            power_plot_gd = gd

            power_plot_parameters = {
                data: power_plot_gd.data,
                layout: power_plot_gd.layout,
            }


            Plotly.toImage(gd, { format: 'svg' })
                .then(
                    function (url) {
                        var power_plot_url = url
                        var power_plot_url2 = power_plot_url.replace(/^data:image\/svg\+xml,/, '');
                        power_plot_url2 = decodeURIComponent(power_plot_url2);


                        if (!quick_analysis) {
                            plot_url.power_plot = btoa(unescape(encodeURIComponent(power_plot_url2)))
                            files_sources[2] = plot_url.power_plot
                        } else {
                            plot_base64[quick_analysis_project_time][quick_analysis_plot_name] = btoa(unescape(encodeURIComponent(power_plot_url2)))
                        }
                    }
                )
        });
}





boxplot_plot_fun = function ({
    xs = undefined, ys = undefined, texts = undefined, boxpoints = undefined, jitter = undefined, pointpos = undefined, trace_names = undefined, box_colors = undefined,
    symbol = undefined, whiskerwidth = undefined, notched = undefined, notchwidth = undefined, boxmean = undefined,
    size = undefined, outliercolor = undefined, line_width = undefined, fillcolor_transparency = undefined, title = undefined, categoryarray = undefined,
    layout = undefined, plot_id = undefined, quick_analysis = false, quick_analysis_project_time = undefined, quick_analysis_plot_name = undefined } = {}
) {
    var myPlot = document.getElementById(plot_id)
    var data = [];
    for (var i = 0; i < ys.length; i++) {
        var trace = {
            y: ys[i],
            type: 'box',
            boxpoints: boxpoints,
            jitter: jitter,
            text: texts[i],
            pointpos: pointpos,
            name: trace_names[i],
            marker: {
                color: box_colors[trace_names[i]],
                symbol: symbol,
                size: size,
                outliercolor: outliercolor,
            },
            line: {
                width: line_width
            },
            fillcolor: transparent_rgba(box_colors[trace_names[i]], fillcolor_transparency),
            whiskerwidth: whiskerwidth,
            notched: notched,
            notchwidth: notchwidth,
            boxmean: boxmean
        }
        if (xs !== undefined) {
            trace.x = xs[i]
        }
        data.push(trace)
    }


    layout.title.text = title
    layout.xaxis.categoryorder = 'array'
    if (xs === undefined) {
        layout.boxmode = "overlay"
    } else {
        layout.boxmode = "group"
        layout.xaxis.categoryarray = categoryarray
    }


    Plotly.newPlot(plot_id, data, layout, { showSendToCloud: false })

        .then(gd => {
            boxplot_plot_gd = gd
            if (!quick_analysis) {

                boxplot_plot_parameters = {
                    //full_data: JSON.parse(fullData),
                    //full_layout: JSON.parse(fullLayout),
                    data: boxplot_plot_gd.data,
                    layout: boxplot_plot_gd.layout,
                }

                boxplot_plot_parameters.group_sample_by = $("#boxplot_plot_group_sample_by").val()
                boxplot_plot_parameters.main_group = $("#boxplot_plot_group_sample_main").val()

                if (boxplot_plot_parameters.group_sample_by.length === 2) {
                    var sub_group = group_sample_by.slice(0);
                    sub_group.splice(sub_group.indexOf(boxplot_plot_parameters.main_group), 1)[0]
                    boxplot_plot_parameters.categoryarray = $("#group_sample_by_" + sub_group).val().split("||")
                } else {
                    if($("#group_sample_by_" + boxplot_plot_parameters.main_group).val() === undefined){
                        boxplot_plot_parameters.categoryarray = ['value']

                        boxplot_plot_parameters.main_group_split = ['value']


                    }else{
                        boxplot_plot_parameters.categoryarray = $("#group_sample_by_" + boxplot_plot_parameters.main_group).val().split("||")

                        boxplot_plot_parameters.main_group_split = $("#group_sample_by_" + boxplot_plot_parameters.main_group).val().split("||")
                    }
                    
                }
                
            }



        });





    return ({ data: data, layout: layout })
}








volcano_plot_fun = function ({
    p_values = undefined, label = undefined, fold_change = undefined,
    p_value_cut_off = undefined, fold_change_cut_off = undefined,
    colors = undefined, shapes = undefined, sizes = undefined,
    significancy_line_color = undefined, significancy_line_dash = undefined, significancy_line_width = undefined,
    names = undefined,
    layout = undefined, plot_id = undefined, quick_analysis = false, quick_analysis_project_time = undefined, quick_analysis_plot_name = undefined } = {}
) {
    var myPlot = document.getElementById(plot_id)
    var data = []
    for (var i = 0; i < names.length; i++) {
        data.push({
            mode: 'markers',
            x: [],
            y: [],
            name: names[i],
            text: [],
            marker: {
                color: colors[i],
                symbol: shapes[i],
                size: sizes[i]
            },
            showlegend: false
        })
    }


    for (var i = 0; i < label.length; i++) {
        var temp_text = "compound: " + label[i] + "<br>" +
            "p-value: " + p_values[i] + "<br>" +
            "fold change: " + fold_change[i] + "<br>"
        if (p_values[i] < p_value_cut_off && fold_change[i] > fold_change_cut_off) {
            data[0].x.push(Math.log2(fold_change[i]))
            data[0].y.push(-Math.log10(p_values[i]))
            data[0].text.push(temp_text)
        } else if (p_values[i] < p_value_cut_off && fold_change[i] < (1 / fold_change_cut_off)) {
            data[1].x.push(Math.log2(fold_change[i]))
            data[1].y.push(-Math.log10(p_values[i]))
            data[1].text.push(temp_text)
        } else if (p_values[i] < p_value_cut_off) {
            data[2].x.push(Math.log2(fold_change[i]))
            data[2].y.push(-Math.log10(p_values[i]))
            data[2].text.push(temp_text)
        } else if (p_values[i] > p_value_cut_off && fold_change[i] > fold_change_cut_off) {
            data[3].x.push(Math.log2(fold_change[i]))
            data[3].y.push(-Math.log10(p_values[i]))
            data[3].text.push(temp_text)
        } else if (p_values[i] > p_value_cut_off && fold_change[i] < (1 / fold_change_cut_off)) {
            data[4].x.push(Math.log2(fold_change[i]))
            data[4].y.push(-Math.log10(p_values[i]))
            data[4].text.push(temp_text)
        } else {
            data[5].x.push(Math.log2(fold_change[i]))
            data[5].y.push(-Math.log10(p_values[i]))
            data[5].text.push(temp_text)
        }
    }
    layout.xaxis.range = [Math.log2(jStat.min(fold_change)) - 0.1, Math.log2(jStat.max(fold_change))+0.1]
    
    data.push({ // significant line.
        x: layout.xaxis.range,
        y: [-Math.log10(p_value_cut_off), -Math.log10(p_value_cut_off)],
        mode: "lines",
        name: "p-value cut-off",
        line: {
            dash: significancy_line_dash,
            width: significancy_line_width,
            color: significancy_line_color
        },
        showlegend: false
    })





    Plotly.newPlot(plot_id, data, layout, { editable: false })


        .then(gd => {
            volcano_plot_gd = gd
            if (!quick_analysis) {

                volcano_plot_parameters = {
                    data: volcano_plot_gd.data,
                    layout: volcano_plot_gd.layout,
                }
                // volcano_plot_parameters.main_group_split = $("#group_sample_by_" + 



                volcano_plot_parameters.p_value_cut_off = $("#p_value_cut_off").val()


                volcano_plot_parameters.fold_change_cut_off = $("#fold_change_cut_off").val()
                volcano_plot_parameters.colors = [$("#sig_pos").spectrum("get").toRgbString(), $("#sig_neg").spectrum("get").toRgbString(), $("#sig_not_pos_neg").spectrum("get").toRgbString(), $("#not_sig_pos").spectrum("get").toRgbString(), $("#not_sig_neg").spectrum("get").toRgbString(), $("#not_sig_not_pos_neg").spectrum("get").toRgbString()]
                volcano_plot_parameters.shapes = [$("#sig_pos_shape").val(), $("#sig_neg_shape").val(), $("#sig_not_pos_neg_shape").val(), $("#not_sig_pos_shape").val(), $("#not_sig_neg_shape").val(), $("#not_sig_not_pos_neg_shape").val()]
                volcano_plot_parameters.sizes = [$("#sig_pos_size").val(), $("#sig_neg_size").val(), $("#sig_not_pos_neg_size").val(), $("#not_sig_pos_size").val(), $("#not_sig_neg_size").val(), $("#not_sig_not_pos_neg_size").val()]
                volcano_plot_parameters.significancy_line_color = $("#significancy_line_color").spectrum("get").toRgbString()
                volcano_plot_parameters.significancy_line_dash = $("#significancy_line_dash").val()
                volcano_plot_parameters.significancy_line_width = $("#significancy_line_width").val()
                volcano_plot_parameters.names = ["Significant + Positive", "Significant + Negative", "Significant but Small Fold Change", "Not Significant + Positive", "Not Significant + Positive", "Not Significant + Small Fold Change"]







            }

            Plotly.toImage(gd, { format: 'svg' })
                .then(
                    function (url) {
                        console.log("!!")
                        var volcano_plot_url = url
                        var volcano_plot_url2 = volcano_plot_url.replace(/^data:image\/svg\+xml,/, '');
                        volcano_plot_url2 = decodeURIComponent(volcano_plot_url2);
                        if (!quick_analysis) {
                            plot_url.volcano_plot = btoa(unescape(encodeURIComponent(volcano_plot_url2)))
                            files_sources[0] = plot_url.volcano_plot
                        } else {
                            plot_base64[quick_analysis_project_time][quick_analysis_plot_name] = btoa(unescape(encodeURIComponent(volcano_plot_url2)))
                        }


                    }
                )





        });
/*
    myPlot.on('plotly_click', function (data, event) {//https://plot.ly/javascript/text-and-annotations/
        eee = event
        ddd = data
        console.log(ddd)
        point = data.points[0]
        newAnnotation = {
            x: point.xaxis.d2l(point.x),
            y: point.yaxis.d2l(point.y),
            arrowhead: 6,
            ax: 0,
            ay: -80,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            arrowcolor: point.fullData.marker.color,
            font: { size: 12 },
            text: point.text.split("<br>")[0].split(": ")[1],
            captureevents: true
        },
            divid = document.getElementById(plot_id)
        newIndex = (divid.layout.annotations || []).length;
        if (newIndex) {
            var foundCopy = false;
            divid.layout.annotations.forEach(function (ann, sameIndex) {
                if (ann.text === newAnnotation.text) {
                    Plotly.relayout(plot_id, 'annotations[' + sameIndex + ']', 'remove');
                    foundCopy = true;
                }
            });
            if (foundCopy) return;
        }
        Plotly.relayout(plot_id, 'annotations[' + newIndex + ']', newAnnotation)
        //.then(function(gg){
         //   ggg = gg
        //    save the new plot here.
        //});
    })
*/




    return ({ data: data, layout: layout })
}



sample_size_plot_fun = function ({ ns = undefined, powers = undefined, effect_sizes = undefined, sample_size_plot_layout = undefined, plot_id = undefined }) {
    //sample_size_plot_fun

    data = []
    //https://stackoverflow.com/questions/45555266/plotly-legend-title dummy legend.
    data[0] = {
        x: [0], y: [0], name: '<b>Effect Sizes</b>', line: { 'color': 'rgba(0, 0, 0, 0)' }
    }
    for (var i = 0; i < effect_sizes.length; i++) {

        data.push({
            x: ns[effect_sizes[i]],
            y: powers[effect_sizes[i]],
            mode: 'lines+markers',
            type: 'scatter',
            name: effect_sizes[i]
        })

    }

    sample_size_plot_layout.yaxis.range = [0, 1]


    Plotly.newPlot(plot_id, data, sample_size_plot_layout);
}





scatter_by_group = function ({ x = undefined, y = undefined, color_by = undefined, color_values = undefined, color_levels = undefined,
    shape_by = undefined, shape_values = undefined, shape_levels = undefined,
    size_by = undefined, size_values = undefined, size_levels = undefined,
    ellipse_group = ['color', 'shape', 'size'],
    labels = undefined,
    layout = undefined,
    plot_id = undefined, quick_analysis = false, quick_analysis_project_time = undefined, quick_analysis_plot_name = undefined } = {}
) {
    var myPlot = document.getElementById(plot_id)
    if (color_by === undefined) {
        color_by = Array(x.length).fill("")
        if (color_values === undefined) {
            color_values = "black"
        }
        color_levels = ""
    }

    if (shape_by === undefined) {
        shape_by = Array(x.length).fill("")
        if (shape_values === undefined) {
            shape_values = "circle"
        }
        shape_levels = ""
    }
    if (size_by === undefined) {
        size_by = Array(x.length).fill("")
        if (size_values === undefined) {
            size_values = 2
        }
        size_levels = ""
    }

    if (typeof color_values === 'string') {
        color_values = [color_values]
    }
    if (typeof color_levels === 'string') {
        color_levels = [color_levels]
    }
    if (typeof shape_values === 'string') {
        shape_values = [shape_values]
    }
    if (typeof shape_levels === 'string') {
        shape_levels = [shape_levels]
    }
    if (typeof size_values === "number") {
        size_values = [size_values]
    }
    if (typeof size_values === "string") {
        size_values = [size_values]
    }
    if (typeof size_levels === 'string') {
        size_levels = [size_levels]
    }


    color_by_revalue = revalue(color_by, color_levels, color_values)
    shape_by_revalue = revalue(shape_by, shape_levels, shape_values)
    size_by_revalue = revalue(size_by, size_levels, size_values)

    // split the x and y to data traces according to split_by_revalue.
    split_by = color_by.map((x, i) => x + "SLFAN" + shape_by[i] + "SLFAN" + size_by[i])
    split_by_revalue = color_by_revalue.map((x, i) => x + "SLFAN" + shape_by_revalue[i] + "SLFAN" + size_by_revalue[i])




    var xs = groupData(split_by, x)
    var ys = groupData(split_by, y)
    trace_keys = Object.keys(xs)
    //names = revalue(trace_keys, split_by_revalue.filter(unique), split_by.filter(unique))
    names = trace_keys
    texts = groupData(split_by, labels)


    data = []
    for (var i = 0; i < trace_keys.length; i++) {
        data.push({
            mode: 'markers',
            x: xs[trace_keys[i]],
            y: ys[trace_keys[i]],
            name: names[i].replaceAll("SLFAN", " "),
            text: texts[trace_keys[i]],
            marker: {
                color: revalue([trace_keys[i].split("SLFAN")[0]], color_levels, color_values)[0],
                symbol: revalue([trace_keys[i].split("SLFAN")[1]], shape_levels, shape_values)[0],
                size: revalue([trace_keys[i].split("SLFAN")[2]], size_levels, size_values)[0],
            },
            legendgroup: trace_keys[i],
            showlegend: true
        })
    }
    // add ellipse.
    if (ellipse_group === "no_ellipse") {
        console.log("no ellipse")
    } else { // it means use would like to draw ellipse.
        if (typeof (ellipse_group) === 'string') {
            ellipse_group = [ellipse_group]
        }

        ellipse_split_by = Array(x.length).fill("")
        if (ellipse_group.length > 0) {
            for (var i = 0; i < ellipse_group.length; i++) {
                temp_split = eval(ellipse_group[i] + "_by")
                ellipse_split_by = ellipse_split_by.map((x, j) => x + "SLFAN" + temp_split[j])
            }
        }
        ellipse_split_by = ellipse_split_by.map(x => x.slice("SLFAN".length))
        ellipse_split_by_revalue = Array(x.length).fill("")
        if (ellipse_group.length > 0) {
            for (var i = 0; i < ellipse_group.length; i++) {
                temp_split = eval(ellipse_group[i] + "_by_revalue")
                ellipse_split_by_revalue = ellipse_split_by_revalue.map((x, j) => x + "SLFAN" + temp_split[j])
            }
        }
        ellipse_split_by_revalue = ellipse_split_by_revalue.map(x => x.slice(1))
        ellipse_xs_from = groupData(ellipse_split_by, x)
        ellipse_ys_from = groupData(ellipse_split_by, y)

        ellipse_xs_ys = {}
        ellipse_trace_keys = Object.keys(ellipse_xs_from)
        for (var i = 0; i < ellipse_trace_keys.length; i++) {
            ellipse_xs_ys[ellipse_trace_keys[i]] = ellipse(ellipse_xs_from[ellipse_trace_keys[i]],
                ellipse_ys_from[ellipse_trace_keys[i]], 0.95)
        }

        //ellipse_names = revalue(ellipse_trace_keys, ellipse_split_by_revalue.filter(unique), ellipse_split_by.filter(unique))
        ellipse_names = ellipse_trace_keys
        for (var i = 0; i < ellipse_trace_keys.length; i++) {
            revalue_color = revalue([ellipse_trace_keys[i].split("SLFAN")[0]], color_levels, color_values)
            data.push({
                mode: 'lines',
                x: ellipse_xs_ys[ellipse_trace_keys[i]][0],
                y: ellipse_xs_ys[ellipse_trace_keys[i]][1],
                text: null,
                line: {
                    width: 1.889764,
                    color: transparent_rgba(revalue_color[0], 0.1),
                    dash: "solid"
                },
                fill: "toself",
                fillcolor: transparent_rgba(revalue_color[0], 0.1),
                name: ellipse_trace_keys[i],
                showlegend: false,
                hoverinfo: "skip",
                legendgroup: trace_keys[i]
            })
        }
    }




    if (names == "SLFANSLFAN") {
        layout.showlegend = false
    }



    Plotly.newPlot(plot_id, data, layout, { editable: false })


        .then(gd => {
            ggg = gd
            if (!quick_analysis) {
                // Note: cache should not be re-used by repeated calls to JSON.stringify.
                /*var cache = [];
                fullLayout = JSON.stringify(ggg._fullLayout, function (key, value) {
                    if (typeof value === 'object' && value !== null) {
                        if (cache.indexOf(value) !== -1) {
                            // Duplicate reference found, discard key
                            return;
                        }
                        // Store value in our collection
                        cache.push(value);
                    }
                    return value;
                });
                cache = null; // Enable garbage collection
                // Note: cache should not be re-used by repeated calls to JSON.stringify.
                var cache = [];
                fullData = JSON.stringify(ggg._fullData, function (key, value) {
                    if (typeof value === 'object' && value !== null) {
                        if (cache.indexOf(value) !== -1) {
                            // Duplicate reference found, discard key
                            return;
                        }
                        // Store value in our collection
                        cache.push(value);
                    }
                    return value;
                });
                cache = null; // Enable garbage collection*/

                score_plot_parameters = {
                    //full_data: JSON.parse(fullData),
                    //full_layout: JSON.parse(fullLayout),
                    data: ggg.data,
                    layout: ggg.layout,

                }

                if ($("#score_plot_traces_color_by_info").is(":checked")) {
                    score_plot_parameters.score_plot_color_levels = $("#score_plot_color_levels").val()
                }
                if ($("#score_plot_traces_shape_by_info").is(":checked")) {
                    score_plot_parameters.score_plot_shape_levels = $("#score_plot_shape_levels").val()
                }
                if ($("#score_plot_traces_size_by_info").is(":checked")) {
                    score_plot_parameters.score_plot_size_levels = $("#score_plot_size_levels").val()
                }





                // here click to add annotations.
                /*console.log(gd)
                gd.on('plotly_clickannotation', (x) => {
                    console.log(x)
                    console.log('annotation clicked !!!');
                })*/
            }

            Plotly.toImage(gd, { format: 'svg' })
                .then(
                    function (url) {
                        var uuuu = url
                        var uuu = uuuu.replace(/^data:image\/svg\+xml,/, '');
                        uuu = decodeURIComponent(uuu);



                        if (!quick_analysis) {
                            plot_url.score_plot = btoa(unescape(encodeURIComponent(uuu)))
                            files_sources[2] = plot_url.score_plot
                        } else {
                            plot_base64[quick_analysis_project_time][quick_analysis_plot_name] = btoa(unescape(encodeURIComponent(uuu)))
                        }

                        /*var canvas = document.createElement("canvas");
                        var context = canvas.getContext("2d");
                        canvas.width = 4000;
                        canvas.height = 3000;
                        var image = new Image();
                        context.clearRect ( 0, 0, 4000, 3000 );
                        var imgsrc = 'data:image/svg+xml;base64,'+ btoa(unescape(url.replace("data:image/svg+xml,",""))); // Convert SVG string to data URL

                        var image = new Image();
                        image.onload = function() {
                            context.drawImage(image, 0, 0, 4000, 3000);
                            var img = canvas.toDataURL("image/png");
                            base64 = img.replace("data:image/png;base64,","")
                            plot_url.score_plot = base64
                        };
                        image.src = imgsrc*/
                    }
                )



        })
        ;

    myPlot.on('plotly_click', function (data, event) {//https://plot.ly/javascript/text-and-annotations/
        console.log(event)
        ddd = data
        console.log(ddd)
        point = data.points[0]
        newAnnotation = {
            x: point.xaxis.d2l(point.x),
            y: point.yaxis.d2l(point.y),
            arrowhead: 6,
            ax: 0,
            ay: -80,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            arrowcolor: point.fullData.marker.color,
            font: { size: 12 },
            text: point.text,
            captureevents: true
        },
            divid = document.getElementById(plot_id)
        newIndex = (divid.layout.annotations || []).length;
        if (newIndex) {
            var foundCopy = false;
            divid.layout.annotations.forEach(function (ann, sameIndex) {
                if (ann.text === newAnnotation.text) {
                    Plotly.relayout(plot_id, 'annotations[' + sameIndex + ']', 'remove');
                    foundCopy = true;
                }
            });
            if (foundCopy) return;
        }
        Plotly.relayout(plot_id, 'annotations[' + newIndex + ']', newAnnotation);
    })







}
score_plot_fun = scatter_by_group








































plsda_loading_plot_fun = function ({ x = undefined, y = undefined, color_by = undefined, color_values = undefined, color_levels = undefined,
    shape_by = undefined, shape_values = undefined, shape_levels = undefined,
    size_by = undefined, size_values = undefined, size_levels = undefined,
    ellipse_group = ['color', 'shape', 'size'],
    labels = undefined,
    layout = undefined,
    plot_id = undefined, quick_analysis = false, quick_analysis_project_time = undefined, quick_analysis_plot_name = undefined } = {}
) {
    var myPlot = document.getElementById(plot_id)
    if (color_by === undefined) {
        color_by = Array(x.length).fill("")
        if (color_values === undefined) {
            color_values = "black"
        }
        color_levels = ""
    }

    if (shape_by === undefined) {
        shape_by = Array(x.length).fill("")
        if (shape_values === undefined) {
            shape_values = "circle"
        }
        shape_levels = ""
    }
    if (size_by === undefined) {
        size_by = Array(x.length).fill("")
        if (size_values === undefined) {
            size_values = 2
        }
        size_levels = ""
    }

    if (typeof color_values === 'string') {
        color_values = [color_values]
    }
    if (typeof color_levels === 'string') {
        color_levels = [color_levels]
    }
    if (typeof shape_values === 'string') {
        shape_values = [shape_values]
    }
    if (typeof shape_levels === 'string') {
        shape_levels = [shape_levels]
    }
    if (typeof size_values === "number") {
        size_values = [size_values]
    }
    if (typeof size_values === "string") {
        size_values = [size_values]
    }
    if (typeof size_levels === 'string') {
        size_levels = [size_levels]
    }


    color_by_revalue = revalue(color_by, color_levels, color_values)
    shape_by_revalue = revalue(shape_by, shape_levels, shape_values)
    size_by_revalue = revalue(size_by, size_levels, size_values)

    // split the x and y to data traces according to split_by_revalue.
    split_by = color_by.map((x, i) => x + "SLFAN" + shape_by[i] + "SLFAN" + size_by[i])
    split_by_revalue = color_by_revalue.map((x, i) => x + "SLFAN" + shape_by_revalue[i] + "SLFAN" + size_by_revalue[i])




    var xs = groupData(split_by, x)
    var ys = groupData(split_by, y)
    trace_keys = Object.keys(xs)
    //names = revalue(trace_keys, split_by_revalue.filter(unique), split_by.filter(unique))
    names = trace_keys
    texts = groupData(split_by, labels)


    data = []
    for (var i = 0; i < trace_keys.length; i++) {
        data.push({
            mode: 'markers',
            x: xs[trace_keys[i]],
            y: ys[trace_keys[i]],
            name: names[i].replaceAll("SLFAN", " "),
            text: texts[trace_keys[i]],
            marker: {
                color: revalue([trace_keys[i].split("SLFAN")[0]], color_levels, color_values)[0],
                symbol: revalue([trace_keys[i].split("SLFAN")[1]], shape_levels, shape_values)[0],
                size: revalue([trace_keys[i].split("SLFAN")[2]], size_levels, size_values)[0],
            },
            legendgroup: trace_keys[i],
            showlegend: true
        })
    }
    // add ellipse.
    if (ellipse_group === "no_ellipse") {
        console.log("no ellipse")
    } else { // it means use would like to draw ellipse.
        if (typeof (ellipse_group) === 'string') {
            ellipse_group = [ellipse_group]
        }

        ellipse_split_by = Array(x.length).fill("")
        if (ellipse_group.length > 0) {
            for (var i = 0; i < ellipse_group.length; i++) {
                temp_split = eval(ellipse_group[i] + "_by")
                ellipse_split_by = ellipse_split_by.map((x, j) => x + "SLFAN" + temp_split[j])
            }
        }
        ellipse_split_by = ellipse_split_by.map(x => x.slice("SLFAN".length))
        ellipse_split_by_revalue = Array(x.length).fill("")
        if (ellipse_group.length > 0) {
            for (var i = 0; i < ellipse_group.length; i++) {
                temp_split = eval(ellipse_group[i] + "_by_revalue")
                ellipse_split_by_revalue = ellipse_split_by_revalue.map((x, j) => x + "SLFAN" + temp_split[j])
            }
        }
        ellipse_split_by_revalue = ellipse_split_by_revalue.map(x => x.slice(1))
        ellipse_xs_from = groupData(ellipse_split_by, x)
        ellipse_ys_from = groupData(ellipse_split_by, y)

        ellipse_xs_ys = {}
        ellipse_trace_keys = Object.keys(ellipse_xs_from)
        for (var i = 0; i < ellipse_trace_keys.length; i++) {
            ellipse_xs_ys[ellipse_trace_keys[i]] = ellipse(ellipse_xs_from[ellipse_trace_keys[i]],
                ellipse_ys_from[ellipse_trace_keys[i]], 0.95)
        }

        //ellipse_names = revalue(ellipse_trace_keys, ellipse_split_by_revalue.filter(unique), ellipse_split_by.filter(unique))
        ellipse_names = ellipse_trace_keys
        for (var i = 0; i < ellipse_trace_keys.length; i++) {
            data.push({
                mode: 'lines',
                x: ellipse_xs_ys[ellipse_trace_keys[i]][0],
                y: ellipse_xs_ys[ellipse_trace_keys[i]][1],
                text: null,
                line: {
                    width: 1.889764,
                    color: transparent_rgba(revalue([ellipse_trace_keys[i].split("SLFAN")[0]], color_levels, color_values)[0], 0.1),
                    dash: "solid"
                },
                fill: "toself",
                fillcolor: transparent_rgba(revalue([ellipse_trace_keys[i].split("SLFAN")[0]], color_levels, color_values)[0], 0.1),
                name: ellipse_trace_keys[i],
                showlegend: false,
                hoverinfo: "skip",
                legendgroup: trace_keys[i]
            })
        }
    }




    if (names == "SLFANSLFAN") {
        layout.showlegend = false
    }



    Plotly.newPlot(plot_id, data, layout, { editable: false })


        .then(gd => {
            ggg = gd
            if (!quick_analysis) {
                // Note: cache should not be re-used by repeated calls to JSON.stringify.
                /*var cache = [];
                fullLayout = JSON.stringify(ggg._fullLayout, function (key, value) {
                    if (typeof value === 'object' && value !== null) {
                        if (cache.indexOf(value) !== -1) {
                            // Duplicate reference found, discard key
                            return;
                        }
                        // Store value in our collection
                        cache.push(value);
                    }
                    return value;
                });
                cache = null; // Enable garbage collection
                // Note: cache should not be re-used by repeated calls to JSON.stringify.
                var cache = [];
                fullData = JSON.stringify(ggg._fullData, function (key, value) {
                    if (typeof value === 'object' && value !== null) {
                        if (cache.indexOf(value) !== -1) {
                            // Duplicate reference found, discard key
                            return;
                        }
                        // Store value in our collection
                        cache.push(value);
                    }
                    return value;
                });
                cache = null; // Enable garbage collection*/

                loading_plot_parameters = {
                    //full_data: JSON.parse(fullData),
                    //full_layout: JSON.parse(fullLayout),
                    data: ggg.data,
                    layout: ggg.layout,

                }

                if ($("#loading_plot_traces_color_by_info").is(":checked")) {
                    loading_plot_parameters.loading_plot_color_levels = $("#loading_plot_color_levels").val()
                }
                if ($("#loading_plot_traces_shape_by_info").is(":checked")) {
                    loading_plot_parameters.loading_plot_shape_levels = $("#loading_plot_shape_levels").val()
                }
                if ($("#loading_plot_traces_size_by_info").is(":checked")) {
                    loading_plot_parameters.loading_plot_size_levels = $("#loading_plot_size_levels").val()
                }





                // here click to add annotations.
                /*console.log(gd)
                gd.on('plotly_clickannotation', (x) => {
                    console.log(x)
                    console.log('annotation clicked !!!');
                })*/
            }

            Plotly.toImage(gd, { format: 'svg' })
                .then(
                    function (url) {
                        var uuuu = url
                        var uuu = uuuu.replace(/^data:image\/svg\+xml,/, '');
                        uuu = decodeURIComponent(uuu);



                        if (!quick_analysis) {
                            plot_url.loading_plot = btoa(unescape(encodeURIComponent(uuu)))
                            files_sources[3] = plot_url.loading_plot
                        } else {
                            plot_base64[quick_analysis_project_time][quick_analysis_plot_name] = btoa(unescape(encodeURIComponent(uuu)))
                        }


                    }
                )



        })
        ;

    myPlot.on('plotly_click', function (data, event) {//https://plot.ly/javascript/text-and-annotations/
        console.log(event)
        ddd = data
        console.log(ddd)
        point = data.points[0]
        newAnnotation = {
            x: point.xaxis.d2l(point.x),
            y: point.yaxis.d2l(point.y),
            arrowhead: 6,
            ax: 0,
            ay: -80,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            arrowcolor: point.fullData.marker.color,
            font: { size: 12 },
            text: point.text,
            captureevents: true
        },
            divid = document.getElementById(plot_id)
        newIndex = (divid.layout.annotations || []).length;
        if (newIndex) {
            var foundCopy = false;
            divid.layout.annotations.forEach(function (ann, sameIndex) {
                if (ann.text === newAnnotation.text) {
                    Plotly.relayout(plot_id, 'annotations[' + sameIndex + ']', 'remove');
                    foundCopy = true;
                }
            });
            if (foundCopy) return;
        }
        Plotly.relayout(plot_id, 'annotations[' + newIndex + ']', newAnnotation);
    })







}






loading_plot_fun = function ({ x = undefined, y = undefined, color_by = undefined, color_values = undefined, color_levels = undefined,
    shape_by = undefined, shape_values = undefined, shape_levels = undefined,
    size_by = undefined, size_values = undefined, size_levels = undefined,
    ellipse_group = ['color', 'shape', 'size'],
    labels = undefined,
    layout = undefined,
    plot_id = undefined, quick_analysis = false, quick_analysis_project_time = undefined, quick_analysis_plot_name = undefined } = {}
) {
    var myPlot = document.getElementById(plot_id)
    if (color_by === undefined) {
        color_by = Array(x.length).fill("")
        if (color_values === undefined) {
            color_values = "black"
        }
        color_levels = ""
    }

    if (shape_by === undefined) {
        shape_by = Array(x.length).fill("")
        if (shape_values === undefined) {
            shape_values = "circle"
        }
        shape_levels = ""
    }
    if (size_by === undefined) {
        size_by = Array(x.length).fill("")
        if (size_values === undefined) {
            size_values = 2
        }
        size_levels = ""
    }

    if (typeof color_values === 'string') {
        color_values = [color_values]
    }
    if (typeof color_levels === 'string') {
        color_levels = [color_levels]
    }
    if (typeof shape_values === 'string') {
        shape_values = [shape_values]
    }
    if (typeof shape_levels === 'string') {
        shape_levels = [shape_levels]
    }
    if (typeof size_values === "number") {
        size_values = [size_values]
    }
    if (typeof size_values === "string") {
        size_values = [size_values]
    }
    if (typeof size_levels === 'string') {
        size_levels = [size_levels]
    }


    color_by_revalue = revalue(color_by, color_levels, color_values)
    shape_by_revalue = revalue(shape_by, shape_levels, shape_values)
    size_by_revalue = revalue(size_by, size_levels, size_values)

    // split the x and y to data traces according to split_by_revalue.
    split_by = color_by.map((x, i) => x + "SLFAN" + shape_by[i] + "SLFAN" + size_by[i])
    split_by_revalue = color_by_revalue.map((x, i) => x + "SLFAN" + shape_by_revalue[i] + "SLFAN" + size_by_revalue[i])




    var xs = groupData(split_by, x)
    var ys = groupData(split_by, y)
    trace_keys = Object.keys(xs)
    //names = revalue(trace_keys, split_by_revalue.filter(unique), split_by.filter(unique))
    names = trace_keys
    texts = groupData(split_by, labels)


    data = []
    for (var i = 0; i < trace_keys.length; i++) {
        data.push({
            mode: 'markers',
            x: xs[trace_keys[i]],
            y: ys[trace_keys[i]],
            name: names[i].replaceAll("SLFAN", " "),
            text: texts[trace_keys[i]],
            marker: {
                color: revalue([trace_keys[i].split("SLFAN")[0]], color_levels, color_values)[0],
                symbol: revalue([trace_keys[i].split("SLFAN")[1]], shape_levels, shape_values)[0],
                size: revalue([trace_keys[i].split("SLFAN")[2]], size_levels, size_values)[0],
            },
            legendgroup: trace_keys[i],
            showlegend: true
        })
    }
    // add ellipse.
    if (ellipse_group === "no_ellipse") {
        console.log("no ellipse")
    } else { // it means use would like to draw ellipse.
        if (typeof (ellipse_group) === 'string') {
            ellipse_group = [ellipse_group]
        }

        ellipse_split_by = Array(x.length).fill("")
        if (ellipse_group.length > 0) {
            for (var i = 0; i < ellipse_group.length; i++) {
                temp_split = eval(ellipse_group[i] + "_by")
                ellipse_split_by = ellipse_split_by.map((x, j) => x + "SLFAN" + temp_split[j])
            }
        }
        ellipse_split_by = ellipse_split_by.map(x => x.slice("SLFAN".length))
        ellipse_split_by_revalue = Array(x.length).fill("")
        if (ellipse_group.length > 0) {
            for (var i = 0; i < ellipse_group.length; i++) {
                temp_split = eval(ellipse_group[i] + "_by_revalue")
                ellipse_split_by_revalue = ellipse_split_by_revalue.map((x, j) => x + "SLFAN" + temp_split[j])
            }
        }
        ellipse_split_by_revalue = ellipse_split_by_revalue.map(x => x.slice(1))
        ellipse_xs_from = groupData(ellipse_split_by, x)
        ellipse_ys_from = groupData(ellipse_split_by, y)

        ellipse_xs_ys = {}
        ellipse_trace_keys = Object.keys(ellipse_xs_from)
        for (var i = 0; i < ellipse_trace_keys.length; i++) {
            ellipse_xs_ys[ellipse_trace_keys[i]] = ellipse(ellipse_xs_from[ellipse_trace_keys[i]],
                ellipse_ys_from[ellipse_trace_keys[i]], 0.95)
        }

        //ellipse_names = revalue(ellipse_trace_keys, ellipse_split_by_revalue.filter(unique), ellipse_split_by.filter(unique))
        ellipse_names = ellipse_trace_keys
        for (var i = 0; i < ellipse_trace_keys.length; i++) {
            data.push({
                mode: 'lines',
                x: ellipse_xs_ys[ellipse_trace_keys[i]][0],
                y: ellipse_xs_ys[ellipse_trace_keys[i]][1],
                text: null,
                line: {
                    width: 1.889764,
                    color: transparent_rgba(revalue([ellipse_trace_keys[i].split("SLFAN")[0]], color_levels, color_values)[0], 0.1),
                    dash: "solid"
                },
                fill: "toself",
                fillcolor: transparent_rgba(revalue([ellipse_trace_keys[i].split("SLFAN")[0]], color_levels, color_values)[0], 0.1),
                name: ellipse_trace_keys[i],
                showlegend: false,
                hoverinfo: "skip",
                legendgroup: trace_keys[i]
            })
        }
    }




    if (names == "SLFANSLFAN") {
        layout.showlegend = false
    }



    Plotly.newPlot(plot_id, data, layout, { editable: false })


        .then(gd => {
            ggg = gd
            if (!quick_analysis) {
                // Note: cache should not be re-used by repeated calls to JSON.stringify.
                /*var cache = [];
                fullLayout = JSON.stringify(ggg._fullLayout, function (key, value) {
                    if (typeof value === 'object' && value !== null) {
                        if (cache.indexOf(value) !== -1) {
                            // Duplicate reference found, discard key
                            return;
                        }
                        // Store value in our collection
                        cache.push(value);
                    }
                    return value;
                });
                cache = null; // Enable garbage collection
                // Note: cache should not be re-used by repeated calls to JSON.stringify.
                var cache = [];
                fullData = JSON.stringify(ggg._fullData, function (key, value) {
                    if (typeof value === 'object' && value !== null) {
                        if (cache.indexOf(value) !== -1) {
                            // Duplicate reference found, discard key
                            return;
                        }
                        // Store value in our collection
                        cache.push(value);
                    }
                    return value;
                });
                cache = null; // Enable garbage collection*/

                loading_plot_parameters = {
                    //full_data: JSON.parse(fullData),
                    //full_layout: JSON.parse(fullLayout),
                    data: ggg.data,
                    layout: ggg.layout,

                }

                if ($("#loading_plot_traces_color_by_info").is(":checked")) {
                    loading_plot_parameters.loading_plot_color_levels = $("#loading_plot_color_levels").val()
                }
                if ($("#loading_plot_traces_shape_by_info").is(":checked")) {
                    loading_plot_parameters.loading_plot_shape_levels = $("#loading_plot_shape_levels").val()
                }
                if ($("#loading_plot_traces_size_by_info").is(":checked")) {
                    loading_plot_parameters.loading_plot_size_levels = $("#loading_plot_size_levels").val()
                }





                // here click to add annotations.
                /*console.log(gd)
                gd.on('plotly_clickannotation', (x) => {
                    console.log(x)
                    console.log('annotation clicked !!!');
                })*/
            }

            Plotly.toImage(gd, { format: 'svg' })
                .then(
                    function (url) {
                        var uuuu = url
                        var uuu = uuuu.replace(/^data:image\/svg\+xml,/, '');
                        uuu = decodeURIComponent(uuu);



                        if (!quick_analysis) {
                            plot_url.loading_plot = btoa(unescape(encodeURIComponent(uuu)))
                            files_sources[3] = plot_url.loading_plot
                        } else {
                            plot_base64[quick_analysis_project_time][quick_analysis_plot_name] = btoa(unescape(encodeURIComponent(uuu)))
                        }


                    }
                )



        })
        ;

    myPlot.on('plotly_click', function (data, event) {//https://plot.ly/javascript/text-and-annotations/
        console.log(event)
        ddd = data
        console.log(ddd)
        point = data.points[0]
        newAnnotation = {
            x: point.xaxis.d2l(point.x),
            y: point.yaxis.d2l(point.y),
            arrowhead: 6,
            ax: 0,
            ay: -80,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            arrowcolor: point.fullData.marker.color,
            font: { size: 12 },
            text: point.text,
            captureevents: true
        },
            divid = document.getElementById(plot_id)
        newIndex = (divid.layout.annotations || []).length;
        if (newIndex) {
            var foundCopy = false;
            divid.layout.annotations.forEach(function (ann, sameIndex) {
                if (ann.text === newAnnotation.text) {
                    Plotly.relayout(plot_id, 'annotations[' + sameIndex + ']', 'remove');
                    foundCopy = true;
                }
            });
            if (foundCopy) return;
        }
        Plotly.relayout(plot_id, 'annotations[' + newIndex + ']', newAnnotation);
    })







}



scree_plot_fun = function ({ ys = undefined, texts = undefined, hovertexts = undefined, names = undefined, add_line_trace = undefined, line_trace_index = undefined, scree_plot_layout = undefined, plot_id = undefined, quick_analysis = false, quick_analysis_project_time = undefined, quick_analysis_plot_name = undefined }) { // ys, texts, hovertexts, is [[xxx],[xxx]]. names is [x,x,x].add_line_trace is true
    var x = Array.from({ length: ys[0].length }, (v, k) => k + 1);
    var myPlot = document.getElementById(plot_id)
    scree_plot_data = []
    for (var i = 0; i < ys.length; i++) {
        scree_plot_data.push({
            orientation: "v",
            base: 0,
            x: x,
            y: ys[i],
            text: texts[i],
            type: 'bar',
            marker: {
                autocolorscale: false,
                //color: "rgba(89,181,199,1)",
                line: {
                    width: 2,
                    //color: "rgba(89,181,199,1)"
                }
            },
            showlegend: true,
            xaxis: "x",
            yaxis: "y",
            hoverinfo: "text",
            mode: "",
            name: names[i]
        })
    }

    if (add_line_trace) {
        scree_plot_data.push({ //line trace.
            x: x,
            y: ys[line_trace_index],
            text: texts[line_trace_index],
            mode: "lines+markers",
            line: {
                width: 2,
                color: "rgba(0,0,0,1)",
                dash: "solid"
            },
            hoveron: "points",
            showlegend: false,
            xaxis: "x",
            yaxis: "y",
            hoverinfo: "text",
            marker: {
                autocolorscale: false,
                color: "rgba(0,0,0,1)",
                opacity: 1,
                size: 6,
                symbol: "circle",
                line: {
                    width: 2,
                    color: "rgba(0,0,0,1)"
                }
            },
            name: ""
        })
        scree_plot_data.push({ // scatter trace.
            x: x.map(x => x + 0.3),
            y: ys[line_trace_index].map(x => x + 0.02),
            text: texts[line_trace_index],
            hovertext: hovertexts[line_trace_index],
            textfont: {
                size: 15,
                color: "rgba(0,0,0,1)",
            },
            type: 'scatter',
            mode: "text",
            hoveron: "points",
            showlegend: false,
            xaxis: "x",
            yaxis: "y",
            hoverinfo: "text",
            name: ""
        })
    }




    Plotly.newPlot(plot_id, scree_plot_data, scree_plot_layout, { editable: false })


        .then(gd => {
            scree_plot_gd = gd

            scree_plot_parameters = {
                data: scree_plot_gd.data,
                layout: scree_plot_gd.layout,
            }


            Plotly.toImage(gd, { format: 'svg' })
                .then(
                    function (url) {
                        var scree_plot_url = url
                        var scree_plot_url2 = scree_plot_url.replace(/^data:image\/svg\+xml,/, '');
                        scree_plot_url2 = decodeURIComponent(scree_plot_url2);


                        if (!quick_analysis) {
                            plot_url.scree_plot = btoa(unescape(encodeURIComponent(scree_plot_url2)))
                            files_sources[4] = plot_url.scree_plot
                        } else {
                            plot_base64[quick_analysis_project_time][quick_analysis_plot_name] = btoa(unescape(encodeURIComponent(scree_plot_url2)))
                        }

                    }
                )



        });

}








plsda_scree_plot_fun = function ({ ys = undefined, texts = undefined, hovertexts = undefined, names = undefined, add_line_trace = undefined, line_trace_index = undefined, layout = undefined, plot_id = undefined, quick_analysis = false, quick_analysis_project_time = undefined, quick_analysis_plot_name = undefined }) { // ys, texts, hovertexts, is [[xxx],[xxx]]. names is [x,x,x].add_line_trace is true
    var x = Array.from({ length: ys[0].length }, (v, k) => k + 1);
    var myPlot = document.getElementById(plot_id)
    scree_plot_data = []
    for (var i = 0; i < ys.length; i++) {
        scree_plot_data.push({
            orientation: "v",
            base: 0,
            x: x,
            y: ys[i],
            text: texts[i],
            type: 'bar',
            marker: {
                autocolorscale: false,
                //color: "rgba(89,181,199,1)",
                line: {
                    width: 2,
                    //color: "rgba(89,181,199,1)"
                }
            },
            showlegend: true,
            xaxis: "x",
            yaxis: "y",
            hoverinfo: "text",
            mode: "",
            name: names[i]
        })
    }

    if (add_line_trace) {
        scree_plot_data.push({ //line trace.
            x: x,
            y: ys[line_trace_index],
            text: texts[line_trace_index],
            mode: "lines+markers",
            line: {
                width: 2,
                color: "rgba(0,0,0,1)",
                dash: "solid"
            },
            hoveron: "points",
            showlegend: false,
            xaxis: "x",
            yaxis: "y",
            hoverinfo: "text",
            marker: {
                autocolorscale: false,
                color: "rgba(0,0,0,1)",
                opacity: 1,
                size: 6,
                symbol: "circle",
                line: {
                    width: 2,
                    color: "rgba(0,0,0,1)"
                }
            },
            name: ""
        })
        scree_plot_data.push({ // scatter trace.
            x: x.map(x => x + 0.3),
            y: ys[line_trace_index].map(x => x + 0.02),
            text: texts[line_trace_index],
            hovertext: hovertexts[line_trace_index],
            textfont: {
                size: 15,
                color: "rgba(0,0,0,1)",
            },
            type: 'scatter',
            mode: "text",
            hoveron: "points",
            showlegend: false,
            xaxis: "x",
            yaxis: "y",
            hoverinfo: "text",
            name: ""
        })
    }




    Plotly.newPlot(plot_id, scree_plot_data, layout, { editable: false })


        .then(gd => {
            scree_plot_gd = gd

            scree_plot_parameters = {
                data: scree_plot_gd.data,
                layout: scree_plot_gd.layout,
            }


            Plotly.toImage(gd, { format: 'svg' })
                .then(
                    function (url) {
                        var scree_plot_url = url
                        var scree_plot_url2 = scree_plot_url.replace(/^data:image\/svg\+xml,/, '');
                        scree_plot_url2 = decodeURIComponent(scree_plot_url2);


                        if (!quick_analysis) {
                            plot_url.scree_plot = btoa(unescape(encodeURIComponent(scree_plot_url2)))
                            files_sources[4] = plot_url.scree_plot
                        } else {
                            plot_base64[quick_analysis_project_time][quick_analysis_plot_name] = btoa(unescape(encodeURIComponent(scree_plot_url2)))
                        }

                    }
                )



        });

}










perm_plot_fun = function ({ obj_perm_plot = undefined,
    layout = undefined,
    plot_id = undefined, quick_analysis = false, quick_analysis_project_time = undefined, quick_analysis_plot_name = undefined } = {}) {


    var perm = obj_perm_plot.perm_table

    var sim = unpack(perm, 'sim')
    var y = unpack(perm, "y")
    var type = unpack(perm, "type")
    var R2_index = getAllIndexes(type, "R2")
    var Q2_index = getAllIndexes(type, "Q2")
    var R2_sim = R2_index.map(x => sim[x])
    var Q2_sim = Q2_index.map(x => sim[x])
    var R2_y = R2_index.map(x => y[x])
    var Q2_y = Q2_index.map(x => y[x])

    var sim_mean = jStat.mean(R2_sim.slice(1))
    var R2_mean = jStat.mean(R2_y.slice(1))
    var Q2_mean = jStat.mean(Q2_y.slice(1))
    var R2_slope = (R2_y[0] - R2_mean) / (1 - sim_mean)
    var Q2_slope = (Q2_y[0] - Q2_mean) / (1 - sim_mean)
    var R2_intercept = R2_y[0] - R2_slope
    var Q2_intercept = Q2_y[0] - Q2_slope



    var trace_Q2 = {
        x: Q2_sim.slice(1),
        y: Q2_y.slice(1),
        type: "scatter",
        mode: "markers",
        marker: {
            color: "rgba(218,97,86,1)",
            size: 6,
            symbol: "circle-open"
        },
        hoveron: "points",
        name: "Q2",
        legendgroup: "Q2",
        showlegend: false,
        xaxis: "x",
        yaxis: "y",
        hoverinfo: "y"
    }
    var trace_Q2_dot = {
        x: [Q2_sim[0]],
        y: [Q2_y[0]],
        type: "scatter",
        mode: "markers",
        marker: {
            color: "rgba(218,97,86,1)",
            size: 12,
            symbol: "circle"
        },
        hoveron: "points",
        name: "Q2",
        legendgroup: "Q2",
        showlegend: true,
        xaxis: "x",
        yaxis: "y",
        hoverinfo: "y"
    }
    var trace_Q2_line = {
        x: [Q2_sim[0], 0],
        y: [Q2_y[0], Q2_intercept],
        type: "scatter",
        mode: "lines",
        line: {
            color: "rgba(218,97,86,1)",
            dash: "dash"
        },
        name: "Q2_line",
        legendgroup: "Q2",
        showlegend: false,
        xaxis: "x",
        yaxis: "y",
        hoverinfo: "skip"
    }
    var trace_R2 = {
        x: R2_sim.slice(1),
        y: R2_y.slice(1),
        type: "scatter",
        mode: "markers",
        marker: {
            color: "rgba(112,177,192,1)",
            size: 6,
            symbol: "circle-open"
        },
        hoveron: "points",
        name: "R2",
        legendgroup: "R2",
        showlegend: false,
        xaxis: "x",
        yaxis: "y",
        hoverinfo: "y"
    }
    var trace_R2_dot = {
        x: [R2_sim[0]],
        y: [R2_y[0]],
        type: "scatter",
        mode: "markers",
        marker: {
            color: "rgba(112,177,192,1)",
            size: 12,
            symbol: "circle"
        },
        hoveron: "points",
        name: "R2",
        legendgroup: "R2",
        showlegend: true,
        xaxis: "x",
        yaxis: "y",
        hoverinfo: "y"
    }
    var trace_R2_line = {
        x: [R2_sim[0], 0],
        y: [R2_y[0], R2_intercept],
        type: "scatter",
        mode: "lines",
        line: {
            color: "rgba(112,177,192,1)",
            dash: "dash"
        },
        name: "R2_line",
        legendgroup: "R2",
        showlegend: false,
        xaxis: "x",
        yaxis: "y",
        hoverinfo: "skip"
    }

    var data = [trace_Q2, trace_Q2_dot, trace_Q2_line, trace_R2, trace_R2_dot, trace_R2_line]


    Plotly.newPlot(plot_id, data, layout).then(gd => {
        perm_plot_gd = gd

        perm_plot_parameters = {
            data: perm_plot_gd.data,
            layout: perm_plot_gd.layout,
        }


        Plotly.toImage(gd, { format: 'svg' })
            .then(
                function (url) {
                    var perm_plot_url = url
                    var perm_plot_url2 = perm_plot_url.replace(/^data:image\/svg\+xml,/, '');
                    perm_plot_url2 = decodeURIComponent(perm_plot_url2);


                    if (!quick_analysis) {
                        plot_url.perm_plot = btoa(unescape(encodeURIComponent(perm_plot_url2)))
                        files_sources[6] = plot_url.perm_plot
                    } else {
                        plot_base64[quick_analysis_project_time][quick_analysis_plot_name] = btoa(unescape(encodeURIComponent(perm_plot_url2)))
                    }

                }
            )



    });
}















vip_plot_fun = function ({ obj_vip_plot = undefined,
    layout = undefined,
    plot_id = undefined, quick_analysis = false, quick_analysis_project_time = undefined, quick_analysis_plot_name = undefined } = {}) {
    var vip_scores = unpack(obj_vip_plot.vip_table, "vip")
    var y_text = unpack(obj_vip_plot.vip_table, "label")
    var vip_heatmap_z = obj_vip_plot.vip_heatmap
    var vip_heatmap_text = obj_vip_plot.vip_heatmap_text

    var n_vip = Number(layout.traces.n_vip)
    var vip = vip_scores.slice(1, n_vip + 1);
    var y_text = y_text.slice(1, n_vip + 1);
    var vip_heatmap_z = vip_heatmap_z.slice(1, n_vip + 1);
    var y = Array.apply(null, { length: vip.length }).map(Number.call, Number)
    y = y.map(x => x + 1)
    vip_heatmap_x = Array.apply(null, { length: vip_heatmap_z[0].length }).map(Number.call, Number)
    vip_heatmap_x = vip_heatmap_x.map(x => x + 1)

    var trace1 = {
        x: vip,
        y: y,
        type: "scatter",
        xaxis: "x",
        yaxis: "y",
        mode: 'markers',
        marker: {
            size: 12,
            color: "rgba(0,0,0,1)"
        }
    }
    var trace2 = {
        x: vip_heatmap_x,
        y: y,
        z: vip_heatmap_z,
        xgap: 3,
        ygap: 3,
        colorscale: layout.traces.colorscale,
        type: 'heatmap',
        showscale: true,
        colorbar: {
            thicknessmode: "fraction",
            thickness: 0.05,
            lenmode: "fraction",
            len: 0.3,
            x: layout.legend.x,
            y: layout.legend.y,
            bordercolor: layout.legend.bordercolor,
            borderwidth: layout.legend.borderwidth,
            bgcolor: layout.legend.bgcolor,
            outlinecolor: "white",
            nticks: 2,
            ticklen: 0,
            tickvals: [1, jStat.max(vip_heatmap_z[0])],
            ticktext: ["low", "high"],
            tickcolor: "black",
            tickfont: {
                family: layout.legend.font.family,
                color: layout.legend.font.color,
                size: layout.legend.font.size
            }
        },
        xaxis: "x2",
        yaxis: "y",
        hoverinfo: "skip",
        name: ""
    }


    layout.yaxis.ticktext = y_text
    layout.yaxis.tickvals = y

    layout.xaxis2.tickvals = vip_heatmap_x
    layout.xaxis2.ticktext = vip_heatmap_text

    layout.showlegend = false

    Plotly.newPlot(plot_id, [trace1, trace2], layout).then(gd => {
        vip_plot_gd = gd

        vip_plot_parameters = {
            data: vip_plot_gd.data,
            layout: vip_plot_gd.layout,
        }


        Plotly.toImage(gd, { format: 'svg' })
            .then(
                function (url) {
                    var vip_plot_url = url
                    var vip_plot_url2 = vip_plot_url.replace(/^data:image\/svg\+xml,/, '');
                    vip_plot_url2 = decodeURIComponent(vip_plot_url2);


                    if (!quick_analysis) {
                        plot_url.vip_plot = btoa(unescape(encodeURIComponent(vip_plot_url2)))
                        files_sources[5] = plot_url.vip_plot
                    } else {
                        plot_base64[quick_analysis_project_time][quick_analysis_plot_name] = btoa(unescape(encodeURIComponent(vip_plot_url2)))
                    }

                }
            )



    });
}
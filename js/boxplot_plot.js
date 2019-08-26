



$.get("plot_layout_adjuster.html", function (plot_layout_adjuster_string) {
    $("#boxplot_plot_to_be_loaded").append($.parseHTML(plot_layout_adjuster_string.replaceAll("PLOT_NAME", "boxplot_plot")));

    $.ajax({
        url: "js/plot_layout_adjuster1.js", converters: { 'text script': function (text) { return text; } }, success: function (plot_layout_adjuster1) {

            adjusted_boxplot_plot_layout_adjuster1 = plot_layout_adjuster1.replace(/PLOT_NAME/g, 'boxplot_plot')
            eval(adjusted_boxplot_plot_layout_adjuster1)

            // assign the default value for boxplot plot
            ocpu.call("call_fun", {
                parameter: {
                    user_id: localStorage.user_id,
                    fun_name: "get_boxplot_plot_style"
                }
            }, function (session) {
                session.getObject(function (boxplot_plot_obj) {
                    boxplot_plot_obj = prepare_layout(boxplot_plot_obj)
                    boxplot_plot_obj_global = boxplot_plot_obj
                    boxplot_plot_traces = boxplot_plot_obj.traces
                    p_column_names = Object.keys(obj_boxplot_plot.p[0])
                    p_column_unique = {}
                    p_column_unique_length = {}

                    for (var i = 0; i < p_column_names.length; i++) {
                        p_column_unique[p_column_names[i]] = unpack(obj_boxplot_plot.p, p_column_names[i]).filter(unique)
                        p_column_unique_length[p_column_names[i]] = p_column_unique[p_column_names[i]].length
                        $('#boxplot_plot_group_sample_by').append($('<option>', {
                            value: p_column_names[i],
                            text: p_column_names[i]
                        }));
                        $("#boxplot_plot_group_sample_by").selectpicker('refresh')
                    }
                    var boxplot_plot_group_sample_by_last_valid_selection = null;
                    $("#boxplot_plot_group_sample_by").change(function () {
                        console.log($(this).val().length)
                        if ($(this).val().length > 2) {
                            alert("Cannot select more than two groups.")
                            $(this).val(boxplot_plot_group_sample_by_last_valid_selection);
                        } else if ($(this).val().length == 0) {

                            $("#boxplot_plot_group_sample_levels_div").hide()
                            $("#boxplot_plot_group_sample_main_div").hide();

                            boxplot_plot_group_sample_main_color_div = '<div class="input-group">' +
                                '<div class="input-group-prepend">' +
                                '<span class="input-group_text">' +
                                'box color' +
                                '</span>' +
                                '</div>' +
                                '<input type="text" id="boxplot_color" class="spectrums" data-show-alpha="true" onchange="boxplot_plot_debounced()" />' +
                                '</div>'

                            $("#boxplot_plot_group_sample_main_color_div").html(boxplot_plot_group_sample_main_color_div)

                            $("#boxplot_color").spectrum({
                                color: boxplot_plot_traces.box_colors[1],
                                showPalette: true,
                                palette: color_pallete
                            })



                            boxplot_plot_debounced()




                        } else {
                            $("#boxplot_plot_group_sample_levels_div").show()
                            $("#boxplot_plot_group_sample_main_div").show();

                            $("#boxplot_plot_group_sample_main").empty();
                            for (var j = 0; j < $(this).val().length; j++) {

                                $("#boxplot_plot_group_sample_main").append($('<option>', {
                                    value: $(this).val()[j],
                                    text: $(this).val()[j]
                                }))
                            }
                            $("#boxplot_plot_group_sample_main").selectpicker('refresh')
                            boxplot_plot_group_sample_main_change = function () {
                                boxplot_plot_group_sample_main_color_div = ""
                                var color_by = [$("#boxplot_plot_group_sample_main").val()]
                                for (var i = 0; i < color_by.length; i++) {
                                    boxplot_plot_group_sample_main_color_div = boxplot_plot_group_sample_main_color_div +
                                        '<label>' + color_by[i] + '</label>'
                                    for (var j = 0; j < p_column_unique_length[color_by[i]]; j++) {
                                        boxplot_plot_group_sample_main_color_div = boxplot_plot_group_sample_main_color_div +
                                            '<div class="input-group">' +
                                            '<div class="input-group-prepend"><span class="input-group-text">' + p_column_unique[color_by[i]][j] + '</span></div>' +
                                            '<input type="text" id="color_by_' + p_column_unique[color_by[i]][j] + '" class="spectrums color_by color_by_' + color_by[i] + '" data-show-alpha="true" onchange="boxplot_plot_debounced()" />' + '</div>'
                                    }
                                }
                                $("#boxplot_plot_group_sample_main_color_div").html(boxplot_plot_group_sample_main_color_div)
                                for (var i = 0; i < color_by.length; i++) {
                                    var temp_colors = boxplot_plot_traces.box_colors[p_column_unique_length[color_by[i]]]
                                    for (var j = 0; j < p_column_unique_length[color_by[i]]; j++) {
                                        $("[id='color_by_" + p_column_unique[color_by[i]][j] + "']").spectrum({
                                            color: temp_colors[j],
                                            showPalette: true,
                                            palette: color_pallete
                                        });
                                        $("[id='color_by_" + p_column_unique[color_by[i]][j] + "']").change(boxplot_plot_debounced)
                                    }
                                }
                                boxplot_plot_debounced()
                            }
                            $("#boxplot_plot_group_sample_main").change(boxplot_plot_group_sample_main_change)
                            $("#boxplot_plot_group_sample_main").val($(this).val()[0])
                            $("#boxplot_plot_group_sample_main").selectpicker('refresh')
                            boxplot_plot_group_sample_main_change()






                            boxplot_plot_group_sample_by_last_valid_selection = $(this).val();
                            boxplot_plot_group_sample_levels_div = ""
                            group_sample_by = $("#boxplot_plot_group_sample_by").val()

                            for (var i = 0; i < group_sample_by.length; i++) {
                                boxplot_plot_group_sample_levels_div = boxplot_plot_group_sample_levels_div +
                                    '<div class="form-group">' +
                                    '<label for="group_sample_by_' + group_sample_by[i] + '">' + group_sample_by[i] + '</label>' +
                                    '<input type="text" class="form-control group_sample_levels" id="group_sample_by_' + group_sample_by[i] + '" aria-describedby="" placeholder="" onchange="boxplot_plot_debounced()">' +
                                    '</div>'
                            }
                            $("#boxplot_plot_group_sample_levels_div").html(boxplot_plot_group_sample_levels_div)
                            for (var i = 0; i < group_sample_by.length; i++) {
                                $("#group_sample_by_" + group_sample_by[i]).val(p_column_unique[group_sample_by[i]].join("||"))
                            }
                            boxplot_plot_debounced()
                        }
                    })


                    f_column_names = Object.keys(obj_boxplot_plot.f[0])
                    f_column_unique = {}
                    f_column_unique_length = {}
                    for (var i = 0; i < f_column_names.length; i++) {
                        f_column_unique[f_column_names[i]] = unpack(obj_boxplot_plot.f, f_column_names[i]).filter(unique)
                        f_column_unique_length[f_column_names[i]] = f_column_unique[f_column_names[i]].length

                    }
                    var f_label = unpack(obj_boxplot_plot.f, "label")
                    for (var i = 0; i < f_label.length; i++) {
                        $('#compound').append($('<option>', {
                            value: f_label[i],
                            text: f_label[i]
                        }));
                    }
                    $("#compound").selectpicker('refresh')


                    $.ajax({
                        url: "js/plot_layout_adjuster2.js", converters: { 'text script': function (text) { return text; } }, success: function (plot_layout_adjuster2) {
                            adjusted_boxplot_plot_layout_adjuster2 = plot_layout_adjuster2.replace(/PLOT_NAME/g, 'boxplot_plot')
                            eval(adjusted_boxplot_plot_layout_adjuster2)
                            // initialize the traces on HTML.
                            $("#fillcolor_transparency").val(boxplot_plot_obj.traces.fillcolor_transparency)
                            $("#jitter").val(boxplot_plot_obj.traces.jitter)
                            $("#pointpos").val(boxplot_plot_obj.traces.pointpos)
                            $("#size").val(boxplot_plot_obj.traces.size)
                            $("#line_width").val(boxplot_plot_obj.traces.line_width)

                            $("#symbol").val(boxplot_plot_obj.traces.symbol)
                            $("#symbol").selectpicker('refresh')
                            $("#boxpoints").val(boxplot_plot_obj.traces.boxpoints)
                            $("#boxpoints").selectpicker('refresh')

                            $("#outliercolor").spectrum({
                                color: boxplot_plot_obj.traces.outliercolor,
                                showPalette: true,
                                palette: color_pallete
                            })

                            if (boxplot_plot_obj.traces.notched === 'FALSE') {
                                boxplot_plot_obj.traces.notched = false
                            }
                            $("#whiskerwidth").val(boxplot_plot_obj.traces.whiskerwidth)
                            $("#notched").prop("checked", boxplot_plot_obj.traces.notched).change();
                            $("#notchwidth").val(boxplot_plot_obj.traces.notchwidth)
                            $("#boxmean").val(boxplot_plot_obj.traces.boxmean)




                            $("#boxplot_plot_group_sample_levels_div").hide()
                            $("#boxplot_plot_group_sample_main_div").hide();

                            boxplot_plot_group_sample_main_color_div = '<div class="input-group">' +
                                '<div class="input-group-prepend">' +
                                '<span class="input-group_text">' +
                                'box color' +
                                '</span>' +
                                '</div>' +
                                '<input type="text" id="boxplot_color" class="spectrums" data-show-alpha="true" onchange="boxplot_plot_debounced()" />' +
                                '</div>'

                            $("#boxplot_plot_group_sample_main_color_div").html(boxplot_plot_group_sample_main_color_div)

                            $("#boxplot_color").spectrum({
                                color: boxplot_plot_traces.box_colors[1],
                                showPalette: true,
                                palette: color_pallete
                            })



                            boxplot_plot_debounced()

                            // boxplot_plot_debounced()







                        }
                    })

                })
            }).fail(function (e2) {
                Swal.fire('Oops...', e2.responseText, 'error')
            })


            gather_page_information_to_boxplot_plot = function () {



                $.ajax({
                    url: "js/plot_layout_adjuster3.js", converters: { 'text script': function (text) { return text; } }, success: function (plot_layout_adjuster3) {
                        console.log("!!")
                        adjusted_boxplot_plot_layout_adjuster3 = plot_layout_adjuster3.replace(/PLOT_NAME/g, 'boxplot_plot')
                        //console.log(adjusted_boxplot_plot_layout_adjuster3)
                        eval(adjusted_boxplot_plot_layout_adjuster3)
                        console.log($("#boxplot_plot_plot_bgcolor").spectrum("get").toRgbString())
                        save_boxplot_plot_style = function () {

                            // save traces on HTML to the layout.

                            $(".color_by").each(function (i) {
                                boxplot_plot_layout.traces.box_colors[$(".color_by").length][i] = $("[id='" + this.id + "']").spectrum("get").toRgbString()
                            })

                            boxplot_plot_layout.traces.box_colors[1] = $("#boxplot_color").spectrum("get").toRgbString()

                            boxplot_plot_layout.traces.fillcolor_transparency = $("#fillcolor_transparency").val()
                            boxplot_plot_layout.traces.boxpoints = $("#boxpoints").val()
                            boxplot_plot_layout.traces.jitter = $("#jitter").val()
                            boxplot_plot_layout.traces.pointpos = $("#pointpos").val()
                            boxplot_plot_layout.traces.symbol = $("#symbol").val()
                            boxplot_plot_layout.traces.size = $("#size").val()
                            boxplot_plot_layout.traces.outliercolor = $("#outliercolor").spectrum("get").toRgbString()
                            boxplot_plot_layout.traces.line_width = $("#line_width").val()




                            boxplot_plot_layout.traces.whiskerwidth = $("#whiskerwidth").val()
                            boxplot_plot_layout.traces.notched = $("#notched").prop("checked")
                            boxplot_plot_layout.traces.notchwidth = $("#notchwidth").val()
                            boxplot_plot_layout.traces.boxmean = $("#boxmean").val()

                            $.ajax({
                                url: "js/plot_layout_adjuster4.js", converters: { 'text script': function (text) { return text; } }, success: function (plot_layout_adjuster4) {
                                    adjusted_boxplot_plot_layout_adjuster4 = plot_layout_adjuster4.replace(/PLOT_NAME/g, 'boxplot_plot')
                                    console.log(adjusted_boxplot_plot_layout_adjuster4)
                                    eval(adjusted_boxplot_plot_layout_adjuster4)
                                }
                            })


                        }



                        var group_sample_by = $("#boxplot_plot_group_sample_by").val()
                        var f_label = unpack(obj_boxplot_plot.f, "label")
                        var plotting_compound_index = f_label.indexOf($("#compound").val())
                        var y = obj_boxplot_plot.e[plotting_compound_index]
                        if (group_sample_by.length !== 0) {



                            var main_group = $("#boxplot_plot_group_sample_main").val()
                            var main_group_values = unpack(obj_boxplot_plot.p, main_group)
                            if (group_sample_by.length === 2) {
                                var sub_group = group_sample_by.slice(0);
                                sub_group.splice(sub_group.indexOf(main_group), 1)[0]
                                var x = unpack(obj_boxplot_plot.p, sub_group[0])
                                var categoryarray = $("#group_sample_by_" + sub_group).val().split("||")
                                var xs = array_split_by_one_factor(x, main_group_values, $("#group_sample_by_" + main_group).val().split("||"))
                            } else {
                                var xs = undefined
                                var categoryarray = $("#group_sample_by_" + main_group).val().split("||")
                            }

                            var ys = array_split_by_one_factor(y, main_group_values, $("#group_sample_by_" + main_group).val().split("||"))
                            var p_label = unpack(obj_boxplot_plot.p, "label")
                            var texts = array_split_by_one_factor(p_label, main_group_values, $("#group_sample_by_" + main_group).val().split("||"))

                            var trace_names = $("#group_sample_by_" + main_group).val().split("||")


                            var box_colors = {}

                            $(".color_by").each(function () {
                                box_colors[this.id.replace("color_by_", "")] = $("[id='" + this.id + "']").spectrum("get").toRgbString()
                            })


                        } else {
                            var box_colors = {}
                            var xs = undefined
                            var categoryarray = ["value"]
                            var ys = [y]
                            var p_label = unpack(obj_boxplot_plot.p, "label")
                            var texts = unpack(obj_boxplot_plot.p, "label")
                            var trace_names = ["value"]
                            box_colors["value"] = $("#boxplot_color").spectrum("get").toRgbString()
                        }



                        var layout = boxplot_plot_layout
                        var plot_id = "boxplot_plot"
                        var title = f_label[plotting_compound_index]



                        var fillcolor_transparency = $("#fillcolor_transparency").val()
                        var boxpoints = $("#boxpoints").val()
                        if (boxpoints === 'false') {
                            boxpoints = false
                        }
                        var jitter = $("#jitter").val()
                        var pointpos = $("#pointpos").val()


                        var whiskerwidth = $("#whiskerwidth").val()


                        var notched = $("#notched").prop("checked")
                        var notchwidth = $("#notchwidth").val()



                        var symbol = $("#symbol").val()
                        var boxmean = $("#boxmean").val()
                        if (boxmean === "none") {
                            boxmean = false
                        } else if (boxmean === "mean") {
                            boxmean = true
                        }



                        var size = $("#size").val()
                        var outliercolor = $("#outliercolor").spectrum("get").toRgbString()
                        var line_width = $("#line_width").val()







                        boxplot_parameter = {
                            xs: xs, ys: ys, texts: texts, boxpoints: boxpoints, jitter: jitter, pointpos: pointpos, trace_names: trace_names, box_colors: box_colors,
                            symbol: symbol, whiskerwidth: whiskerwidth, notched: notched, notchwidth: notchwidth, boxmean: boxmean,
                            size: size, outliercolor: outliercolor, line_width: line_width, fillcolor_transparency: fillcolor_transparency, title: title, categoryarray: categoryarray,
                            layout: layout, plot_id: plot_id, quick_analysis: false
                        }

                        /*keys = Object.keys(boxplot_parameter)
                        values = Object.values(boxplot_parameter)
                        for(var i=0; i<keys.length;i++){
                            window[keys[i]] = values[i]
                        }*/


                        if ($("#boxplot_plot_explanation_html").length == 0) {
                            $("#boxplot_plot_explanation").append("<div id='boxplot_plot_explanation_html'></div>")
                        }
                        $("#boxplot_plot_explanation_html").html(obj_boxplot_plot.results_description[0])



                        boxplot_data_layout_generate = boxplot_plot_fun(boxplot_parameter)






                    }
                })
            }
            boxplot_plot_debounced = _.debounce(gather_page_information_to_boxplot_plot, 250, { 'maxWait': 1000 }); // this must be a global object.



        }
    })
}, 'html');








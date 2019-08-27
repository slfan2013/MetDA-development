



$.get("plot_layout_adjuster.html", function (plot_layout_adjuster_string) {
    $("#plsda_loading_plot_to_be_loaded").append($.parseHTML(plot_layout_adjuster_string.replaceAll("PLOT_NAME", "plsda_loading_plot")));

    $.ajax({url:"js/plot_layout_adjuster1.js",converters: { 'text script': function (text) { return text; } },success:function (plot_layout_adjuster1) {
        adjusted_plsda_loading_plot_layout_adjuster1 = plot_layout_adjuster1.replaceAll("PLOT_NAME", "plsda_loading_plot")
        eval(adjusted_plsda_loading_plot_layout_adjuster1)

        // assign the default value for pca plsda_loading plot
        ocpu.call("call_fun", {parameter:{
            user_id: localStorage.user_id,
            fun_name:"get_plsda_loading_plot_style"
        }}, function (session) {
            session.getObject(function (plsda_loading_plot_obj) {
                
                plsda_loading_plot_obj = prepare_layout(plsda_loading_plot_obj)
                plsda_loading_plot_obj_global = plsda_loading_plot_obj
                plsda_loading_plot_traces = plsda_loading_plot_obj.traces

                $.ajax({url:"js/plot_layout_adjuster2.js",converters: { 'text script': function (text) { return text; } },success:function (plot_layout_adjuster2) {
                    adjusted_plsda_loading_plot_layout_adjuster2 = plot_layout_adjuster2.replaceAll("PLOT_NAME", "plsda_loading_plot")




                    eval(adjusted_plsda_loading_plot_layout_adjuster2)
                    $("#plsda_loading_plot_layout_yaxis_title_text").val("PC" + $("#plsda_loading_plot_pcy").val() + " (" + (obj_plsda_loading_plot.variance[$("#plsda_loading_plot_pcy").val() - 1] * 100).toFixed(2) + "%)")
                    $("#plsda_loading_plot_layout_yaxis_title_text").val("PC" + $("#plsda_loading_plot_pcy").val() + " (" + (obj_plsda_loading_plot.variance[$("#plsda_loading_plot_pcy").val() - 1] * 100).toFixed(2) + "%)")

                    $("#plsda_loading_plot_color_option").spectrum({
                        color: plsda_loading_plot_traces.scatter_colors[1],
                        showPalette: true,
                        palette: color_pallete
                    });
                    $("#plsda_loading_plot_color_option").change(plsda_loading_plot_debounced)

                    $("#plsda_loading_plot_shape_option .selectpicker").val(plsda_loading_plot_traces.scatter_shapes[1])
                    $("#plsda_loading_plot_shape_option .selectpicker").selectpicker('refresh')
                    $("#plsda_loading_plot_shape_option .selectpicker").change(plsda_loading_plot_debounced)

                    $("#plsda_loading_plot_size_option").val(plsda_loading_plot_traces.scatter_sizes[1])
                    $("#plsda_loading_plot_size_option").change(plsda_loading_plot_debounced)

                    if (f_column_unique_length.some(function (x) { return (x > 1 && x < 3) })) {
                        for (var i = 0; i < f_column_unique_length.length; i++) {
                            if (f_column_unique_length[i] > 1 && f_column_unique_length[i] < 3) {
                                $("#plsda_loading_plot_color_levels").val(f_column_names[i])
                                $("#plsda_loading_plot_color_levels").selectpicker('refresh')
                                //$("#plsda_loading_plot_traces_color_by_info").prop("checked", true).change();
                                for (var j = 0; j < f_column_unique_length[i]; j++) {
                                    $("#plsda_loading_plot_color_options" + j).spectrum("set", plsda_loading_plot_traces.scatter_colors[f_column_unique_length[i]][j]);
                                }
                                plsda_loading_plot_debounced()
                                break;
                            }
                        }
                    }else{
                        plsda_loading_plot_debounced()
                    }
                }})

            })
        }).fail(function (e2) {
            Swal.fire('Oops...', e2.responseText, 'error')
        })


        gather_page_information_to_plsda_loading_plot = function () {

            var x = unpack(obj_plsda_loading_plot.compound_loadings, "p" + $("#plsda_loading_plot_pcx").val())
            var y = unpack(obj_plsda_loading_plot.compound_loadings, "p" + $("#plsda_loading_plot_pcy").val())


            if (!$("#plsda_loading_plot_traces_color_by_info").is(":checked")) {
                plsda_loading_plot_color_values = [$("#plsda_loading_plot_color_option").spectrum("get").toRgbString()]
                plsda_loading_plot_color_by = undefined
            } else {
                plsda_loading_plot_color_values = plsda_loading_plot_color_levels.map(function (x, i) {
                    return ($("#plsda_loading_plot_color_options" + i).spectrum("get").toRgbString())
                })
            }

            if (!$("#plsda_loading_plot_traces_shape_by_info").is(":checked")) {
                plsda_loading_plot_shape_values = [$("#plsda_loading_plot_shape_option .selectpicker").val()]
                plsda_loading_plot_shape_by = undefined
            } else {
                plsda_loading_plot_shape_values = plsda_loading_plot_shape_levels.map(function (x, i) {
                    return ($("#plsda_loading_plot_shape_options" + i + " .selectpicker").val())
                })
            }


            if (!$("#plsda_loading_plot_traces_size_by_info").is(":checked")) {
                plsda_loading_plot_size_values = [$("#plsda_loading_plot_size_option").val()]
                plsda_loading_plot_size_by = undefined
            } else {
                plsda_loading_plot_size_values = plsda_loading_plot_size_levels.map(function (x, i) {
                    return ($("#plsda_loading_plot_size_options" + i).val())
                })
            }
            if ($("#plsda_loading_plot_confidence_ellipse").is(":checked")) {
                plsda_loading_plot_ellipse_group = ['color']
            } else {
                plsda_loading_plot_ellipse_group = 'no_ellipse'
            }

            plsda_loading_plot_labels = unpack(obj_plsda_loading_plot.f, "label")
            $("#plsda_loading_plot_layout_xaxis_title_text").val("PC" + $("#plsda_loading_plot_pcx").val() + " (" + (obj_plsda_loading_plot.variance[$("#plsda_loading_plot_pcx").val() - 1] * 100).toFixed(2) + "%)")
            $("#plsda_loading_plot_layout_yaxis_title_text").val("PC" + $("#plsda_loading_plot_pcy").val() + " (" + (obj_plsda_loading_plot.variance[$("#plsda_loading_plot_pcy").val() - 1] * 100).toFixed(2) + "%)")




            $.ajax({url:"js/plot_layout_adjuster3.js",converters: { 'text script': function (text) { return text; } },success:function (plot_layout_adjuster3) {
                adjusted_plsda_loading_plot_layout_adjuster3 = plot_layout_adjuster3.replaceAll("PLOT_NAME", "plsda_loading_plot")
               
                eval(adjusted_plsda_loading_plot_layout_adjuster3)
                save_plsda_loading_plot_style = function () {


                    if ($("#plsda_loading_plot_traces_color_by_info").is(':checked')) {
                        for (var i = 0; i < plsda_loading_plot_color_levels.length; i++) {
                            plsda_loading_plot_layout.traces.scatter_colors[plsda_loading_plot_color_levels.length][i] = $("#plsda_loading_plot_color_options" + i).spectrum("get").toRgbString()
                        }
                    } else {
                        plsda_loading_plot_layout.traces.scatter_colors[1] = $("#plsda_loading_plot_color_option").spectrum("get").toRgbString()
                    }

                    if ($("#plsda_loading_plot_traces_shape_by_info").is(':checked')) {
                        for (var i = 0; i < plsda_loading_plot_shape_levels.length; i++) {
                            plsda_loading_plot_layout.traces.scatter_shapes[plsda_loading_plot_shape_levels.length][i] = $("#plsda_loading_plot_shape_options" + i + " .selectpicker").val()
                        }
                    } else {
                        plsda_loading_plot_layout.traces.scatter_shapes[1] = $("#plsda_loading_plot_shape_option .selectpicker").val()
                    }


                    if ($("#plsda_loading_plot_traces_size_by_info").is(':checked')) {
                        for (var i = 0; i < plsda_loading_plot_size_levels.length; i++) {
                            plsda_loading_plot_layout.traces.scatter_sizes[plsda_loading_plot_size_levels.length][i] = $("#plsda_loading_plot_size_options" + i).val()
                        }
                    } else {
                        plsda_loading_plot_layout.traces.scatter_sizes[1] = $("#plsda_loading_plot_size_option").val()
                    }

                    $.ajax({url:"js/plot_layout_adjuster4.js",converters: { 'text script': function (text) { return text; } },success:function (plot_layout_adjuster4) {
                        adjusted_plsda_loading_plot_layout_adjuster4 = plot_layout_adjuster4.replaceAll("PLOT_NAME", "plsda_loading_plot")
                        eval(adjusted_plsda_loading_plot_layout_adjuster4)
                    }})



                }

                if($("#plsda_loading_plot_explanation_html").length==0){
                    $("#plsda_loading_plot_explanation").append("<div id='plsda_loading_plot_explanation_html'></div>")
                }
                $("#plsda_loading_plot_explanation_html").html(obj_plsda_loading_plot.results_description[2])



                plsda_loading_plot_fun({
                    x: x, y: y, color_by: plsda_loading_plot_color_by, color_values: plsda_loading_plot_color_values, color_levels: plsda_loading_plot_color_levels,
                    shape_by: plsda_loading_plot_shape_by, shape_values: plsda_loading_plot_shape_values, shape_levels: plsda_loading_plot_shape_levels,
                    size_by: plsda_loading_plot_size_by, size_values: plsda_loading_plot_size_values, size_levels: plsda_loading_plot_size_levels,
                    ellipse_group: plsda_loading_plot_ellipse_group,
                    labels: plsda_loading_plot_labels,
                    layout: plsda_loading_plot_layout,
                    plot_id: plsda_loading_plot_plot_id
                })

            }})



            /*
                    o = {
                        x: x, y: y, color_by: plsda_loading_plot_color_by, color_values: plsda_loading_plot_color_values, color_levels: plsda_loading_plot_color_levels,
                        shape_by: plsda_loading_plot_shape_by, shape_values: plsda_loading_plot_shape_values, shape_levels: plsda_loading_plot_shape_levels,
                        size_by: plsda_loading_plot_size_by, size_values: plsda_loading_plot_size_values, size_levels: plsda_loading_plot_size_levels,
                        ellipse_group: plsda_loading_plot_ellipse_group,
                        labels: plsda_loading_plot_labels,
                        layout: plsda_loading_plot_layout,
                        plot_id: plsda_loading_plot_plot_id
                    }
            
                    for(var i=0; i<Object.keys(o).length; i++){
                        window[Object.keys(o)[i]] = Object.values(o)[i]
                    }
              */


        }

        plsda_loading_plot_debounced = _.debounce(gather_page_information_to_plsda_loading_plot, 250, { 'maxWait': 1000 }); // this must be a global object.


        var f_column_names = Object.keys(obj_plsda_loading_plot.f[0])
        var f_column_unique = f_column_names.map(x => unpack(obj_plsda_loading_plot.f, x))
        var f_column_unique_length = f_column_unique.map(x => x.filter(unique).length)

        var plsda_loading_plot_color_levels_div = '<div class="form-group" style="margin:0;border:0;padding:0"><select class="form-control selectpicker" id="plsda_loading_plot_color_levels" data-style="btn btn-link">'
        for (var i = 0; i < f_column_names.length; i++) {
            if (f_column_names[i] !== 'label') {
                plsda_loading_plot_color_levels_div = plsda_loading_plot_color_levels_div + '<option>' + f_column_names[i] + '</option>'
            }
        }
        plsda_loading_plot_color_levels_div = plsda_loading_plot_color_levels_div + '</select></div>'
        $("#plsda_loading_plot_color_levels_div").html(plsda_loading_plot_color_levels_div)
        plsda_loading_plot_color_levels_change = function () {
            plsda_loading_plot_color_by = unpack(obj_plsda_loading_plot.f, $("#plsda_loading_plot_color_levels").val())
            plsda_loading_plot_color_levels = plsda_loading_plot_color_by.filter(unique)
            plsda_loading_plot_color_options_div = ""
            for (var i = 0; i < plsda_loading_plot_color_levels.length; i++) {
                plsda_loading_plot_color_options_div = plsda_loading_plot_color_options_div +
                    '<div class="input-group" id="plsda_loading_plot_color_options' + i + '_div">' +
                    '<div class="input-group-prepend"><span class="input-group-text">' + plsda_loading_plot_color_levels[i] +
                    '</span></div><input type="text" id="plsda_loading_plot_color_options' + i + '" class="spectrums" data-show-alpha="true" /></div>'
            }
            $("#plsda_loading_plot_color_options_div").html(plsda_loading_plot_color_options_div)

            for (var i = 0; i < plsda_loading_plot_color_levels.length; i++) {
                $("#plsda_loading_plot_color_options" + i).spectrum({
                    color: plsda_loading_plot_traces.scatter_colors[plsda_loading_plot_color_levels.length][i],
                    showPalette: true,
                    palette: color_pallete
                });
                $("#plsda_loading_plot_color_options" + i).change(plsda_loading_plot_debounced)
            }

            setTimeout(plsda_loading_plot_debounced, 500)

        }
        $("#plsda_loading_plot_color_levels").change(plsda_loading_plot_color_levels_change)

        plsda_loading_plot_traces_color_by_info_change = function () {
            if ($("#plsda_loading_plot_traces_color_by_info").is(':checked')) {
                $("#plsda_loading_plot_show_when_color_by_info").show()
                $("#plsda_loading_plot_hide_when_color_by_info").hide()
            } else {
                $("#plsda_loading_plot_show_when_color_by_info").hide()
                $("#plsda_loading_plot_hide_when_color_by_info").show()
            }
            plsda_loading_plot_color_levels_change();

        }
        $("#plsda_loading_plot_traces_color_by_info").change(plsda_loading_plot_traces_color_by_info_change)


        plsda_loading_plot_shape_levels_div = '<div class="form-group" style="margin:0;border:0;padding:0"><select class="form-control selectpicker" id="plsda_loading_plot_shape_levels" data-style="btn btn-link">'
        for (var i = 0; i < f_column_names.length; i++) {
            if (f_column_names[i] !== 'label') {
                plsda_loading_plot_shape_levels_div = plsda_loading_plot_shape_levels_div + '<option>' + f_column_names[i] + '</option>'
            }
        }
        plsda_loading_plot_shape_levels_div = plsda_loading_plot_shape_levels_div + '</select></div>'
        $("#plsda_loading_plot_shape_levels_div").html(plsda_loading_plot_shape_levels_div)
        plsda_loading_plot_shape_levels_change = function () {
            plsda_loading_plot_shape_by = unpack(obj_plsda_loading_plot.f, $("#plsda_loading_plot_shape_levels").val())
            plsda_loading_plot_shape_levels = plsda_loading_plot_shape_by.filter(unique)
            plsda_loading_plot_shape_options_div = ""
            for (var i = 0; i < plsda_loading_plot_shape_levels.length; i++) {
                plsda_loading_plot_shape_options_div = plsda_loading_plot_shape_options_div +
                    '<div class="form-group plsda_loading_plot_shapes" style="margin:0;border:0;padding:0" id="plsda_loading_plot_shape_options' + i + '">' +
                    '<label>' + plsda_loading_plot_shape_levels[i] + '</label><select class="form-control selectpicker" data-style="btn btn-link">' +
                    '<option>circle</option>' + '<option>square</option>' +
                    '</select></div>'
            }
            $("#plsda_loading_plot_shape_options_div").html(plsda_loading_plot_shape_options_div)


            for (var i = 0; i < plsda_loading_plot_shape_levels.length; i++) {
                $("#plsda_loading_plot_shape_options" + i + " .selectpicker").val(plsda_loading_plot_traces.scatter_shapes[plsda_loading_plot_shape_levels.length][i])
                $("#plsda_loading_plot_shape_options" + i + " .selectpicker").selectpicker('refresh')
                $("#plsda_loading_plot_shape_options" + i + " .selectpicker").change(plsda_loading_plot_debounced)
            }



            init_selectpicker()
            setTimeout(plsda_loading_plot_debounced, 500)
            $(".plsda_loading_plot_shapes").change(plsda_loading_plot_debounced)



        }
        $("#plsda_loading_plot_shape_levels").change(plsda_loading_plot_shape_levels_change)

        plsda_loading_plot_traces_shape_by_info_change = function () {
            if ($("#plsda_loading_plot_traces_shape_by_info").is(':checked')) {
                $("#plsda_loading_plot_show_when_shape_by_info").show()
                $("#plsda_loading_plot_hide_when_shape_by_info").hide()
            } else {
                $("#plsda_loading_plot_show_when_shape_by_info").hide()
                $("#plsda_loading_plot_hide_when_shape_by_info").show()
            }
            plsda_loading_plot_shape_levels_change()
        }
        $("#plsda_loading_plot_traces_shape_by_info").change(plsda_loading_plot_traces_shape_by_info_change)

        plsda_loading_plot_size_levels_div = '<div class="form-group" style="margin:0;border:0;padding:0"><select class="form-control selectpicker" id="plsda_loading_plot_size_levels" data-style="btn btn-link">'
        for (var i = 0; i < f_column_names.length; i++) {
            if (f_column_names[i] !== 'label') {
                plsda_loading_plot_size_levels_div = plsda_loading_plot_size_levels_div + '<option>' + f_column_names[i] + '</option>'
            }
        }
        plsda_loading_plot_size_levels_div = plsda_loading_plot_size_levels_div + '</select></div>'
        $("#plsda_loading_plot_size_levels_div").html(plsda_loading_plot_size_levels_div)
        plsda_loading_plot_size_levels_change = function () {
            plsda_loading_plot_size_by = unpack(obj_plsda_loading_plot.f, $("#plsda_loading_plot_size_levels").val())
            plsda_loading_plot_size_levels = plsda_loading_plot_size_by.filter(unique)

            plsda_loading_plot_size_options_div = ''
            for (var i = 0; i < plsda_loading_plot_size_levels.length; i++) {
                plsda_loading_plot_size_options_div = plsda_loading_plot_size_options_div +
                    '<div class="input-group"><div class="input-group-prepend"><span class="input-group-text">' +
                    plsda_loading_plot_size_levels[i] + "</span></div>" +
                    '<input id="plsda_loading_plot_size_options' + i + '" type="number" class="form-control plsda_loading_plot_sizes" placeholder="Dot Size" min="0" step="1" value="15"></div>'
            }
            $("#plsda_loading_plot_size_options_div").html(plsda_loading_plot_size_options_div)



            for (var i = 0; i < plsda_loading_plot_size_levels.length; i++) {
                if (plsda_loading_plot_size_levels.length === 1) {
                    $("#plsda_loading_plot_size_options" + i).val(plsda_loading_plot_traces.scatter_sizes[plsda_loading_plot_size_levels.length][i])
                } else {
                    $("#plsda_loading_plot_size_options" + i).val(plsda_loading_plot_traces.scatter_sizes[plsda_loading_plot_size_levels.length][i])
                }

                $("#plsda_loading_plot_size_options" + i).change(plsda_loading_plot_debounced)
            }




            setTimeout(plsda_loading_plot_debounced, 500)
            $(".plsda_loading_plot_sizes").change(plsda_loading_plot_debounced)
        }
        $("#plsda_loading_plot_size_levels").change(plsda_loading_plot_size_levels_change)

        plsda_loading_plot_traces_size_by_info_change = function () {
            if ($("#plsda_loading_plot_traces_size_by_info").is(':checked')) {
                $("#plsda_loading_plot_show_when_size_by_info").show()
                $("#plsda_loading_plot_hide_when_size_by_info").hide()
            } else {
                $("#plsda_loading_plot_show_when_size_by_info").hide()
                $("#plsda_loading_plot_hide_when_size_by_info").show()
            }
            plsda_loading_plot_size_levels_change()
        }
        $("#plsda_loading_plot_traces_size_by_info").change(plsda_loading_plot_traces_size_by_info_change)

        plsda_loading_plot_plot_id = "plsda_loading_plot"







    }})














}, 'html');








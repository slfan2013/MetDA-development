



$.get("plot_layout_adjuster.html", function (plot_layout_adjuster_string) {
    $("#loading_plot_to_be_loaded").append($.parseHTML(plot_layout_adjuster_string.replaceAll("PLOT_NAME", "loading_plot")));

    $.ajax({url:"js/plot_layout_adjuster1.js",converters: { 'text script': function (text) { return text; } },success:function (plot_layout_adjuster1) {
        adjusted_loading_plot_layout_adjuster1 = plot_layout_adjuster1.replaceAll("PLOT_NAME", "loading_plot")
        eval(adjusted_loading_plot_layout_adjuster1)

        // assign the default value for pca loading plot
        ocpu.call("call_fun", {parameter:{
            user_id: localStorage.user_id,
            fun_name:"get_"+window.location.href.split("#")[1]+"_loading_plot_style"
        }}, function (session) {
            session.getObject(function (loading_plot_obj) {
                
                loading_plot_obj = prepare_layout(loading_plot_obj)
                loading_plot_obj_global = loading_plot_obj
                loading_plot_traces = loading_plot_obj.traces

                $.ajax({url:"js/plot_layout_adjuster2.js",converters: { 'text script': function (text) { return text; } },success:function (plot_layout_adjuster2) {
                    adjusted_loading_plot_layout_adjuster2 = plot_layout_adjuster2.replaceAll("PLOT_NAME", "loading_plot")




                    eval(adjusted_loading_plot_layout_adjuster2)
                    $("#loading_plot_layout_yaxis_title_text").val("PC" + $("#loading_plot_pcy").val() + " (" + (obj_loading_plot.variance[$("#loading_plot_pcy").val() - 1] * 100).toFixed(2) + "%)")
                    $("#loading_plot_layout_yaxis_title_text").val("PC" + $("#loading_plot_pcy").val() + " (" + (obj_loading_plot.variance[$("#loading_plot_pcy").val() - 1] * 100).toFixed(2) + "%)")

                    $("#loading_plot_color_option").spectrum({
                        color: loading_plot_traces.scatter_colors[1][0],
                        showPalette: true,
                        palette: color_pallete
                    });
                    $("#loading_plot_color_option").change(loading_plot_debounced)

                    $("#loading_plot_shape_option .selectpicker").val(loading_plot_traces.scatter_shapes[1][0])
                    $("#loading_plot_shape_option .selectpicker").selectpicker('refresh')
                    $("#loading_plot_shape_option .selectpicker").change(loading_plot_debounced)

                    $("#loading_plot_size_option").val(loading_plot_traces.scatter_sizes[1][0])
                    $("#loading_plot_size_option").change(loading_plot_debounced)

                    if (f_column_unique_length.some(function (x) { return (x > 1 && x < 3) })) {
                        for (var i = 0; i < f_column_unique_length.length; i++) {
                            if (f_column_unique_length[i] > 1 && f_column_unique_length[i] < 3) {
                                $("#loading_plot_color_levels").val(f_column_names[i])
                                $("#loading_plot_color_levels").selectpicker('refresh')
                                //$("#loading_plot_traces_color_by_info").prop("checked", true).change();
                                for (var j = 0; j < f_column_unique_length[i]; j++) {
                                    $("#loading_plot_color_options" + j).spectrum("set", loading_plot_traces.scatter_colors[f_column_unique_length[i]][j][0]);
                                }
                                loading_plot_debounced()
                                break;
                            }
                        }
                    }
                }})

            })
        }).fail(function (e2) {
            Swal.fire('Oops...', e2.responseText, 'error')
        })


        gather_page_information_to_loading_plot = function () {

            var x = unpack(obj_loading_plot.compound_loadings, "p" + $("#loading_plot_pcx").val())
            var y = unpack(obj_loading_plot.compound_loadings, "p" + $("#loading_plot_pcy").val())


            if (!$("#loading_plot_traces_color_by_info").is(":checked")) {
                loading_plot_color_values = [$("#loading_plot_color_option").spectrum("get").toRgbString()]
                loading_plot_color_by = undefined
            } else {
                loading_plot_color_values = loading_plot_color_levels.map(function (x, i) {
                    return ($("#loading_plot_color_options" + i).spectrum("get").toRgbString())
                })
            }

            if (!$("#loading_plot_traces_shape_by_info").is(":checked")) {
                loading_plot_shape_values = [$("#loading_plot_shape_option .selectpicker").val()]
                loading_plot_shape_by = undefined
            } else {
                loading_plot_shape_values = loading_plot_shape_levels.map(function (x, i) {
                    return ($("#loading_plot_shape_options" + i + " .selectpicker").val())
                })
            }


            if (!$("#loading_plot_traces_size_by_info").is(":checked")) {
                loading_plot_size_values = [$("#loading_plot_size_option").val()]
                loading_plot_size_by = undefined
            } else {
                loading_plot_size_values = loading_plot_size_levels.map(function (x, i) {
                    return ($("#loading_plot_size_options" + i).val())
                })
            }
            if ($("#loading_plot_confidence_ellipse").is(":checked")) {
                loading_plot_ellipse_group = ['color']
            } else {
                loading_plot_ellipse_group = 'no_ellipse'
            }

            loading_plot_labels = unpack(obj_loading_plot.f, "label")
            $("#loading_plot_layout_xaxis_title_text").val("PC" + $("#loading_plot_pcx").val() + " (" + (obj_loading_plot.variance[$("#loading_plot_pcx").val() - 1] * 100).toFixed(2) + "%)")
            $("#loading_plot_layout_yaxis_title_text").val("PC" + $("#loading_plot_pcy").val() + " (" + (obj_loading_plot.variance[$("#loading_plot_pcy").val() - 1] * 100).toFixed(2) + "%)")




            $.ajax({url:"js/plot_layout_adjuster3.js",converters: { 'text script': function (text) { return text; } },success:function (plot_layout_adjuster3) {
                adjusted_loading_plot_layout_adjuster3 = plot_layout_adjuster3.replaceAll("PLOT_NAME", "loading_plot")
               
                eval(adjusted_loading_plot_layout_adjuster3)
                save_loading_plot_style = function () {


                    if ($("#loading_plot_traces_color_by_info").is(':checked')) {
                        for (var i = 0; i < loading_plot_color_levels.length; i++) {
                            loading_plot_layout.traces.scatter_colors[loading_plot_color_levels.length][i] = $("#loading_plot_color_options" + i).spectrum("get").toRgbString()
                        }
                    } else {
                        loading_plot_layout.traces.scatter_colors[1] = $("#loading_plot_color_option").spectrum("get").toRgbString()
                    }

                    if ($("#loading_plot_traces_shape_by_info").is(':checked')) {
                        for (var i = 0; i < loading_plot_shape_levels.length; i++) {
                            loading_plot_layout.traces.scatter_shapes[loading_plot_shape_levels.length][i] = $("#loading_plot_shape_options" + i + " .selectpicker").val()
                        }
                    } else {
                        loading_plot_layout.traces.scatter_shapes[1] = $("#loading_plot_shape_option .selectpicker").val()
                    }


                    if ($("#loading_plot_traces_size_by_info").is(':checked')) {
                        for (var i = 0; i < loading_plot_size_levels.length; i++) {
                            loading_plot_layout.traces.scatter_sizes[loading_plot_size_levels.length][i] = $("#loading_plot_size_options" + i).val()
                        }
                    } else {
                        loading_plot_layout.traces.scatter_sizes[1] = $("#loading_plot_size_option").val()
                    }

                    $.ajax({url:"js/plot_layout_adjuster4.js",converters: { 'text script': function (text) { return text; } },success:function (plot_layout_adjuster4) {
                        adjusted_loading_plot_layout_adjuster4 = plot_layout_adjuster4.replaceAll("PLOT_NAME", "loading_plot")
                        eval(adjusted_loading_plot_layout_adjuster4)
                    }})



                }

                if($("#loading_plot_explanation_html").length==0){
                    $("#loading_plot_explanation").append("<div id='loading_plot_explanation_html'></div>")
                }
                $("#loading_plot_explanation_html").html(obj_loading_plot.results_description[2])



                loading_plot_fun({
                    x: x, y: y, color_by: loading_plot_color_by, color_values: loading_plot_color_values, color_levels: loading_plot_color_levels,
                    shape_by: loading_plot_shape_by, shape_values: loading_plot_shape_values, shape_levels: loading_plot_shape_levels,
                    size_by: loading_plot_size_by, size_values: loading_plot_size_values, size_levels: loading_plot_size_levels,
                    ellipse_group: loading_plot_ellipse_group,
                    labels: loading_plot_labels,
                    layout: loading_plot_layout,
                    plot_id: loading_plot_plot_id
                })

            }})



            /*
                    o = {
                        x: x, y: y, color_by: loading_plot_color_by, color_values: loading_plot_color_values, color_levels: loading_plot_color_levels,
                        shape_by: loading_plot_shape_by, shape_values: loading_plot_shape_values, shape_levels: loading_plot_shape_levels,
                        size_by: loading_plot_size_by, size_values: loading_plot_size_values, size_levels: loading_plot_size_levels,
                        ellipse_group: loading_plot_ellipse_group,
                        labels: loading_plot_labels,
                        layout: loading_plot_layout,
                        plot_id: loading_plot_plot_id
                    }
            
                    for(var i=0; i<Object.keys(o).length; i++){
                        window[Object.keys(o)[i]] = Object.values(o)[i]
                    }
              */


        }

        loading_plot_debounced = _.debounce(gather_page_information_to_loading_plot, 250, { 'maxWait': 1000 }); // this must be a global object.


        var f_column_names = Object.keys(obj_loading_plot.f[0])
        var f_column_unique = f_column_names.map(x => unpack(obj_loading_plot.f, x))
        var f_column_unique_length = f_column_unique.map(x => x.filter(unique).length)

        var loading_plot_color_levels_div = '<div class="form-group" style="margin:0;border:0;padding:0"><select class="form-control selectpicker" id="loading_plot_color_levels" data-style="btn btn-link">'
        for (var i = 0; i < f_column_names.length; i++) {
            if (f_column_names[i] !== 'label') {
                loading_plot_color_levels_div = loading_plot_color_levels_div + '<option>' + f_column_names[i] + '</option>'
            }
        }
        loading_plot_color_levels_div = loading_plot_color_levels_div + '</select></div>'
        $("#loading_plot_color_levels_div").html(loading_plot_color_levels_div)
        loading_plot_color_levels_change = function () {
            loading_plot_color_by = unpack(obj_loading_plot.f, $("#loading_plot_color_levels").val())
            loading_plot_color_levels = loading_plot_color_by.filter(unique)
            loading_plot_color_options_div = ""
            for (var i = 0; i < loading_plot_color_levels.length; i++) {
                loading_plot_color_options_div = loading_plot_color_options_div +
                    '<div class="input-group" id="loading_plot_color_options' + i + '_div">' +
                    '<div class="input-group-prepend"><span class="input-group-text">' + loading_plot_color_levels[i] +
                    '</span></div><input type="text" id="loading_plot_color_options' + i + '" class="spectrums" data-show-alpha="true" /></div>'
            }
            $("#loading_plot_color_options_div").html(loading_plot_color_options_div)

            for (var i = 0; i < loading_plot_color_levels.length; i++) {
                $("#loading_plot_color_options" + i).spectrum({
                    color: loading_plot_traces.scatter_colors[loading_plot_color_levels.length][i][0],
                    showPalette: true,
                    palette: color_pallete
                });
                $("#loading_plot_color_options" + i).change(loading_plot_debounced)
            }

            setTimeout(loading_plot_debounced, 500)

        }
        $("#loading_plot_color_levels").change(loading_plot_color_levels_change)

        loading_plot_traces_color_by_info_change = function () {
            if ($("#loading_plot_traces_color_by_info").is(':checked')) {
                $("#loading_plot_show_when_color_by_info").show()
                $("#loading_plot_hide_when_color_by_info").hide()
            } else {
                $("#loading_plot_show_when_color_by_info").hide()
                $("#loading_plot_hide_when_color_by_info").show()
            }
            loading_plot_color_levels_change();

        }
        $("#loading_plot_traces_color_by_info").change(loading_plot_traces_color_by_info_change)


        loading_plot_shape_levels_div = '<div class="form-group" style="margin:0;border:0;padding:0"><select class="form-control selectpicker" id="loading_plot_shape_levels" data-style="btn btn-link">'
        for (var i = 0; i < f_column_names.length; i++) {
            if (f_column_names[i] !== 'label') {
                loading_plot_shape_levels_div = loading_plot_shape_levels_div + '<option>' + f_column_names[i] + '</option>'
            }
        }
        loading_plot_shape_levels_div = loading_plot_shape_levels_div + '</select></div>'
        $("#loading_plot_shape_levels_div").html(loading_plot_shape_levels_div)
        loading_plot_shape_levels_change = function () {
            loading_plot_shape_by = unpack(obj_loading_plot.f, $("#loading_plot_shape_levels").val())
            loading_plot_shape_levels = loading_plot_shape_by.filter(unique)
            loading_plot_shape_options_div = ""
            for (var i = 0; i < loading_plot_shape_levels.length; i++) {
                loading_plot_shape_options_div = loading_plot_shape_options_div +
                    '<div class="form-group loading_plot_shapes" style="margin:0;border:0;padding:0" id="loading_plot_shape_options' + i + '">' +
                    '<label>' + loading_plot_shape_levels[i] + '</label><select class="form-control selectpicker" data-style="btn btn-link">' +
                    '<option>circle</option>' + '<option>square</option>' +
                    '</select></div>'
            }
            $("#loading_plot_shape_options_div").html(loading_plot_shape_options_div)


            for (var i = 0; i < loading_plot_shape_levels.length; i++) {
                $("#loading_plot_shape_options" + i + " .selectpicker").val(loading_plot_traces.scatter_shapes[loading_plot_shape_levels.length][i][0])
                $("#loading_plot_shape_options" + i + " .selectpicker").selectpicker('refresh')
                $("#loading_plot_shape_options" + i + " .selectpicker").change(loading_plot_debounced)
            }



            init_selectpicker()
            setTimeout(loading_plot_debounced, 500)
            $(".loading_plot_shapes").change(loading_plot_debounced)



        }
        $("#loading_plot_shape_levels").change(loading_plot_shape_levels_change)

        loading_plot_traces_shape_by_info_change = function () {
            if ($("#loading_plot_traces_shape_by_info").is(':checked')) {
                $("#loading_plot_show_when_shape_by_info").show()
                $("#loading_plot_hide_when_shape_by_info").hide()
            } else {
                $("#loading_plot_show_when_shape_by_info").hide()
                $("#loading_plot_hide_when_shape_by_info").show()
            }
            loading_plot_shape_levels_change()
        }
        $("#loading_plot_traces_shape_by_info").change(loading_plot_traces_shape_by_info_change)

        loading_plot_size_levels_div = '<div class="form-group" style="margin:0;border:0;padding:0"><select class="form-control selectpicker" id="loading_plot_size_levels" data-style="btn btn-link">'
        for (var i = 0; i < f_column_names.length; i++) {
            if (f_column_names[i] !== 'label') {
                loading_plot_size_levels_div = loading_plot_size_levels_div + '<option>' + f_column_names[i] + '</option>'
            }
        }
        loading_plot_size_levels_div = loading_plot_size_levels_div + '</select></div>'
        $("#loading_plot_size_levels_div").html(loading_plot_size_levels_div)
        loading_plot_size_levels_change = function () {
            loading_plot_size_by = unpack(obj_loading_plot.f, $("#loading_plot_size_levels").val())
            loading_plot_size_levels = loading_plot_size_by.filter(unique)

            loading_plot_size_options_div = ''
            for (var i = 0; i < loading_plot_size_levels.length; i++) {
                loading_plot_size_options_div = loading_plot_size_options_div +
                    '<div class="input-group"><div class="input-group-prepend"><span class="input-group-text">' +
                    loading_plot_size_levels[i] + "</span></div>" +
                    '<input id="loading_plot_size_options' + i + '" type="number" class="form-control loading_plot_sizes" placeholder="Dot Size" min="0" step="1" value="15"></div>'
            }
            $("#loading_plot_size_options_div").html(loading_plot_size_options_div)



            for (var i = 0; i < loading_plot_size_levels.length; i++) {
                if (loading_plot_size_levels.length === 1) {
                    $("#loading_plot_size_options" + i).val(loading_plot_traces.scatter_sizes[loading_plot_size_levels.length][i])
                } else {
                    $("#loading_plot_size_options" + i).val(loading_plot_traces.scatter_sizes[loading_plot_size_levels.length][i][0])
                }

                $("#loading_plot_size_options" + i).change(loading_plot_debounced)
            }




            setTimeout(loading_plot_debounced, 500)
            $(".loading_plot_sizes").change(loading_plot_debounced)
        }
        $("#loading_plot_size_levels").change(loading_plot_size_levels_change)

        loading_plot_traces_size_by_info_change = function () {
            if ($("#loading_plot_traces_size_by_info").is(':checked')) {
                $("#loading_plot_show_when_size_by_info").show()
                $("#loading_plot_hide_when_size_by_info").hide()
            } else {
                $("#loading_plot_show_when_size_by_info").hide()
                $("#loading_plot_hide_when_size_by_info").show()
            }
            loading_plot_size_levels_change()
        }
        $("#loading_plot_traces_size_by_info").change(loading_plot_traces_size_by_info_change)

        loading_plot_plot_id = "loading_plot"







    }})














}, 'html');








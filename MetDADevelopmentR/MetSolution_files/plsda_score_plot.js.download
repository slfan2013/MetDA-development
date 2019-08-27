



$.get("plot_layout_adjuster.html", function (plot_layout_adjuster_string) {
    $("#plsda_score_plot_to_be_loaded").append($.parseHTML(plot_layout_adjuster_string.replaceAll("PLOT_NAME", "plsda_score_plot")));

    $.ajax({
        url: "js/plot_layout_adjuster1.js", converters: { 'text script': function (text) { return text; } }, success: function (plot_layout_adjuster1) {
            adjusted_plsda_score_plot_layout_adjuster1 = plot_layout_adjuster1.replaceAll("PLOT_NAME", "plsda_score_plot")
            eval(adjusted_plsda_score_plot_layout_adjuster1)

            // assign the default value for pca plsda_score plot
            ocpu.call("call_fun", {
                parameter: {
                    user_id: localStorage.user_id,
                    fun_name: "get_plsda_score_plot_style"
                }
            }, function (session) {
                session.getObject(function (plsda_score_plot_obj) {
                    
                    uuu = JSON.parse(JSON.stringify(plsda_score_plot_obj))


                    plsda_score_plot_obj = prepare_layout(plsda_score_plot_obj)
                    plsda_score_plot_obj_global = plsda_score_plot_obj
                    plsda_score_plot_traces = plsda_score_plot_obj.traces

                    $.ajax({
                        url: "js/plot_layout_adjuster2.js", converters: { 'text script': function (text) { return text; } }, success: function (plot_layout_adjuster2) {
                            adjusted_plsda_score_plot_layout_adjuster2 = plot_layout_adjuster2.replaceAll("PLOT_NAME", "plsda_score_plot")


                            eval(adjusted_plsda_score_plot_layout_adjuster2)
                            $("#plsda_score_plot_layout_yaxis_title_text").val("PC" + $("#plsda_score_plot_pcy").val() + " (" + (obj_plsda_score_plot.variance[$("#plsda_score_plot_pcy").val() - 1] * 100).toFixed(2) + "%)")
                            $("#plsda_score_plot_layout_yaxis_title_text").val("PC" + $("#plsda_score_plot_pcy").val() + " (" + (obj_plsda_score_plot.variance[$("#plsda_score_plot_pcy").val() - 1] * 100).toFixed(2) + "%)")

                            $("#plsda_score_plot_color_option").spectrum({
                                color: plsda_score_plot_traces.scatter_colors[1],
                                showPalette: true,
                                palette: color_pallete
                            });
                            $("#plsda_score_plot_color_option").change(plsda_score_plot_debounced)

                            $("#plsda_score_plot_shape_option .selectpicker").val(plsda_score_plot_traces.scatter_shapes[1])
                            $("#plsda_score_plot_shape_option .selectpicker").selectpicker('refresh')
                            $("#plsda_score_plot_shape_option .selectpicker").change(plsda_score_plot_debounced)

                            $("#plsda_score_plot_size_option").val(plsda_score_plot_traces.scatter_sizes[1])
                            $("#plsda_score_plot_size_option").change(plsda_score_plot_debounced)

                            if (window.location.href.split("#")[1] === "plsda") {
                                $("#plsda_score_plot_color_levels").val($("#treatment_group").val())
                                $("#plsda_score_plot_color_levels").selectpicker('refresh')
                                $("#plsda_score_plot_traces_color_by_info").prop("checked", true).change();

                                var i = p_column_names.indexOf($("#treatment_group").val())

                                for (var j = 0; j < p_column_unique_length[i]; j++) {
                                    $("#plsda_score_plot_color_options" + j).spectrum("set", plsda_score_plot_traces.scatter_colors[p_column_unique_length[i]][j]);
                                }
                                plsda_score_plot_debounced()
                            } else {
                                if (p_column_unique_length.some(function (x) { return (x > 1 && x < 6) })) {
                                    for (var i = 0; i < p_column_unique_length.length; i++) {
                                        if (p_column_unique_length[i] > 1 && p_column_unique_length[i] < 6) {
                                            $("#plsda_score_plot_color_levels").val(p_column_names[i])
                                            $("#plsda_score_plot_color_levels").selectpicker('refresh')
                                            $("#plsda_score_plot_traces_color_by_info").prop("checked", true).change();
                                            for (var j = 0; j < p_column_unique_length[i]; j++) {
                                                $("#plsda_score_plot_color_options" + j).spectrum("set", plsda_score_plot_traces.scatter_colors[p_column_unique_length[i]][j]);
                                            }
                                            plsda_score_plot_debounced()
                                            break;
                                        }
                                    }
                                }
                            }











                        }
                    })

                })
            }).fail(function (e2) {
                Swal.fire('Oops...', e2.responseText, 'error')
            })

            gather_page_information_to_plsda_score_plot = function () {

                var x = unpack(obj_plsda_score_plot.sample_scores, "p" + $("#plsda_score_plot_pcx").val())
                var y = unpack(obj_plsda_score_plot.sample_scores, "p" + $("#plsda_score_plot_pcy").val())


                if (!$("#plsda_score_plot_traces_color_by_info").is(":checked")) {
                    plsda_score_plot_color_values = [$("#plsda_score_plot_color_option").spectrum("get").toRgbString()]
                    plsda_score_plot_color_by = undefined
                } else {
                    plsda_score_plot_color_values = plsda_score_plot_color_levels.map(function (x, i) {
                        return ($("#plsda_score_plot_color_options" + i).spectrum("get").toRgbString())
                    })
                }

                if (!$("#plsda_score_plot_traces_shape_by_info").is(":checked")) {
                    plsda_score_plot_shape_values = [$("#plsda_score_plot_shape_option .selectpicker").val()]
                    plsda_score_plot_shape_by = undefined
                } else {
                    plsda_score_plot_shape_values = plsda_score_plot_shape_levels.map(function (x, i) {
                        return ($("#plsda_score_plot_shape_options" + i + " .selectpicker").val())
                    })
                }


                if (!$("#plsda_score_plot_traces_size_by_info").is(":checked")) {
                    plsda_score_plot_size_values = [$("#plsda_score_plot_size_option").val()]
                    plsda_score_plot_size_by = undefined
                } else {
                    plsda_score_plot_size_values = plsda_score_plot_size_levels.map(function (x, i) {
                        return ($("#plsda_score_plot_size_options" + i).val())
                    })
                }
                if ($("#plsda_score_plot_confidence_ellipse").is(":checked")) {
                    plsda_score_plot_ellipse_group = ['color']
                } else {
                    plsda_score_plot_ellipse_group = 'no_ellipse'
                }

                plsda_score_plot_labels = unpack(obj_plsda_score_plot.p, "label")
                $("#plsda_score_plot_layout_xaxis_title_text").val("PC" + $("#plsda_score_plot_pcx").val() + " (" + (obj_plsda_score_plot.variance[$("#plsda_score_plot_pcx").val() - 1] * 100).toFixed(2) + "%)")
                $("#plsda_score_plot_layout_yaxis_title_text").val("PC" + $("#plsda_score_plot_pcy").val() + " (" + (obj_plsda_score_plot.variance[$("#plsda_score_plot_pcy").val() - 1] * 100).toFixed(2) + "%)")




                $.ajax({
                    url: "js/plot_layout_adjuster3.js", converters: { 'text script': function (text) { return text; } }, success: function (plot_layout_adjuster3) {
                        adjusted_plsda_score_plot_layout_adjuster3 = plot_layout_adjuster3.replaceAll("PLOT_NAME", "plsda_score_plot")

                        eval(adjusted_plsda_score_plot_layout_adjuster3)
                        save_plsda_score_plot_style = function () {


                            if ($("#plsda_score_plot_traces_color_by_info").is(':checked')) {
                                for (var i = 0; i < plsda_score_plot_color_levels.length; i++) {
                                    plsda_score_plot_layout.traces.scatter_colors[plsda_score_plot_color_levels.length][i] = $("#plsda_score_plot_color_options" + i).spectrum("get").toRgbString()
                                }
                            } else {
                                plsda_score_plot_layout.traces.scatter_colors[1] = $("#plsda_score_plot_color_option").spectrum("get").toRgbString()
                            }

                            if ($("#plsda_score_plot_traces_shape_by_info").is(':checked')) {
                                for (var i = 0; i < plsda_score_plot_shape_levels.length; i++) {
                                    plsda_score_plot_layout.traces.scatter_shapes[plsda_score_plot_shape_levels.length][i] = $("#plsda_score_plot_shape_options" + i + " .selectpicker").val()
                                }
                            } else {
                                plsda_score_plot_layout.traces.scatter_shapes[1] = $("#plsda_score_plot_shape_option .selectpicker").val()
                            }


                            if ($("#plsda_score_plot_traces_size_by_info").is(':checked')) {
                                for (var i = 0; i < plsda_score_plot_size_levels.length; i++) {
                                    plsda_score_plot_layout.traces.scatter_sizes[plsda_score_plot_size_levels.length][i] = $("#plsda_score_plot_size_options" + i).val()
                                }
                            } else {
                                plsda_score_plot_layout.traces.scatter_sizes[1] = $("#plsda_score_plot_size_option").val()
                            }

                            $.ajax({
                                url: "js/plot_layout_adjuster4.js", converters: { 'text script': function (text) { return text; } }, success: function (plot_layout_adjuster4) {
                                    adjusted_plsda_score_plot_layout_adjuster4 = plot_layout_adjuster4.replaceAll("PLOT_NAME", "plsda_score_plot")
                                    eval(adjusted_plsda_score_plot_layout_adjuster4)
                                }
                            })



                        }

                        if ($("#plsda_score_plot_explanation_html").length == 0) {
                            $("#plsda_score_plot_explanation").append("<div id='plsda_score_plot_explanation_html'></div>")
                        }
                        $("#plsda_score_plot_explanation_html").html(obj_plsda_score_plot.results_description[1])

                        scatter_by_group({
                            x: x, y: y, color_by: plsda_score_plot_color_by, color_values: plsda_score_plot_color_values, color_levels: plsda_score_plot_color_levels,
                            shape_by: plsda_score_plot_shape_by, shape_values: plsda_score_plot_shape_values, shape_levels: plsda_score_plot_shape_levels,
                            size_by: plsda_score_plot_size_by, size_values: plsda_score_plot_size_values, size_levels: plsda_score_plot_size_levels,
                            ellipse_group: plsda_score_plot_ellipse_group,
                            labels: plsda_score_plot_labels,
                            layout: plsda_score_plot_layout,
                            plot_id: plsda_score_plot_plot_id
                        })

                    }
                })





            }

            plsda_score_plot_debounced = _.debounce(gather_page_information_to_plsda_score_plot, 250, { 'maxWait': 1000 }); // this must be a global object.


            p_column_names = Object.keys(obj_plsda_score_plot.p[0])
            p_column_unique = p_column_names.map(x => unpack(obj_plsda_score_plot.p, x))
            p_column_unique_length = p_column_unique.map(x => x.filter(unique).length)

            plsda_score_plot_color_levels_div = '<div class="form-group" style="margin:0;border:0;padding:0"><select class="form-control selectpicker" id="plsda_score_plot_color_levels" data-style="btn btn-link">'
            for (var i = 0; i < p_column_names.length; i++) {
                if (p_column_names[i] !== 'label') {
                    plsda_score_plot_color_levels_div = plsda_score_plot_color_levels_div + '<option>' + p_column_names[i] + '</option>'
                }
            }
            plsda_score_plot_color_levels_div = plsda_score_plot_color_levels_div + '</select></div>'
            $("#plsda_score_plot_color_levels_div").html(plsda_score_plot_color_levels_div)
            plsda_score_plot_color_levels_change = function () {
                plsda_score_plot_color_by = unpack(obj_plsda_score_plot.p, $("#plsda_score_plot_color_levels").val())
                plsda_score_plot_color_levels = plsda_score_plot_color_by.filter(unique)
                plsda_score_plot_color_options_div = ""
                for (var i = 0; i < plsda_score_plot_color_levels.length; i++) {
                    plsda_score_plot_color_options_div = plsda_score_plot_color_options_div +
                        '<div class="input-group" id="plsda_score_plot_color_options' + i + '_div">' +
                        '<div class="input-group-prepend"><span class="input-group-text">' + plsda_score_plot_color_levels[i] +
                        '</span></div><input type="text" id="plsda_score_plot_color_options' + i + '" class="spectrums" data-show-alpha="true" /></div>'
                }
                $("#plsda_score_plot_color_options_div").html(plsda_score_plot_color_options_div)

                for (var i = 0; i < plsda_score_plot_color_levels.length; i++) {
                    $("#plsda_score_plot_color_options" + i).spectrum({
                        color: plsda_score_plot_traces.scatter_colors[plsda_score_plot_color_levels.length][i],
                        showPalette: true,
                        palette: color_pallete
                    });
                    $("#plsda_score_plot_color_options" + i).change(plsda_score_plot_debounced)
                }

                setTimeout(plsda_score_plot_debounced, 500)

            }
            $("#plsda_score_plot_color_levels").change(plsda_score_plot_color_levels_change)

            plsda_score_plot_traces_color_by_info_change = function () {
                if ($("#plsda_score_plot_traces_color_by_info").is(':checked')) {
                    $("#plsda_score_plot_show_when_color_by_info").show()
                    $("#plsda_score_plot_hide_when_color_by_info").hide()
                } else {
                    $("#plsda_score_plot_show_when_color_by_info").hide()
                    $("#plsda_score_plot_hide_when_color_by_info").show()
                }
                plsda_score_plot_color_levels_change();

            }
            $("#plsda_score_plot_traces_color_by_info").change(plsda_score_plot_traces_color_by_info_change)


            plsda_score_plot_shape_levels_div = '<div class="form-group" style="margin:0;border:0;padding:0"><select class="form-control selectpicker" id="plsda_score_plot_shape_levels" data-style="btn btn-link">'
            for (var i = 0; i < p_column_names.length; i++) {
                if (p_column_names[i] !== 'label') {
                    plsda_score_plot_shape_levels_div = plsda_score_plot_shape_levels_div + '<option>' + p_column_names[i] + '</option>'
                }
            }
            plsda_score_plot_shape_levels_div = plsda_score_plot_shape_levels_div + '</select></div>'
            $("#plsda_score_plot_shape_levels_div").html(plsda_score_plot_shape_levels_div)
            plsda_score_plot_shape_levels_change = function () {
                plsda_score_plot_shape_by = unpack(obj_plsda_score_plot.p, $("#plsda_score_plot_shape_levels").val())
                plsda_score_plot_shape_levels = plsda_score_plot_shape_by.filter(unique)
                plsda_score_plot_shape_options_div = ""
                for (var i = 0; i < plsda_score_plot_shape_levels.length; i++) {
                    plsda_score_plot_shape_options_div = plsda_score_plot_shape_options_div +
                        '<div class="form-group plsda_score_plot_shapes" style="margin:0;border:0;padding:0" id="plsda_score_plot_shape_options' + i + '">' +
                        '<label>' + plsda_score_plot_shape_levels[i] + '</label><select class="form-control selectpicker" data-style="btn btn-link">' +
                        '<option>circle</option>' + '<option>square</option>' +
                        '</select></div>'
                }
                $("#plsda_score_plot_shape_options_div").html(plsda_score_plot_shape_options_div)


                for (var i = 0; i < plsda_score_plot_shape_levels.length; i++) {
                    $("#plsda_score_plot_shape_options" + i + " .selectpicker").val(plsda_score_plot_traces.scatter_shapes[plsda_score_plot_shape_levels.length][i])
                    $("#plsda_score_plot_shape_options" + i + " .selectpicker").selectpicker('refresh')
                    $("#plsda_score_plot_shape_options" + i + " .selectpicker").change(plsda_score_plot_debounced)
                }



                init_selectpicker()
                setTimeout(plsda_score_plot_debounced, 500)
                $(".plsda_score_plot_shapes").change(plsda_score_plot_debounced)



            }
            $("#plsda_score_plot_shape_levels").change(plsda_score_plot_shape_levels_change)

            plsda_score_plot_traces_shape_by_info_change = function () {
                if ($("#plsda_score_plot_traces_shape_by_info").is(':checked')) {
                    $("#plsda_score_plot_show_when_shape_by_info").show()
                    $("#plsda_score_plot_hide_when_shape_by_info").hide()
                } else {
                    $("#plsda_score_plot_show_when_shape_by_info").hide()
                    $("#plsda_score_plot_hide_when_shape_by_info").show()
                }
                plsda_score_plot_shape_levels_change()
            }
            $("#plsda_score_plot_traces_shape_by_info").change(plsda_score_plot_traces_shape_by_info_change)

            plsda_score_plot_size_levels_div = '<div class="form-group" style="margin:0;border:0;padding:0"><select class="form-control selectpicker" id="plsda_score_plot_size_levels" data-style="btn btn-link">'
            for (var i = 0; i < p_column_names.length; i++) {
                if (p_column_names[i] !== 'label') {
                    plsda_score_plot_size_levels_div = plsda_score_plot_size_levels_div + '<option>' + p_column_names[i] + '</option>'
                }
            }
            plsda_score_plot_size_levels_div = plsda_score_plot_size_levels_div + '</select></div>'
            $("#plsda_score_plot_size_levels_div").html(plsda_score_plot_size_levels_div)
            plsda_score_plot_size_levels_change = function () {
                plsda_score_plot_size_by = unpack(obj_plsda_score_plot.p, $("#plsda_score_plot_size_levels").val())
                plsda_score_plot_size_levels = plsda_score_plot_size_by.filter(unique)

                plsda_score_plot_size_options_div = ''
                for (var i = 0; i < plsda_score_plot_size_levels.length; i++) {
                    plsda_score_plot_size_options_div = plsda_score_plot_size_options_div +
                        '<div class="input-group"><div class="input-group-prepend"><span class="input-group-text">' +
                        plsda_score_plot_size_levels[i] + "</span></div>" +
                        '<input id="plsda_score_plot_size_options' + i + '" type="number" class="form-control plsda_score_plot_sizes" placeholder="Dot Size" min="0" step="1" value="15"></div>'
                }
                $("#plsda_score_plot_size_options_div").html(plsda_score_plot_size_options_div)



                for (var i = 0; i < plsda_score_plot_size_levels.length; i++) {
                    if (plsda_score_plot_size_levels.length === 1) {
                        $("#plsda_score_plot_size_options" + i).val(plsda_score_plot_traces.scatter_sizes[plsda_score_plot_size_levels.length][i])
                    } else {
                        $("#plsda_score_plot_size_options" + i).val(plsda_score_plot_traces.scatter_sizes[plsda_score_plot_size_levels.length][i])
                    }

                    $("#plsda_score_plot_size_options" + i).change(plsda_score_plot_debounced)
                }




                setTimeout(plsda_score_plot_debounced, 500)
                $(".plsda_score_plot_sizes").change(plsda_score_plot_debounced)
            }
            $("#plsda_score_plot_size_levels").change(plsda_score_plot_size_levels_change)

            plsda_score_plot_traces_size_by_info_change = function () {
                if ($("#plsda_score_plot_traces_size_by_info").is(':checked')) {
                    $("#plsda_score_plot_show_when_size_by_info").show()
                    $("#plsda_score_plot_hide_when_size_by_info").hide()
                } else {
                    $("#plsda_score_plot_show_when_size_by_info").hide()
                    $("#plsda_score_plot_hide_when_size_by_info").show()
                }
                plsda_score_plot_size_levels_change()
            }
            $("#plsda_score_plot_traces_size_by_info").change(plsda_score_plot_traces_size_by_info_change)

            plsda_score_plot_plot_id = "plsda_score_plot"







        }
    })














}, 'html');








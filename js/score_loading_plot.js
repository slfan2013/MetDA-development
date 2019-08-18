



$.get("plot_layout_adjuster.html", function (plot_layout_adjuster_string) {
    $("#score_plot_to_be_loaded").append($.parseHTML(plot_layout_adjuster_string.replaceAll("PLOT_NAME", "score_plot")));

    $.ajax({
        url: "js/plot_layout_adjuster1.js", converters: { 'text script': function (text) { return text; } }, success: function (plot_layout_adjuster1) {
            adjusted_score_plot_layout_adjuster1 = plot_layout_adjuster1.replaceAll("PLOT_NAME", "score_plot")
            eval(adjusted_score_plot_layout_adjuster1)

            // assign the default value for pca score plot
            ocpu.call("call_fun", {
                parameter: {
                    user_id: localStorage.user_id,
                    fun_name: "get_pca_score_plot_style"
                }
            }, function (session) {
                session.getObject(function (score_plot_obj) {
                    score_plot_obj_global = score_plot_obj
                    score_plot_traces = score_plot_obj.traces

                    $.ajax({
                        url: "js/plot_layout_adjuster2.js", converters: { 'text script': function (text) { return text; } }, success: function (plot_layout_adjuster2) {
                            adjusted_score_plot_layout_adjuster2 = plot_layout_adjuster2.replaceAll("PLOT_NAME", "score_plot")




                            eval(adjusted_score_plot_layout_adjuster2)
                            $("#score_plot_layout_yaxis_title_text").val("PC" + $("#score_plot_pcy").val() + " (" + (obj_score_loading_plot.variance[$("#score_plot_pcy").val() - 1] * 100).toFixed(2) + "%)")
                            $("#score_plot_layout_yaxis_title_text").val("PC" + $("#score_plot_pcy").val() + " (" + (obj_score_loading_plot.variance[$("#score_plot_pcy").val() - 1] * 100).toFixed(2) + "%)")

                            $("#score_plot_color_option").spectrum({
                                color: score_plot_traces.scatter_colors[1][0],
                                showPalette: true,
                                palette: color_pallete
                            });
                            $("#score_plot_color_option").change(score_plot_debounced)

                            $("#score_plot_shape_option .selectpicker").val(score_plot_traces.scatter_shapes[1][0])
                            $("#score_plot_shape_option .selectpicker").selectpicker('refresh')
                            $("#score_plot_shape_option .selectpicker").change(score_plot_debounced)

                            $("#score_plot_size_option").val(score_plot_traces.scatter_sizes[1][0])
                            $("#score_plot_size_option").change(score_plot_debounced)

                            if (p_column_unique_length.some(function (x) { return (x > 1 && x < 6) })) {
                                for (var i = 0; i < p_column_unique_length.length; i++) {
                                    if (p_column_unique_length[i] > 1 && p_column_unique_length[i] < 6) {
                                        $("#score_plot_color_levels").val(p_column_names[i])
                                        $("#score_plot_color_levels").selectpicker('refresh')
                                        $("#score_plot_traces_color_by_info").prop("checked", true).change();
                                        for (var j = 0; j < p_column_unique_length[i]; j++) {
                                            $("#score_plot_color_options" + j).spectrum("set", score_plot_traces.scatter_colors[p_column_unique_length[i]][j][0]);
                                        }
                                        score_plot_debounced()
                                        break;
                                    }
                                }
                            }
                        }
                    })

                })
            }).fail(function (e2) {
                Swal.fire('Oops...', e2.responseText, 'error')
            })
            /*scatter_by_group({
                    x: x, y: y, color_by: score_plot_color_by, color_values: score_plot_color_values, color_levels: score_plot_color_levels,
                    shape_by: score_plot_shape_by, shape_values: score_plot_shape_values, shape_levels: score_plot_shape_levels,
                    size_by: score_plot_size_by, size_values: score_plot_size_values, size_levels: score_plot_size_levels,
                    ellipse_group: score_plot_ellipse_group,
                    labels: score_plot_labels,
                    layout: score_plot_layout,
                    plot_id: score_plot_plot_id
                })*/

            gather_page_information_to_score_plot = function () {

                x = unpack(obj_score_loading_plot.sample_scores, "PC" + $("#score_plot_pcx").val())
                y = unpack(obj_score_loading_plot.sample_scores, "PC" + $("#score_plot_pcy").val())


                if (!$("#score_plot_traces_color_by_info").is(":checked")) {
                    score_plot_color_values = [$("#score_plot_color_option").spectrum("get").toRgbString()]
                    score_plot_color_by = undefined
                } else {
                    score_plot_color_values = score_plot_color_levels.map(function (x, i) {
                        return ($("#score_plot_color_options" + i).spectrum("get").toRgbString())
                    })
                }

                if (!$("#score_plot_traces_shape_by_info").is(":checked")) {
                    score_plot_shape_values = [$("#score_plot_shape_option .selectpicker").val()]
                    score_plot_shape_by = undefined
                } else {
                    score_plot_shape_values = score_plot_shape_levels.map(function (x, i) {
                        return ($("#score_plot_shape_options" + i + " .selectpicker").val())
                    })
                }


                if (!$("#score_plot_traces_size_by_info").is(":checked")) {
                    score_plot_size_values = [$("#score_plot_size_option").val()]
                    score_plot_size_by = undefined
                } else {
                    score_plot_size_values = score_plot_size_levels.map(function (x, i) {
                        return ($("#score_plot_size_options" + i).val())
                    })
                }
                if ($("#score_plot_confidence_ellipse").is(":checked")) {
                    score_plot_ellipse_group = ['color']
                } else {
                    score_plot_ellipse_group = 'no_ellipse'
                }

                score_plot_labels = unpack(obj_score_loading_plot.p, "label")
                $("#score_plot_layout_xaxis_title_text").val("PC" + $("#score_plot_pcx").val() + " (" + (obj_score_loading_plot.variance[$("#score_plot_pcx").val() - 1] * 100).toFixed(2) + "%)")
                $("#score_plot_layout_yaxis_title_text").val("PC" + $("#score_plot_pcy").val() + " (" + (obj_score_loading_plot.variance[$("#score_plot_pcy").val() - 1] * 100).toFixed(2) + "%)")




                $.ajax({
                    url: "js/plot_layout_adjuster3.js", converters: { 'text script': function (text) { return text; } }, success: function (plot_layout_adjuster3) {
                        adjusted_score_plot_layout_adjuster3 = plot_layout_adjuster3.replaceAll("PLOT_NAME", "score_plot")

                        eval(adjusted_score_plot_layout_adjuster3)
                        save_score_plot_style = function () {


                            if ($("#score_plot_traces_color_by_info").is(':checked')) {
                                for (var i = 0; i < score_plot_color_levels.length; i++) {
                                    score_plot_layout.traces.scatter_colors[score_plot_color_levels.length][i] = $("#score_plot_color_options" + i).spectrum("get").toRgbString()
                                }
                            } else {
                                score_plot_layout.traces.scatter_colors[1] = $("#score_plot_color_option").spectrum("get").toRgbString()
                            }

                            if ($("#score_plot_traces_shape_by_info").is(':checked')) {
                                for (var i = 0; i < score_plot_shape_levels.length; i++) {
                                    score_plot_layout.traces.scatter_shapes[score_plot_shape_levels.length][i] = $("#score_plot_shape_options" + i + " .selectpicker").val()
                                }
                            } else {
                                score_plot_layout.traces.scatter_shapes[1] = $("#score_plot_shape_option .selectpicker").val()
                            }


                            if ($("#score_plot_traces_size_by_info").is(':checked')) {
                                for (var i = 0; i < score_plot_size_levels.length; i++) {
                                    score_plot_layout.traces.scatter_sizes[score_plot_size_levels.length][i] = $("#score_plot_size_options" + i).val()
                                }
                            } else {
                                score_plot_layout.traces.scatter_sizes[1] = $("#score_plot_size_option").val()
                            }

                            $.ajax({
                                url: "js/plot_layout_adjuster4.js", converters: { 'text script': function (text) { return text; } }, success: function (plot_layout_adjuster4) {
                                    adjusted_score_plot_layout_adjuster4 = plot_layout_adjuster4.replaceAll("PLOT_NAME", "score_plot")
                                    eval(adjusted_score_plot_layout_adjuster4)
                                }
                            })



                        }

                        scatter_by_group({
                            x: x, y: y, color_by: score_plot_color_by, color_values: score_plot_color_values, color_levels: score_plot_color_levels,
                            shape_by: score_plot_shape_by, shape_values: score_plot_shape_values, shape_levels: score_plot_shape_levels,
                            size_by: score_plot_size_by, size_values: score_plot_size_values, size_levels: score_plot_size_levels,
                            ellipse_group: score_plot_ellipse_group,
                            labels: score_plot_labels,
                            layout: score_plot_layout,
                            plot_id: score_plot_plot_id
                        })

                    }
                })



                /*
                        o = {
                            x: x, y: y, color_by: score_plot_color_by, color_values: score_plot_color_values, color_levels: score_plot_color_levels,
                            shape_by: score_plot_shape_by, shape_values: score_plot_shape_values, shape_levels: score_plot_shape_levels,
                            size_by: score_plot_size_by, size_values: score_plot_size_values, size_levels: score_plot_size_levels,
                            ellipse_group: score_plot_ellipse_group,
                            labels: score_plot_labels,
                            layout: score_plot_layout,
                            plot_id: score_plot_plot_id
                        }
                
                        for(var i=0; i<Object.keys(o).length; i++){
                            window[Object.keys(o)[i]] = Object.values(o)[i]
                        }
                  */


            }

            score_plot_debounced = _.debounce(gather_page_information_to_score_plot, 250, { 'maxWait': 1000 }); // this must be a global object.


            p_column_names = Object.keys(obj_score_loading_plot.p[0])
            p_column_unique = p_column_names.map(x => unpack(obj_score_loading_plot.p, x))
            p_column_unique_length = p_column_unique.map(x => x.filter(unique).length)

            score_plot_color_levels_div = '<div class="form-group" style="margin:0;border:0;padding:0"><select class="form-control selectpicker" id="score_plot_color_levels" data-style="btn btn-link">'
            for (var i = 0; i < p_column_names.length; i++) {
                if (p_column_names[i] !== 'label') {
                    score_plot_color_levels_div = score_plot_color_levels_div + '<option>' + p_column_names[i] + '</option>'
                }
            }
            score_plot_color_levels_div = score_plot_color_levels_div + '</select></div>'
            $("#score_plot_color_levels_div").html(score_plot_color_levels_div)
            score_plot_color_levels_change = function () {
                score_plot_color_by = unpack(obj_score_loading_plot.p, $("#score_plot_color_levels").val())
                score_plot_color_levels = score_plot_color_by.filter(unique)
                score_plot_color_options_div = ""
                for (var i = 0; i < score_plot_color_levels.length; i++) {
                    score_plot_color_options_div = score_plot_color_options_div +
                        '<div class="input-group" id="score_plot_color_options' + i + '_div">' +
                        '<div class="input-group-prepend"><span class="input-group-text">' + score_plot_color_levels[i] +
                        '</span></div><input type="text" id="score_plot_color_options' + i + '" class="spectrums" data-show-alpha="true" /></div>'
                }
                $("#score_plot_color_options_div").html(score_plot_color_options_div)

                for (var i = 0; i < score_plot_color_levels.length; i++) {
                    $("#score_plot_color_options" + i).spectrum({
                        color: score_plot_traces.scatter_colors[score_plot_color_levels.length][i][0],
                        showPalette: true,
                        palette: color_pallete
                    });
                    $("#score_plot_color_options" + i).change(score_plot_debounced)
                }

                setTimeout(score_plot_debounced, 500)

            }
            $("#score_plot_color_levels").change(score_plot_color_levels_change)

            score_plot_traces_color_by_info_change = function () {
                if ($("#score_plot_traces_color_by_info").is(':checked')) {
                    $("#score_plot_show_when_color_by_info").show()
                    $("#score_plot_hide_when_color_by_info").hide()
                } else {
                    $("#score_plot_show_when_color_by_info").hide()
                    $("#score_plot_hide_when_color_by_info").show()
                }
                score_plot_color_levels_change();

            }
            $("#score_plot_traces_color_by_info").change(score_plot_traces_color_by_info_change)


            score_plot_shape_levels_div = '<div class="form-group" style="margin:0;border:0;padding:0"><select class="form-control selectpicker" id="score_plot_shape_levels" data-style="btn btn-link">'
            for (var i = 0; i < p_column_names.length; i++) {
                if (p_column_names[i] !== 'label') {
                    score_plot_shape_levels_div = score_plot_shape_levels_div + '<option>' + p_column_names[i] + '</option>'
                }
            }
            score_plot_shape_levels_div = score_plot_shape_levels_div + '</select></div>'
            $("#score_plot_shape_levels_div").html(score_plot_shape_levels_div)
            score_plot_shape_levels_change = function () {
                score_plot_shape_by = unpack(obj_score_loading_plot.p, $("#score_plot_shape_levels").val())
                score_plot_shape_levels = score_plot_shape_by.filter(unique)
                score_plot_shape_options_div = ""
                for (var i = 0; i < score_plot_shape_levels.length; i++) {
                    score_plot_shape_options_div = score_plot_shape_options_div +
                        '<div class="form-group score_plot_shapes" style="margin:0;border:0;padding:0" id="score_plot_shape_options' + i + '">' +
                        '<label>' + score_plot_shape_levels[i] + '</label><select class="form-control selectpicker" data-style="btn btn-link">' +
                        '<option>circle</option>' + '<option>square</option>' +
                        '</select></div>'
                }
                $("#score_plot_shape_options_div").html(score_plot_shape_options_div)


                for (var i = 0; i < score_plot_shape_levels.length; i++) {
                    $("#score_plot_shape_options" + i + " .selectpicker").val(score_plot_traces.scatter_shapes[score_plot_shape_levels.length][i][0])
                    $("#score_plot_shape_options" + i + " .selectpicker").selectpicker('refresh')
                    $("#score_plot_shape_options" + i + " .selectpicker").change(score_plot_debounced)
                }



                init_selectpicker()
                setTimeout(score_plot_debounced, 500)
                $(".score_plot_shapes").change(score_plot_debounced)



            }
            $("#score_plot_shape_levels").change(score_plot_shape_levels_change)

            score_plot_traces_shape_by_info_change = function () {
                if ($("#score_plot_traces_shape_by_info").is(':checked')) {
                    $("#score_plot_show_when_shape_by_info").show()
                    $("#score_plot_hide_when_shape_by_info").hide()
                } else {
                    $("#score_plot_show_when_shape_by_info").hide()
                    $("#score_plot_hide_when_shape_by_info").show()
                }
                score_plot_shape_levels_change()
            }
            $("#score_plot_traces_shape_by_info").change(score_plot_traces_shape_by_info_change)

            score_plot_size_levels_div = '<div class="form-group" style="margin:0;border:0;padding:0"><select class="form-control selectpicker" id="score_plot_size_levels" data-style="btn btn-link">'
            for (var i = 0; i < p_column_names.length; i++) {
                if (p_column_names[i] !== 'label') {
                    score_plot_size_levels_div = score_plot_size_levels_div + '<option>' + p_column_names[i] + '</option>'
                }
            }
            score_plot_size_levels_div = score_plot_size_levels_div + '</select></div>'
            $("#score_plot_size_levels_div").html(score_plot_size_levels_div)
            score_plot_size_levels_change = function () {
                score_plot_size_by = unpack(obj_score_loading_plot.p, $("#score_plot_size_levels").val())
                score_plot_size_levels = score_plot_size_by.filter(unique)

                score_plot_size_options_div = ''
                for (var i = 0; i < score_plot_size_levels.length; i++) {
                    score_plot_size_options_div = score_plot_size_options_div +
                        '<div class="input-group"><div class="input-group-prepend"><span class="input-group-text">' +
                        score_plot_size_levels[i] + "</span></div>" +
                        '<input id="score_plot_size_options' + i + '" type="number" class="form-control score_plot_sizes" placeholder="Dot Size" min="0" step="1" value="15"></div>'
                }
                $("#score_plot_size_options_div").html(score_plot_size_options_div)



                for (var i = 0; i < score_plot_size_levels.length; i++) {
                    if (score_plot_size_levels.length === 1) {
                        $("#score_plot_size_options" + i).val(score_plot_traces.scatter_sizes[score_plot_size_levels.length][i])
                    } else {
                        $("#score_plot_size_options" + i).val(score_plot_traces.scatter_sizes[score_plot_size_levels.length][i][0])
                    }

                    $("#score_plot_size_options" + i).change(score_plot_debounced)
                }




                setTimeout(score_plot_debounced, 500)
                $(".score_plot_sizes").change(score_plot_debounced)
            }
            $("#score_plot_size_levels").change(score_plot_size_levels_change)

            score_plot_traces_size_by_info_change = function () {
                if ($("#score_plot_traces_size_by_info").is(':checked')) {
                    $("#score_plot_show_when_size_by_info").show()
                    $("#score_plot_hide_when_size_by_info").hide()
                } else {
                    $("#score_plot_show_when_size_by_info").hide()
                    $("#score_plot_hide_when_size_by_info").show()
                }
                score_plot_size_levels_change()
            }
            $("#score_plot_traces_size_by_info").change(score_plot_traces_size_by_info_change)

            score_plot_plot_id = "score_plot"







        }
    })














}, 'html');








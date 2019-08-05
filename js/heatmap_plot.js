



$.get("plot_layout_adjuster.html", function (plot_layout_adjuster_string) {
    $("#heatmap_plot_to_be_loaded").append($.parseHTML(plot_layout_adjuster_string.replaceAll("PLOT_NAME", "heatmap_plot")));

    $.getScript("js/plot_layout_adjuster1.js", function (plot_layout_adjuster1) {

        adjusted_heatmap_plot_layout_adjuster1 = plot_layout_adjuster1.replace(/PLOT_NAME/g, 'heatmap_plot')
        eval(adjusted_heatmap_plot_layout_adjuster1)

        // assign the default value for heatmap plot
        ocpu.call("get_heatmap_plot_style", {
            user_id: localStorage.user_id
        }, function (session) {
            session.getObject(function (heatmap_plot_obj) {
                console.log(heatmap_plot_obj)
                oo = heatmap_plot_obj
                heatmap_plot_traces = heatmap_plot_obj.traces
                p_column_names = Object.keys(obj_heatmap_plot.p[0])
                p_column_unique = {}
                p_column_unique_length = {}
                for (var i = 0; i < p_column_names.length; i++) {
                    p_column_unique[p_column_names[i]] = unpack(obj_heatmap_plot.p, p_column_names[i]).filter(unique)
                    p_column_unique_length[p_column_names[i]] = p_column_unique[p_column_names[i]].length
                    $('#heatmap_plot_order_sample_by').append($('<option>', {
                        value: p_column_names[i],
                        text: p_column_names[i]
                    }));
                    $("#heatmap_plot_order_sample_by").selectpicker('refresh')
                    $("#heatmap_plot_order_sample_by").change(function () {
                        heatmap_plot_order_sample_by_div = ""
                        order_sample_by = $("#heatmap_plot_order_sample_by").val()
                        if (order_sample_by.includes("as is")) {
                            heatmap_plot_order_sample_by_div = "<p>Sample Order is displayed <em>as is</em></p>"
                            $("#heatmap_plot_order_sample_levels_div").html(heatmap_plot_order_sample_by_div)
                        } else if (order_sample_by.includes("dendrogram")) {
                            heatmap_plot_order_sample_by_div = "<p>Sample Order is displayed <em>dendrogram</em></p>"
                            $("#heatmap_plot_order_sample_levels_div").html(heatmap_plot_order_sample_by_div)
                        } else {
                            for (var i = 0; i < order_sample_by.length; i++) {
                                heatmap_plot_order_sample_by_div = heatmap_plot_order_sample_by_div +
                                    '<div class="form-group">' +
                                    '<label for="order_sample_by_' + order_sample_by[i] + '">' + order_sample_by[i] + '</label>' +
                                    '<input type="text" class="form-control order_sample_levels" id="order_sample_by_' + order_sample_by[i] + '" aria-describedby="" placeholder="" onchange="heatmap_plot_debounced()">' +
                                    '</div>'
                            }
                            $("#heatmap_plot_order_sample_levels_div").html(heatmap_plot_order_sample_by_div)
                            for (var i = 0; i < order_sample_by.length; i++) {
                                $("#order_sample_by_" + order_sample_by[i]).val(p_column_unique[order_sample_by[i]].join("||"))
                            }
                        }
                        heatmap_plot_debounced()
                    })
                    $('#heatmap_plot_sample_annotation').append($('<option>', {
                        value: p_column_names[i],
                        text: p_column_names[i]
                    }));
                    $("#heatmap_plot_sample_annotation").selectpicker('refresh')
                    $("#heatmap_plot_sample_annotation").change(function () {
                        heatmap_plot_sample_annotation_div = ""
                        sample_annotation = $("#heatmap_plot_sample_annotation").val()
                        for (var i = 0; i < sample_annotation.length; i++) {
                            heatmap_plot_sample_annotation_div = heatmap_plot_sample_annotation_div +
                                '<label>' + sample_annotation[i] + '</label>'
                            for (var j = 0; j < p_column_unique_length[sample_annotation[i]]; j++) {
                                heatmap_plot_sample_annotation_div = heatmap_plot_sample_annotation_div +
                                    '<div class="input-group">' +
                                    '<div class="input-group-prepend"><span class="input-group-text">' + p_column_unique[sample_annotation[i]][j] + '</span></div>' +
                                    '<input type="text" id="sample_annotation_' + p_column_unique[sample_annotation[i]][j] + '" class="spectrums sample_annotation sample_annotation_' + sample_annotation[i] + '" data-show-alpha="true" onchange="heatmap_plot_debounced()" />' + '</div>'
                            }
                        }
                        $("#heatmap_plot_sample_annotation_div").html(heatmap_plot_sample_annotation_div)
                        for (var i = 0; i < sample_annotation.length; i++) {
                            var temp_colors = heatmap_plot_traces.sample_annotation[p_column_unique_length[sample_annotation[i]]]
                            for (var j = 0; j < p_column_unique_length[sample_annotation[i]]; j++) {
                                $("[id='sample_annotation_" + p_column_unique[sample_annotation[i]][j] + "']").spectrum({
                                    color: temp_colors[j][0],
                                    showPalette: true,
                                    palette: color_pallete
                                });
                                $("[id='sample_annotation_" + p_column_unique[sample_annotation[i]][j] + "']").change(heatmap_plot_debounced)
                            }
                        }
                        heatmap_plot_debounced()
                    })

                }

                f_column_names = Object.keys(obj_heatmap_plot.f[0])
                f_column_unique = {}
                f_column_unique_length = {}
                for (var i = 0; i < f_column_names.length; i++) {
                    f_column_unique[f_column_names[i]] = unpack(obj_heatmap_plot.f, f_column_names[i]).filter(unique)
                    f_column_unique_length[f_column_names[i]] = f_column_unique[f_column_names[i]].length
                    $('#heatmap_plot_order_compound_by').append($('<option>', {
                        value: f_column_names[i],
                        text: f_column_names[i]
                    }));
                    $("#heatmap_plot_order_compound_by").selectpicker('refresh')
                    $("#heatmap_plot_order_compound_by").change(function () {
                        heatmap_plot_order_compound_by_div = ""
                        order_compound_by = $("#heatmap_plot_order_compound_by").val()
                        if (order_compound_by.includes("as is")) {
                            heatmap_plot_order_compound_by_div = "<p>Compound Order is displayed <em>as is</em></p>"
                            $("#heatmap_plot_order_compound_levels_div").html(heatmap_plot_order_compound_by_div)
                        } else if (order_compound_by.includes("dendrogram")) {
                            heatmap_plot_order_compound_by_div = "<p>Compound Order is displayed <em>dendrogram</em></p>"
                            $("#heatmap_plot_order_compound_levels_div").html(heatmap_plot_order_compound_by_div)
                        } else {
                            for (var i = 0; i < order_compound_by.length; i++) {
                                heatmap_plot_order_compound_by_div = heatmap_plot_order_compound_by_div +
                                    '<div class="form-group">' +
                                    '<label for="order_compound_by_' + order_compound_by[i] + '">' + order_compound_by[i] + '</label>' +
                                    '<input type="text" class="form-control order_compound_levels" id="order_compound_by_' + order_compound_by[i] + '" aria-describedby="" placeholder="" onchange="heatmap_plot_debounced()">' +
                                    '</div>'
                            }
                            $("#heatmap_plot_order_compound_levels_div").html(heatmap_plot_order_compound_by_div)
                            for (var i = 0; i < order_compound_by.length; i++) {
                                $("#order_compound_by_" + order_compound_by[i]).val(f_column_unique[order_compound_by[i]].join("||"))
                            }
                        }
                        heatmap_plot_debounced()
                    })

                    $('#heatmap_plot_compound_annotation').append($('<option>', {
                        value: f_column_names[i],
                        text: f_column_names[i]
                    }));
                    $("#heatmap_plot_compound_annotation").selectpicker('refresh')
                    $("#heatmap_plot_compound_annotation").change(function () {
                        heatmap_plot_compound_annotation_div = ""
                        compound_annotation = $("#heatmap_plot_compound_annotation").val()
                        for (var i = 0; i < compound_annotation.length; i++) {
                            heatmap_plot_compound_annotation_div = heatmap_plot_compound_annotation_div +
                                '<label>' + compound_annotation[i] + '</label>'
                            for (var j = 0; j < f_column_unique_length[compound_annotation[i]]; j++) {
                                heatmap_plot_compound_annotation_div = heatmap_plot_compound_annotation_div +
                                    '<div class="input-group">' +
                                    '<div class="input-group-prepend"><span class="input-group-text">' + f_column_unique[compound_annotation[i]][j] + '</span></div>' +
                                    '<input type="text" id="compound_annotation_' + f_column_unique[compound_annotation[i]][j] + '" class="spectrums compound_annotation compound_annotation_' + compound_annotation[i] + '" data-show-alpha="true" onchange="heatmap_plot_debounced()" />' + '</div>'
                            }
                        }
                        $("#heatmap_plot_compound_annotation_div").html(heatmap_plot_compound_annotation_div)
                        for (var i = 0; i < compound_annotation.length; i++) {
                            var temp_colors = heatmap_plot_traces.compound_annotation[f_column_unique_length[compound_annotation[i]]]
                            for (var j = 0; j < f_column_unique_length[compound_annotation[i]]; j++) {
                                $("[id='compound_annotation_" + f_column_unique[compound_annotation[i]][j] + "']").spectrum({
                                    color: temp_colors[j][0],
                                    showPalette: true,
                                    palette: color_pallete
                                });
                                $("[id='compound_annotation_" + f_column_unique[compound_annotation[i]][j] + "']").change(heatmap_plot_debounced)
                            
                            
                                heatmap_plot_debounced()
                            
                            }
                        }
                    })
                }


                $.getScript("js/plot_layout_adjuster2.js", function (plot_layout_adjuster2) {
                    adjusted_heatmap_plot_layout_adjuster2 = plot_layout_adjuster2.replace(/PLOT_NAME/g, 'heatmap_plot')
                    //console.log(adjusted_heatmap_plot_layout_adjuster2)
                    eval(adjusted_heatmap_plot_layout_adjuster2)
                    // initialize the traces on HTML.
                    $("#show_sample_label").prop("checked", heatmap_plot_obj.traces.show_sample_label[0]).change();
                    $("#show_compound_label").prop("checked", heatmap_plot_obj.traces.show_compound_label[0]).change();
                    $("#colorscale").val(heatmap_plot_obj.traces.colorscale)
                    $("#colorscale").selectpicker('refresh')
                    $("#sample_tree_height").val(heatmap_plot_obj.traces.sample_tree_height)
                    $("#sample_annotation_height").val(heatmap_plot_obj.traces.sample_annotation_height)
                    $("#compound_tree_height").val(heatmap_plot_obj.traces.compound_tree_height)
                    $("#compound_annotation_height").val(heatmap_plot_obj.traces.compound_annotation_height)





                    heatmap_plot_debounced()
                })

            })
        }).fail(function (e2) {
            Swal.fire('Oops...', e2.responseText, 'error')
        })

 
        gather_page_information_to_heatmap_plot = function () {



            $.getScript("js/plot_layout_adjuster3.js", function (plot_layout_adjuster3) {
                var adjusted_heatmap_plot_layout_adjuster3 = plot_layout_adjuster3.replace(/PLOT_NAME/g, 'heatmap_plot')
                //console.log(adjusted_heatmap_plot_layout_adjuster3)
                eval(adjusted_heatmap_plot_layout_adjuster3)
                console.log($("#heatmap_plot_plot_bgcolor").spectrum("get").toRgbString())
                save_heatmap_plot_style = function () {

                    heatmap_plot_layout.traces.show_sample_label = $("#show_sample_label").prop("checked")
                    heatmap_plot_layout.traces.show_compound_label = $("#show_compound_label").prop("checked")

                    heatmap_plot_layout.traces.colorscale = $("#colorscale").val()
                    heatmap_plot_layout.traces.sample_tree_height = $("#sample_tree_height").val()
                    heatmap_plot_layout.traces.sample_annotation_height = $("#sample_annotation_height").val()
                    heatmap_plot_layout.traces.compound_tree_height = $("#compound_tree_height").val()
                    heatmap_plot_layout.traces.compound_annotation_height = $("#compound_annotation_height").val()

                    //!!! this has not been saved.
                    //heatmap_plot_traces.sample_annotation[]



                    $.getScript("js/plot_layout_adjuster4.js", function (plot_layout_adjuster4) {
                        adjusted_heatmap_plot_layout_adjuster4 = plot_layout_adjuster4.replace(/PLOT_NAME/g, 'heatmap_plot')
                        console.log(adjusted_heatmap_plot_layout_adjuster4)
                        eval(adjusted_heatmap_plot_layout_adjuster4)
                    })


                }
                order_sample_by = $("#heatmap_plot_order_sample_by").val()
                if (order_sample_by.includes("as is")) {
                    sample_order = sequence(from = 0, to = p.length - 1)
                    show_sample_dendrogram = false
                } else if (order_sample_by.includes('dendrogram')) {
                    sample_order = obj_heatmap_plot.hc_row_order
                    show_sample_dendrogram = true
                } else {
                    order_sample_levels = {}
                    $(".order_sample_levels").each(function () {
                        if (this.id !== '') {
                            order_sample_levels[this.id.replace("order_sample_by_", "")] = $(this).val()
                        }
                    })
                    var num_sample = p.length
                    var keys = Object.keys(order_sample_levels)
                    var values = Object.values(order_sample_levels)
                    var num_order = Array(num_sample).fill(0)
                    for (var i = 0; i < keys.length; i++) {
                        var levels = unpack(p, keys[i])
                        var ordered_levels = values[i].split("||")
                        for (var j = 0; j < ordered_levels.length; j++) {
                            var target_index = getAllIndexes(levels, ordered_levels[j])
                            for (var k = 0; k < target_index.length; k++) {
                                num_order[target_index[k]] = num_order[target_index[k]] + j
                            }
                        }
                        num_order = num_order.map(x => x * (keys.length - i) * 1000)
                    }
                    num_order = num_order.map((x, i) => x + i / num_sample)
                    var ordered_num_order = sort(num_order)
                    sample_order = ordered_num_order.map(x => num_order.indexOf(x))
                    show_sample_dendrogram = false
                }


                order_compound_by = $("#heatmap_plot_order_compound_by").val()
                if (order_compound_by.includes('as is')) {
                    compound_order = sequence(from = 0, to = f.length - 1)
                    show_compound_dendrogram = false
                } else if (order_compound_by.includes('dendrogram')) {
                    compound_order = obj_heatmap_plot.hc_col_order
                    show_compound_dendrogram = true
                } else {
                    var num_compound = f.length
                    var keys = Object.keys(order_compound_levels)
                    var values = Object.values(order_compound_levels)
                    var num_order = Array(num_compound).fill(0)
                    for (var i = 0; i < keys.length; i++) {
                        var levels = unpack(f, keys[i])
                        var ordered_levels = values[i].split("||")
                        for (var j = 0; j < ordered_levels.length; j++) {
                            var target_index = getAllIndexes(levels, ordered_levels[j])
                            for (var k = 0; k < target_index.length; k++) {
                                num_order[target_index[k]] = num_order[target_index[k]] + j
                            }
                        }
                        num_order = num_order.map(x => x * (keys.length - i) * 1000)
                    }
                    num_order = num_order.map((x, i) => x + i / num_compound)
                    var ordered_num_order = sort(num_order)
                    compound_order = ordered_num_order.map(x => num_order.indexOf(x))
                    show_compound_dendrogram = false
                }
                dta = obj_heatmap_plot.temp_data
                var heatmap_z = compound_order.map(x => dta[x]).map(x => sample_order.map(y => x[y]))
                var sample_label = unpack(p, "label")
                var compound_label = unpack(f, "label")

                var heatmap_x = Array.apply(null, { length: dta[0].length }).map(Number.call, Number)
                var heatmap_y = Array.apply(null, { length: dta.length }).map(Number.call, Number)
                var heatmap_x_text = sample_order.map(x => sample_label[x])
                var heatmap_y_text = compound_order.map(x => compound_label[x])
                var tickvals = [obj_heatmap_plot.min[0], obj_heatmap_plot.median[0], obj_heatmap_plot.max[0]]

                sample_dendro_trace_x = obj_heatmap_plot.sx
                sample_dendro_trace_y = obj_heatmap_plot.sy
                compound_dendro_trace_x = obj_heatmap_plot.cx
                compound_dendro_trace_y = obj_heatmap_plot.cy

                sample_annotations = []
                for (var i = 0; i < $("#heatmap_plot_sample_annotation").val().length; i++) {
                    var temp_object = {
                        colors: [],
                        column: sample_annotation[i],
                        type: 'character'
                    }
                    $(".sample_annotation_" + sample_annotation[i].replaceAll(" ", ".")).each(function () {
                        temp_object.colors.push($("[id='" + this.id + "']").spectrum("get").toRgbString())
                    })
                    sample_annotations.push(temp_object)
                }
                sample_level_options = p_column_unique

                var sample_tree_height = $("#sample_tree_height").val()

                var sample_annotation_height = $("#sample_annotation_height").val()

                compound_annotations = []
                for (var i = 0; i < $("#heatmap_plot_compound_annotation").val().length; i++) {
                    var temp_object = {
                        colors: [],
                        column: compound_annotation[i],
                        type: 'character'
                    }
                    $(".compound_annotation_" + compound_annotation[i].replaceAll(" ", ".")).each(function () {
                        temp_object.colors.push($("[id='" + this.id + "']").spectrum("get").toRgbString())
                    })
                    compound_annotations.push(temp_object)
                }
                compound_level_options = f_column_unique

                var compound_tree_height = $("#compound_tree_height").val()

                var compound_annotation_height = $("#compound_annotation_height").val()


                var layout = heatmap_plot_layout
                var colorscale = $("#colorscale").val()
                var plot_id = "heatmap_plot"


                show_compound_label = $("#show_compound_label").is(':checked')
                show_sample_label = $("#show_sample_label").is(':checked')
                heatmap_plot_fun({
                    heatmap_x: heatmap_x, heatmap_y: heatmap_y, heatmap_z: heatmap_z, sample_label: sample_label, heatmap_x_text: heatmap_x_text, heatmap_y_text: heatmap_y_text, tickvals: tickvals,
                    colorscale: colorscale,
                    show_sample_dendrogram: show_sample_dendrogram, sample_dendro_trace_x: sample_dendro_trace_x, sample_dendro_trace_y: sample_dendro_trace_y,
                    show_compound_dendrogram: show_compound_dendrogram, compound_dendro_trace_x: compound_dendro_trace_x, compound_dendro_trace_y: compound_dendro_trace_y,
                    sample_annotations: sample_annotations, order_sample_by: order_sample_by, order_compound_by: order_compound_by,
                    sample_level_options: sample_level_options, p: p, sample_order: sample_order,
                    sample_tree_height: sample_tree_height, sample_annotation_height: sample_annotation_height, show_sample_label: show_sample_label,
                    compound_annotations: compound_annotations,
                    compound_level_options: compound_level_options, f: f, compound_order: compound_order,
                    compound_tree_height: compound_tree_height, compound_annotation_height: compound_annotation_height, show_compound_label: show_compound_label,
                    layout: layout, plot_id: plot_id
                })

            })
        }
        heatmap_plot_debounced = _.debounce(gather_page_information_to_heatmap_plot, 250, { 'maxWait': 1000 }); // this must be a global object.



    }, 'js')
}, 'html');








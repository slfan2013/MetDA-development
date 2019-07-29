console.log("scree.plot");



$.get("plot_layout_adjuster.html", function (plot_layout_adjuster_string) {
    $("#scree_plot_to_be_loaded").append($.parseHTML(plot_layout_adjuster_string.replaceAll("PLOT_NAME", "scree_plot")));

    $.getScript("js/plot_layout_adjuster1.js", function (plot_layout_adjuster1) {
        var adjusted_scree_plot_layout_adjuster1 = plot_layout_adjuster1.replaceAll("PLOT_NAME", "scree_plot")
        console.log(adjusted_scree_plot_layout_adjuster1)
        eval(adjusted_scree_plot_layout_adjuster1)



        // assign the default value for pca scree plot
        ocpu.call("get_pca_scree_plot_style", {
            user_id: localStorage.user_id
        }, function (session) {
            session.getObject(function (scree_plot_obj) {
                console.log(scree_plot_obj)
                oo = scree_plot_obj
                scree_plot_traces = scree_plot_obj.traces

                $.getScript("js/plot_layout_adjuster2.js", function (plot_layout_adjuster2) {
                    adjusted_scree_plot_layout_adjuster2 = plot_layout_adjuster2.replaceAll("PLOT_NAME", "scree_plot")
                    console.log(adjusted_scree_plot_layout_adjuster2) // THIS console log is neccessary. 
                    eval(adjusted_scree_plot_layout_adjuster2)

                    $("#scree_plot_layout_xaxis_title_text").val("Number of Principal Components")
                    $("#scree_plot_layout_yaxis_title_text").val("Percentage of Variance Explained")



                    $.getScript("js/plot_layout_adjuster3.js", function (plot_layout_adjuster3) {
                        adjusted_scree_plot_layout_adjuster3 = plot_layout_adjuster3.replaceAll("PLOT_NAME", "scree_plot")
                        console.log(adjusted_scree_plot_layout_adjuster3) // THIS console log is neccessary.
                        eval(adjusted_scree_plot_layout_adjuster3)


                        gather_page_information_to_scree_plot()

                    })


                })

            })
        }).fail(function (e2) {
            Swal.fire('Oops...', e2.responseText, 'error')
        })


        scree_plot_fun = function ({ ys = undefined, texts = undefined, hovertexts = undefined, names = undefined, add_line_trace = undefined, line_trace_index = undefined, scree_plot_layout = undefine, plot_id = undefined }) { // ys, texts, hovertexts, is [[xxx],[xxx]]. names is [x,x,x].add_line_trace is true
            var x = Array.from({ length: ys[0].length }, (v, k) => k + 1);
            //var text1 = y1.map(x => (x*100).toFixed(2)+"%" )
            //var hovertext1 = text1.map((x,i) => "PC"+ (i+1)+": "+x)
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
                        color: "rgba(89,181,199,1)",
                        line: {
                            width: 2,
                            color: "rgba(89,181,199,1)"
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
                    // Note: cache should not be re-used by repeated calls to JSON.stringify.
                    var cache = [];
                    fullLayout = JSON.stringify(scree_plot_gd._fullLayout, function (key, value) {
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
                    fullData = JSON.stringify(scree_plot_gd._fullData, function (key, value) {
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

                    scree_plot_parameters = {
                        full_data: JSON.parse(fullData),
                        full_layout: JSON.parse(fullLayout),
                        data: scree_plot_gd.data,
                        layout: scree_plot_gd.layout,
                    }


                    Plotly.toImage(gd, { format: 'svg' })
                        .then(
                            function (url) {
                                scree_plot_url = url
                                scree_plot_url2 = scree_plot_url.replace(/^data:image\/svg\+xml,/, '');
                                scree_plot_url2 = decodeURIComponent(scree_plot_url2);
                                plot_url.scree_plot = btoa(unescape(encodeURIComponent(scree_plot_url2)))
                                files_sources[3] = plot_url.scree_plot
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
                                    plot_url.scree_plot = base64
                                };
                                image.src = imgsrc*/
                            }
                        )



                });

        }

        gather_page_information_to_scree_plot = function () {
            console.log("!")
            ys = [obj_scree_plot.variance]
            texts = ys.map(function (x) {
                return (x.map(function (z) {
                    return ((z * 100).toFixed(2) + "%")
                }))
            })
            hovertexts = texts.map(function (x) {
                return (x.map(function (z, i) {
                    return ("PC" + (i + 1) + ": " + z)
                }))
            })

            names = ["Variance Explained"]
            add_line_trace = true
            line_trace_index = 0



            plot_id = "scree_plot"


            $.getScript("js/plot_layout_adjuster3.js", function (plot_layout_adjuster3) {
                adjusted_scree_plot_layout_adjuster3 = plot_layout_adjuster3.replaceAll("PLOT_NAME", "scree_plot")
                console.log(adjusted_scree_plot_layout_adjuster3) // THIS console log is neccessary.
                eval(adjusted_scree_plot_layout_adjuster3)
                save_scree_plot_style = function () {


                    $.getScript("js/plot_layout_adjuster4.js", function (plot_layout_adjuster4) {
                        adjusted_scree_plot_layout_adjuster4 = plot_layout_adjuster4.replaceAll("PLOT_NAME", "scree_plot")
                        console.log(adjusted_scree_plot_layout_adjuster4)
                        eval(adjusted_scree_plot_layout_adjuster4)
                    })

                }

                scree_plot_fun({ ys: ys, texts: texts, hovertexts: hovertexts, names: names, add_line_trace: add_line_trace, line_trace_index: line_trace_index, scree_plot_layout: scree_plot_layout, plot_id: plot_id })

            })



        }





    })


})


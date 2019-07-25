PLOT_NAME_layout = {
    plot_bgcolor: $("#PLOT_NAME_plot_bgcolor").spectrum("get").toRgbString(),
    paper_bgcolor: $("#PLOT_NAME_paper_bgcolor").spectrum("get").toRgbString(),
    /*font: {
        family: "Arial",
        size: 12,
        color: "#000000"
    },*/
    title: {
        text: $("#PLOT_NAME_layout_title_text").val(),
        font: {
            family: $("#PLOT_NAME_layout_title_font .form-group .selectpicker").val(),
            size: $("#PLOT_NAME_layout_title_font .input-group .size").val(),
            color: $("#PLOT_NAME_layout_title_font .input-group .spectrums").spectrum("get").toRgbString(),
        },
        x: $("#PLOT_NAME_layout_title_x").val(),
        y: $("#PLOT_NAME_layout_title_y").val(),
    },
    autosize: false,
    width: $("#PLOT_NAME_layout_width").val(),
    height: $("#PLOT_NAME_layout_height").val(),
    margin: {
        l: $("#PLOT_NAME_layout_margin_left").val(),
        r: $("#PLOT_NAME_layout_margin_right").val(),
        t: $("#PLOT_NAME_layout_margin_top").val(),
        b: $("#PLOT_NAME_layout_margin_bottom").val(),
        pad: 0,
        autoexpand: true
    },
    xaxis: {
        title: {
            text: $("#PLOT_NAME_layout_xaxis_title_text").val(),
            font: {
                family: $("#PLOT_NAME_layout_xaxis_title_font .form-group .selectpicker").val(),
                size: $("#PLOT_NAME_layout_xaxis_title_font .input-group .size").val(),
                color: $("#PLOT_NAME_layout_xaxis_title_font .input-group .spectrums").spectrum("get").toRgbString(),
            },
        },
        ticklen: $("#PLOT_NAME_layout_xaxis_ticklen").val(),
        tickwidth: $("#PLOT_NAME_layout_xaxis_tickwidth").val(),
        tickcolor: $("#PLOT_NAME_layout_xaxis_tickcolor").spectrum("get").toRgbString(),
        tickfont: {
            family: $("#PLOT_NAME_layout_xaxis_tickfont .form-group .selectpicker").val(),
            size: $("#PLOT_NAME_layout_xaxis_tickfont .input-group .size").val(),
            color: $("#PLOT_NAME_layout_xaxis_tickfont .input-group .spectrums").spectrum("get").toRgbString(),
        },
        tickangle: $("#PLOT_NAME_layout_xaxis_tickangle").val(),
        showline: true,
        linecolor: $("#PLOT_NAME_layout_xaxis_linecolor").spectrum("get").toRgbString(),
        linewidth: $("#PLOT_NAME_layout_xaxis_linewidth").val(),
        showgrid: $("#PLOT_NAME_layout_xaxis_showgrid").is(":checked"),
        gridcolor: $("#PLOT_NAME_layout_xaxis_gridcolor").spectrum("get").toRgbString(),
        gridwidth: $("#PLOT_NAME_layout_xaxis_gridwidth").val(),
        zeroline: $("#PLOT_NAME_layout_xaxis_zeroline").is(":checked"),
        zerolinecolor: $("#PLOT_NAME_layout_xaxis_zerolinecolor").spectrum("get").toRgbString(),
        zerolinewidth: $("#PLOT_NAME_layout_xaxis_zerolinewidth").val()
    },
    yaxis: {
        title: {
            text: $("#PLOT_NAME_layout_yaxis_title_text").val(),
            font: {
                family: $("#PLOT_NAME_layout_yaxis_title_font .form-group .selectpicker").val(),
                size: $("#PLOT_NAME_layout_yaxis_title_font .input-group .size").val(),
                color: $("#PLOT_NAME_layout_yaxis_title_font .input-group .spectrums").spectrum("get").toRgbString(),
            },
        },
        ticklen: $("#PLOT_NAME_layout_yaxis_ticklen").val(),
        tickwidth: $("#PLOT_NAME_layout_yaxis_tickwidth").val(),
        tickcolor: $("#PLOT_NAME_layout_yaxis_tickcolor").spectrum("get").toRgbString(),
        tickfont: {
            family: $("#PLOT_NAME_layout_yaxis_tickfont .form-group .selectpicker").val(),
            size: $("#PLOT_NAME_layout_yaxis_tickfont .input-group .size").val(),
            color: $("#PLOT_NAME_layout_yaxis_tickfont .input-group .spectrums").spectrum("get").toRgbString(),
        },
        tickangle: $("#PLOT_NAME_layout_yaxis_tickangle").val(),
        showline: true,
        linecolor: $("#PLOT_NAME_layout_yaxis_linecolor").spectrum("get").toRgbString(),
        linewidth: $("#PLOT_NAME_layout_yaxis_linewidth").val(),
        showgrid: $("#PLOT_NAME_layout_yaxis_showgrid").is(":checked"),
        gridcolor: $("#PLOT_NAME_layout_yaxis_gridcolor").spectrum("get").toRgbString(),
        gridwidth: $("#PLOT_NAME_layout_yaxis_gridwidth").val(),
        zeroline: $("#PLOT_NAME_layout_yaxis_zeroline").is(":checked"),
        zerolinecolor: $("#PLOT_NAME_layout_yaxis_zerolinecolor").spectrum("get").toRgbString(),
        zerolinewidth: $("#PLOT_NAME_layout_yaxis_zerolinewidth").val()
    },
    hovermode: "closest",
    traces: PLOT_NAME_traces
}
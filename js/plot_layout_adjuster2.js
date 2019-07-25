$("#PLOT_NAME_plot_bgcolor").spectrum({
    color: PLOT_NAME_obj.plot_bgcolor[0],
    showPalette: true,
    palette: color_pallete
});
$("#PLOT_NAME_paper_bgcolor").spectrum({
    color: PLOT_NAME_obj.paper_bgcolor[0],
    showPalette: true,
    palette: color_pallete
});
$("#PLOT_NAME_layout_title_text").val(PLOT_NAME_obj.title.text)
$("#PLOT_NAME_layout_title_font .form-group .selectpicker").val(PLOT_NAME_obj.title.font.family)
$("#PLOT_NAME_layout_title_font .form-group .selectpicker").selectpicker('refresh')
$("#PLOT_NAME_layout_title_font .input-group .size").val(PLOT_NAME_obj.title.font.size)
$("#PLOT_NAME_layout_title_font .input-group .spectrums").spectrum({
    color: PLOT_NAME_obj.title.font.color[0],
    showPalette: true,
    palette: color_pallete
});
$("#PLOT_NAME_layout_title_x").val(PLOT_NAME_obj.title.x)
$("#PLOT_NAME_layout_title_y").val(PLOT_NAME_obj.title.y)
$("#PLOT_NAME_layout_width").val(PLOT_NAME_obj.width)
$("#PLOT_NAME_layout_height").val(PLOT_NAME_obj.height)
$("#PLOT_NAME_layout_margin_left").val(PLOT_NAME_obj.margin.l)
$("#PLOT_NAME_layout_margin_right").val(PLOT_NAME_obj.margin.r)
$("#PLOT_NAME_layout_margin_top").val(PLOT_NAME_obj.margin.t)
$("#PLOT_NAME_layout_margin_bottom").val(PLOT_NAME_obj.margin.b)

//$("#PLOT_NAME_layout_xaxis_title_text").val("PC" + $("#PLOT_NAME_pcx").val() + " (" + (obj_score_loading_plot.variance[$("#PLOT_NAME_pcx").val() - 1] * 100).toFixed(2) + "%)")

$("#PLOT_NAME_layout_xaxis_title_text").val(PLOT_NAME_obj.xaxis.title.text)


$("#PLOT_NAME_layout_xaxis_title_font .form-group .selectpicker").val(PLOT_NAME_obj.xaxis.title.font.family)
$("#PLOT_NAME_layout_xaxis_title_font .form-group .selectpicker").selectpicker('refresh')
$("#PLOT_NAME_layout_xaxis_title_font .input-group .size").val(PLOT_NAME_obj.xaxis.title.font.size)
$("#PLOT_NAME_layout_xaxis_title_font .input-group .spectrums").spectrum({
    color: PLOT_NAME_obj.xaxis.title.font.color[0],
    showPalette: true,
    palette: color_pallete
});

$("#PLOT_NAME_layout_xaxis_ticklen").val(PLOT_NAME_obj.xaxis.ticklen)
$("#PLOT_NAME_layout_xaxis_tickwidth").val(PLOT_NAME_obj.xaxis.tickwidth)
$("#PLOT_NAME_layout_xaxis_tickcolor").spectrum({
    color: PLOT_NAME_obj.xaxis.tickcolor[0],
    showPalette: true,
    palette: color_pallete
});

$("#PLOT_NAME_layout_xaxis_tickfont .form-group .selectpicker").val(PLOT_NAME_obj.xaxis.tickfont.family)
$("#PLOT_NAME_layout_xaxis_tickfont .form-group .selectpicker").selectpicker('refresh')
$("#PLOT_NAME_layout_xaxis_tickfont .input-group .size").val(PLOT_NAME_obj.xaxis.tickfont.size)
$("#PLOT_NAME_layout_xaxis_tickfont .input-group .spectrums").spectrum({
    color: PLOT_NAME_obj.xaxis.tickfont.color[0],
    showPalette: true,
    palette: color_pallete
});

$("#PLOT_NAME_layout_xaxis_tickangle").val(PLOT_NAME_obj.xaxis.tickangle)
$("#PLOT_NAME_layout_xaxis_linecolor").spectrum({
    color: PLOT_NAME_obj.xaxis.linecolor[0],
    showPalette: true,
    palette: color_pallete
});
$("#PLOT_NAME_layout_xaxis_linewidth").val(PLOT_NAME_obj.xaxis.linewidth)

$("#PLOT_NAME_layout_xaxis_showgrid").prop("checked", PLOT_NAME_obj.xaxis.showgrid[0])
$("#PLOT_NAME_layout_xaxis_gridcolor").spectrum({
    color: PLOT_NAME_obj.xaxis.gridcolor[0],
    showPalette: true,
    palette: color_pallete
});
$("#PLOT_NAME_layout_xaxis_gridwidth").val(PLOT_NAME_obj.xaxis.gridwidth)
$("#PLOT_NAME_layout_xaxis_zeroline").prop("checked", PLOT_NAME_obj.xaxis.zeroline[0])
$("#PLOT_NAME_layout_xaxis_zerolinecolor").spectrum({
    color: PLOT_NAME_obj.xaxis.zerolinecolor[0],
    showPalette: true,
    palette: color_pallete
});
$("#PLOT_NAME_layout_xaxis_zerolinewidth").val(PLOT_NAME_obj.xaxis.zerolinewidth)


$("#PLOT_NAME_layout_yaxis_title_text").val(PLOT_NAME_obj.yaxis.title.text)

$("#PLOT_NAME_layout_yaxis_title_font .form-group .selectpicker").val(PLOT_NAME_obj.yaxis.title.font.family)
$("#PLOT_NAME_layout_yaxis_title_font .form-group .selectpicker").selectpicker('refresh')
$("#PLOT_NAME_layout_yaxis_title_font .input-group .size").val(PLOT_NAME_obj.yaxis.title.font.size)
$("#PLOT_NAME_layout_yaxis_title_font .input-group .spectrums").spectrum({
    color: PLOT_NAME_obj.yaxis.title.font.color[0],
    showPalette: true,
    palette: color_pallete
});

$("#PLOT_NAME_layout_yaxis_ticklen").val(PLOT_NAME_obj.yaxis.ticklen)
$("#PLOT_NAME_layout_yaxis_tickwidth").val(PLOT_NAME_obj.yaxis.tickwidth)
$("#PLOT_NAME_layout_yaxis_tickcolor").spectrum({
    color: PLOT_NAME_obj.yaxis.tickcolor[0],
    showPalette: true,
    palette: color_pallete
});

$("#PLOT_NAME_layout_yaxis_tickfont .form-group .selectpicker").val(PLOT_NAME_obj.yaxis.tickfont.family)
$("#PLOT_NAME_layout_yaxis_tickfont .form-group .selectpicker").selectpicker('refresh')
$("#PLOT_NAME_layout_yaxis_tickfont .input-group .size").val(PLOT_NAME_obj.yaxis.tickfont.size)
$("#PLOT_NAME_layout_yaxis_tickfont .input-group .spectrums").spectrum({
    color: PLOT_NAME_obj.yaxis.tickfont.color[0],
    showPalette: true,
    palette: color_pallete
});

$("#PLOT_NAME_layout_yaxis_tickangle").val(PLOT_NAME_obj.yaxis.tickangle)
$("#PLOT_NAME_layout_yaxis_linecolor").spectrum({
    color: PLOT_NAME_obj.yaxis.linecolor[0],
    showPalette: true,
    palette: color_pallete
});
$("#PLOT_NAME_layout_yaxis_linewidth").val(PLOT_NAME_obj.yaxis.linewidth)

$("#PLOT_NAME_layout_yaxis_showgrid").prop("checked", PLOT_NAME_obj.yaxis.showgrid[0])
$("#PLOT_NAME_layout_yaxis_gridcolor").spectrum({
    color: PLOT_NAME_obj.yaxis.gridcolor[0],
    showPalette: true,
    palette: color_pallete
});
$("#PLOT_NAME_layout_yaxis_gridwidth").val(PLOT_NAME_obj.yaxis.gridwidth)
$("#PLOT_NAME_layout_yaxis_zeroline").prop("checked", PLOT_NAME_obj.yaxis.zeroline[0])
$("#PLOT_NAME_layout_yaxis_zerolinecolor").spectrum({
    color: PLOT_NAME_obj.yaxis.zerolinecolor[0],
    showPalette: true,
    palette: color_pallete
});
$("#PLOT_NAME_layout_yaxis_zerolinewidth").val(PLOT_NAME_obj.yaxis.zerolinewidth)
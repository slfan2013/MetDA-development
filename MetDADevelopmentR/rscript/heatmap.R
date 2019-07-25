# result = list(a = defination_of_missing_value)


# http://localhost:5656/ocpu/tmp/x08f655c87c/
# helper function for creating dendograms
ggdend <- function(df) {
  ggplot() +
    geom_segment(data = df, aes(x=x, y=y, xend=xend, yend=yend)) +
    labs(x = "", y = "") + theme_minimal() +
    theme(axis.text = element_blank(), axis.ticks = element_blank(),
          panel.grid = element_blank())
}
pacman::p_load(data.table, ggdendro, plotly, ggplot2)



data = read_data_from_projects(project_id, activate_data_id)
e = data$e
f = data$f
p = data$p

# Summarize the information about missing values.
# data = wcmc::read_data("GCTOF_Abraham_CM_v_M_heart_NoSwim.xlsx")
# e = data$e_matrix
# f = data$f
# p = data$p





if(scaling_method=='none'){
  sds = rep(1,nrow(f))
}else if(scaling_method=="standard"){
  sds = apply(e,1,sd,na.rm = TRUE)
}else if(scaling_method=='pareto'){
  sds = sqrt(apply(e,1,sd,na.rm = TRUE))
}else if(scaling_method == "center"){
  sds = rep(1,nrow(f))
}

e_t = t(e)
e_scale = scale(e_t, center = !scaling_method=='none', scale = sds)


#dendogram data

if(!exists("order_sample")){
  order_sample = 'dendrogram'
}
if(!exists("order_compound")){
  order_compound = 'dendrogram'
}
if(order_sample == 'dendrogram'){
  hc.col = hclust(dist(t(e_scale)))
  dd.col <- as.dendrogram(hc.col)
  dy <- dendro_data(dd.col)
  py <- ggdend(dy$segments) + coord_flip()
  yy = ggplotly(py)
}else{
  hc.col = list()
  hc.col$order = 1:nrow(e)
}

if(order_compound=='dendrogram'){
  hc.row = hclust(dist(e_scale))
  dd.row <- as.dendrogram(hc.row)
  dx <- dendro_data(dd.row)
  px <- ggdend(dx$segments)
  xx = ggplotly(px)
}else{
  hc.row = list()
  hc.row$order = 1:ncol(e)
}


hc.col.order = hc.col$order
hc.row.order = hc.row$order
# result = list(
#   # temp_data = t(e_scale[hc.row.order,hc.col.order]),
#   temp_data = t(e_scale),
#   report_html =report_html,
#   sx = xx$x$data[[1]]$x,
#   sy = xx$x$data[[1]]$y,
#   cx = yy$x$data[[1]]$x,
#   cy = yy$x$data[[1]]$y,
#   max = max(e_scale, na.rm = TRUE),
#   median = median(e_scale, na.rm = TRUE),
#   min = min(e_scale, na.rm = TRUE),
#   hc_col_order = hc.col.order-1,
#   hc_row_order = hc.row.order-1
# )






result = list(results_description = "Here is the heatmap summary.",p = p, f = f, hc_col_order = hc.col.order-1, hc_row_order = hc.row.order-1,temp_data = t(e_scale),sx = xx$x$data[[1]]$x,sy = xx$x$data[[1]]$y,cx = yy$x$data[[1]]$x,cy = yy$x$data[[1]]$y,max = max(e_scale, na.rm = TRUE),median = median(e_scale, na.rm = TRUE),min = min(e_scale, na.rm = TRUE))






if(exists("heatmap_plot")){# this means this call is from quick_analysis. Here we are going to draw score plot and loading plot.
  full_data = score_plot$full_data
  full_layout = score_plot$full_layout


  data = score_plot$data

  # for(i in 1:length(data)){
  #   data[[i]]$x = unlist(data[[i]]$x)
  #   data[[i]]$y = unlist(data[[i]]$y)
  #   data[[i]]$text = unlist(data[[i]]$text)
  # }

  score_plot_style = get_pca_score_plot_style("slfan") # !!! HERE WE NEED TO CHANGE 'SLFAN' TO NEW ID.

  x = sample_scores$PC1
  y = sample_scores$PC2

  # here I need to re-generate the data according to user's new dataset.
  if(!is.null(score_plot$score_plot_color_levels)){
    color_by = p[[score_plot$score_plot_color_levels]]
    color_levels = unique(color_by)
    color_values = unlist(score_plot_style$traces$scatter_colors[[length(color_levels)]])
  }else{
    color_by = rep("", nrow(p))
    color_values = score_plot$data[[1]]$marker$color
    color_levels = ""
  }
  temp_replace = color_values
  names(temp_replace) = color_levels
  color_by_revalue = plyr::revalue(color_by, temp_replace)


  if(!is.null(score_plot$score_plot_shape_levels)){
    shape_by = p[[score_plot$score_plot_shape_levels]]
    shape_levels = unique(shape_by)
    shape_values = unlist(score_plot_style$traces$scatter_shapes[[length(shape_levels)]])
  }else{
    shape_by = rep("", nrow(p))
    shape_values = score_plot$data[[1]]$marker$symbol
    shape_levels = ""
  }
  temp_replace = shape_values
  names(temp_replace) = shape_levels
  shape_by_revalue = plyr::revalue(shape_by, temp_replace)


  if(!is.null(score_plot$score_plot_size_levels)){
    size_by = p[[score_plot$score_plot_size_levels]]
    size_levels = unique(size_by)
    size_values = unlist(score_plot_style$traces$scatter_sizes[[length(size_levels)]])
  }else{
    size_by = rep("", nrow(p))
    size_values = score_plot$data[[1]]$marker$size
    size_levels = ""
  }
  temp_replace = size_values
  names(temp_replace) = size_levels
  size_by_revalue = plyr::revalue(size_by, temp_replace)

  split_by = paste0(color_by,"+",shape_by,"+",size_by)
  split_by_revalue = paste0(color_by_revalue,"+",shape_by_revalue,"+",size_by_revalue)

  xs = by(x,split_by,function(x) x, simplify = FALSE)
  ys = by(y,split_by,function(x) x, simplify = FALSE)
  trace_keys = names(xs)
  names = trace_keys
  texts = by(p$label, split_by, function(x) x, simplify = FALSE)

  # data = []
  # for (var i = 0; i < trace_keys.length; i++) {
  #   data.push({
  #     mode: 'markers',
  #     x: xs[trace_keys[i]],
  #     y: ys[trace_keys[i]],
  #     name: names[i].replaceAll("+", " "),
  #     text: texts[trace_keys[i]],
  #     marker: {
  #       color: revalue([trace_keys[i].split("+")[0]], color_levels, color_values)[0],
  #       symbol: revalue([trace_keys[i].split("+")[1]], shape_levels, shape_values)[0],
  #       size: revalue([trace_keys[i].split("+")[2]], size_levels, size_values)[0],
  #     },
  #     legendgroup: trace_keys[i],
  #     showlegend:true
  #   })
  # }

  data = list()
  for(i in 1:length(trace_keys)){
    trace_keys_split = stringr::str_split(trace_keys[i],"\\+")[[1]]
    # temp_color_replace = color_values
    # names(temp_color_replace) = color_levels
    # temp_shape_replace = shape_values
    # names(temp_shape_replace) = shape_levels
    # temp_size_replace = size_values
    # names(temp_size_replace) = size_levels

    data[[length(data)+1]] = list(
      mode='markers',
      x=xs[[trace_keys[i]]],
      y=ys[[trace_keys[i]]],
      name=gsub("\\+","",names)[i],
      texts=as.character(texts[[trace_keys[i]]]),
      marker = list(
        color=revalue(trace_keys_split[1],color_levels,color_values),
        symbol=revalue(trace_keys_split[2],shape_levels,shape_values),
        size=revalue(trace_keys_split[3],size_levels,size_values)
      ),
      legendgroup=trace_keys[i],
      showlegend=TRUE
    )
  }

  # add ellipse
  if(!is.null(score_plot$data[[length(score_plot$data)]]$fill)){ # If true, this meas that the the last element of data has toself property, meaning the user has included ellipses..
    ellipse_split_by = rep("", nrow(p))
    # score_plot_ellipse_group = "color"
    temp_split = color_by
    ellipse_split_by = color_by
    ellipse_split_by_revalue = revalue(ellipse_split_by,color_levels,color_values)
    # Currently, only the ellipse by color is accepted. Check javascript Ellipse_split_by = ellipse_split_by.map((x, j) => x + "+" + temp_split[j])

    ellipse_xs_from = by(x, ellipse_split_by, function(x) x, simplify = F)
    ellipse_ys_from = by(y, ellipse_split_by, function(x) x, simplify = F)

    ellipse_xs_ys = mapply(function(x, y) return(list(x,y)), ellipse_xs_from, ellipse_ys_from, SIMPLIFY = FALSE)

    ellipse_trace_keys = names(ellipse_xs_ys)

    # for (var i = 0; i < ellipse_trace_keys.length; i++) {
    #   ellipse_xs_ys[ellipse_trace_keys[i]] = ellipse(ellipse_xs_from[ellipse_trace_keys[i]],
    #                                                  ellipse_ys_from[ellipse_trace_keys[i]], 0.95)
    # }

    for(i in 1:length(ellipse_trace_keys)){
      ellipse_xs_ys[[ellipse_trace_keys[i]]] = unname(as.list(data.table(car::dataEllipse(x=ellipse_xs_from[[ellipse_trace_keys[i]]], y=ellipse_ys_from[[ellipse_trace_keys[i]]], levels=0.95, draw = F))))
    }
    ellipse_names = ellipse_trace_keys

    for(i in 1:length(ellipse_trace_keys)){
      temp_color_values = readr::parse_number(stringr::str_split(revalue(ellipse_trace_keys[i],color_levels,color_values),",")[[1]])
      temp_color = paste0("rgba(", temp_color_values[1], ", ", temp_color_values[2], ", ", temp_color_values[3], ", 0.1)")
      print(i)


      data[[length(data)+1]] = list(
        mode="lines",
        x=ellipse_xs_ys[[ellipse_trace_keys[i]]][[1]],
        y=ellipse_xs_ys[[ellipse_trace_keys[i]]][[2]],
        text=NULL,
        line = list(
          width = 1.889764,
          color =temp_color,
          dash = "solid"
        ),
        fill = "toself",
        fillcolor=temp_color,
        name = ellipse_trace_keys[i],
        showlegend = FALSE,
        hoverinfo = "skip",
        legendgroup = trace_keys[i]
      )
    }
  }



  layout = score_plot$layout


  if(identical(names,"++")){
    layout$showlegend = FALSE
  }


  pacman::p_load(ggplot2, plotly)


  df <- data.frame()
  g <- ggplot(df) + geom_point()
  g <- ggplotly(g)
  pp <- plotly_build(g)


  layout$traces <- NULL
  layout$xaxis$autorange <- NULL
  layout$yaxis$autorange <- NULL


  pp$x$layout <- layout
  # pp

  pp$x$data = data


  score_plot_result = pp
  # https://plot.ly/r/static-image-export/
  # orca(score_plot_result, "score_plot.svg") # make sure to match children text.
  svg(filename="score_plot.svg",
      width=5,
      height=4,
      pointsize=12)
  plot(1:10)
  dev.off()



  full_data = scree_plot$full_data
  full_layout = scree_plot$full_layout


  data = scree_plot$data
  layout = scree_plot$layout

  df <- data.frame()
  g <- ggplot(df) + geom_point()
  g <- ggplotly(g)
  pp <- plotly_build(g)


  layout$traces <- NULL
  layout$xaxis$autorange <- NULL
  layout$yaxis$autorange <- NULL


  pp$x$layout <- layout
  # pp

  pp$x$data = data
  pp
  scree_plot_result = pp
  svg(filename="scree_plot.svg",
      width=5,
      height=4,
      pointsize=12)
  plot(1:10, main = "scree_plot.svg")
  dev.off()

  #orca(scree_plot_result, "scree_plot.svg") # make sure to match children text.




}





# library(plotly)
#
# df <- data.frame(a = c(1,2),
#                  b = c(3,4))
#
# ppp <- plot_ly(df,x =~a,y =~b,mode = 'scatter',type = 'scatter')
# htmlwidgets::saveWidget(config(ppp, displayModeBar = FALSE, collaborate = FALSE, showLink = F,displaylogo = F),'simplePlot.html', selfcontained = T)
#
# svgFromHtml("simplePlot.html")
#
# export_plotly2SVG(ppp, filename = "happyplot.svg")
#
#
# path1 <- system.file("extdata/alplots2_ff.html", package = "js2graphic")
# file.copy(path1, getwd())
# svgFromHtml("alplots2_ff.html")
















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



data = call_fun(parameter = list(project_id=project_id,activate_data_id=activate_data_id,fun_name="read_data_from_projects"))
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
  hc.col = hclust(dist(t(e_scale),method = dist_method),method = clust_method)
  dd.col <- as.dendrogram(hc.col)
  dy <- dendro_data(dd.col)
  py <- ggdend(dy$segments) + coord_flip()
  yy = ggplotly(py)
}else{
  hc.col = list()
  hc.col$order = 1:nrow(e)
}

if(order_compound=='dendrogram'){
  hc.row = hclust(dist(e_scale,method = dist_method),method = clust_method)
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


# sample_scores = pca$x[,1:min(15,ncol(pca$x))]
# sample_scores = data.table(sample_scores)
# rownames(sample_scores) = make.unique(p$label)
#
# fwrite(sample_scores, "sample_scores.csv", col.names = TRUE,row.names = TRUE)
# fwrite(compound_loadings, "compound_loadings.csv", col.names = TRUE,row.names = TRUE)

sample_order = data.table(sample_order = hc.row.order)
rownames(sample_order) = make.unique(p$label)
compound_order = data.table(compound_order = hc.col.order)
rownames(compound_order) = make.unique(f$label)

fwrite(sample_order, "sample_order.csv", col.names = TRUE,row.names = TRUE)
fwrite(compound_order, "compound_order.csv", col.names = TRUE,row.names = TRUE)




if(exists("heatmap_plot")){# this means this call is from quick_analysis. Here we are going to draw score plot and loading plot.

  # heatmap_plot_style = get_heatmap_plot_style("slfan") # !!! HERE WE NEED TO CHANGE 'SLFAN' TO NEW ID.
  heatmap_plot_style = call_fun(parameter = list(user_id="slfan",fun_name="get_heatmap_plot_style"))


  show_sample_label = heatmap_plot$show_sample_label
  show_compound_label = heatmap_plot$show_compound_label

  # here I need to re-generate the data according to user's new dataset.
  colorscale = heatmap_plot$colorscale
  sample_tree_height = as.numeric(heatmap_plot$sample_tree_height)
  sample_annotation_height = as.numeric(heatmap_plot$sample_annotation_height)
  compound_tree_height = as.numeric(heatmap_plot$compound_tree_height)
  compound_annotation_height = as.numeric(heatmap_plot$compound_annotation_height)



  order_sample_by = heatmap_plot$order_sample_by
  if("as is" %in% order_sample_by){
    sample_order = 1:length(p)
    show_sample_dendrogram = FALSE
  }else if("dendrogram" %in% order_sample_by){
    sample_order = hc.row.order
    show_sample_dendrogram = TRUE
  }else{
    temp_data = data.frame(p[,heatmap_plot$order_sample_by])

    sample_order = rep(0, nrow(temp_data))
    for(i in 1:ncol(temp_data)){
      if(colnames(temp_data)[i] %in% names(heatmap_plot$order_sample_levels)){
        levels_temp_data = levels(temp_data[[i]])
        new_levels = strsplit(heatmap_plot$order_sample_levels[which(names(heatmap_plot$order_sample_levels)%in%colnames(temp_data)[i])], "\\|\\|")[[1]]

        correct_levels = intersect(new_levels, levels_temp_data)
        correct_levels = c(correct_levels,levels_temp_data[!levels_temp_data%in%new_levels])
        levels(temp_data[[i]]) = correct_levels
      }
      sample_order = sample_order * 1000 + order(temp_data[[i]])
    }
    show_sample_dendrogram = FALSE
  }

  order_compound_by = heatmap_plot$order_compound_by
  if("as is" %in% order_compound_by){
    compound_order = 1:length(f)
    show_compound_dendrogram = FALSE
  }else if("dendrogram" %in% order_compound_by){
    compound_order = hc.col.order
    show_compound_dendrogram = TRUE
  }else{
    temp_data = data.frame(f[,heatmap_plot$order_compound_by])

    compound_order = rep(0, nrow(temp_data))
    for(i in 1:ncol(temp_data)){
      if(colnames(temp_data)[i] %in% names(heatmap_plot$order_compound_levels)){
        levels_temp_data = levels(temp_data[[i]])
        new_levels = strsplit(heatmap_plot$order_compound_levels[which(names(heatmap_plot$order_compound_levels)%in%colnames(temp_data)[i])], "\\|\\|")[[1]]

        correct_levels = intersect(new_levels, levels_temp_data)
        correct_levels = c(correct_levels,levels_temp_data[!levels_temp_data%in%new_levels])
        levels(temp_data[[i]]) = correct_levels
      }
      compound_order = compound_order * 1000 + order(temp_data[[i]])
    }
    show_compound_dendrogram = FALSE
  }

  dta = t(e_scale)
  heatmap_z = dta[compound_order,sample_order]
  sample_label = p$label
  compound_label = f$label

  heatmap_x = 1:nrow(p)-1
  heatmap_y = 1:nrow(f)-1

  heatmap_x_text = sample_label[sample_order]
  heatmap_y_text = compound_label[compound_order]
  tickvals = c(min(e_scale, na.rm = TRUE), median(e_scale, na.rm = TRUE), max(e_scale, na.rm = TRUE))


  sample_dendro_trace_x = xx$x$data[[1]]$x
  sample_dendro_trace_y = xx$x$data[[1]]$y
  compound_dendro_trace_x = yy$x$data[[1]]$x
  compound_dendro_trace_y = yy$x$data[[1]]$y




  used_sample_annotations = sapply(heatmap_plot$sample_annotations, function(x) x$column)
  sample_annotations = list()
  for(i in 1:length(heatmap_plot$sample_annotation)){
    # here we need to let new plot use old plot's colors if possible. This may involve the whole p and partial p for this data.
    # if(heatmap_plot$sample_annotation[i] %in% used_sample_annotations){
    #
    #   old_levels = levels(factor(p[[heatmap_plot$sample_annotation[i]]]))
    #
    #
    #
    # }

    if(!length(heatmap_plot$sample_annotation)==0){
      levels = levels(factor(p[[heatmap_plot$sample_annotation[i]]]))

      sample_annotations[[i]] = list(
        colors = as.list(heatmap_plot_style$traces$sample_annotation[[length(levels)]]),
        column = heatmap_plot$sample_annotation[i],
        type = "character"
      )
    }else{
      sample_annotations = list()
    }

  }
  sample_level_options = sapply(p, unique)






  used_compound_annotations = sapply(heatmap_plot$compound_annotations, function(x) x$column)
  compound_annotations = list()
  for(i in 1:length(heatmap_plot$compound_annotation)){
    # here we need to let new plot use old plot's colors if possible. This may involve the whole f and partial f for this data.
    # if(heatmap_plot$compound_annotation[i] %in% used_compound_annotations){
    #
    #   old_levels = levels(factor(f[[heatmap_plot$compound_annotation[i]]]))
    #
    #
    #
    # }
    if(!length(heatmap_plot$compound_annotation) ==0){
      levels = levels(factor(f[[heatmap_plot$compound_annotation[i]]]))
      compound_annotations[[i]] = list(
        colors = as.list(heatmap_plot_style$traces$compound_annotation[[length(levels)]]),
        column = heatmap_plot$compound_annotation[i],
        type = "character"
      )
    }else{
      compound_annotations = list()
    }

  }
  compound_level_options = sapply(f, unique)



  # heatmap_x
  # heatmap_y
  # heatmap_z



  layout = heatmap_plot$layout





#   xaxis_index = sapply(heatmap_plot$data, function(x) x$xaxis)
#
#   heatmap_trace = heatmap_plot$data[[which(xaxis_index %in% "x")]]
#   heatmap_trace$x = heatmap_x
#   heatmap_trace$y = heatmap_y
#   heatmap_trace$z = heatmap_z
#   heatmap_trace$tickvals = tickvals
#   heatmap_trace$colorscale = colorscale
#
#
#   if(show_sample_dendrogram){
#
#     sample_dendro_trace = heatmap_plot$data[[which(xaxis_index %in% "x2")]]
#     sample_dendro_trace$x =sample_dendro_trace_x
#     sample_dendro_trace$y =sample_dendro_trace_y
#
#   }
#
#   if(show_compound_dendrogram){
#
#     compound_dendro_trace = heatmap_plot$data[[which(xaxis_index %in% "x3")]]
#     compound_dendro_trace$x =compound_dendro_trace_x
#     compound_dendro_trace$y =compound_dendro_trace_y
#
#   }
#
#
#
#
#   sample_annotation_traces = list()
#   for(i in 1:length(heatmap_plot$sample_annotation)){
#     sample_annotation_traces[[i]] = list()
#
#     temp_z = p[[heatmap_plot$sample_annotation[[i]]]]
#
#     temp_color_scale = list()
#     temp_levels = sample_level_options[[heatmap_plot$sample_annotation[[i]]]]
#     for(j in 1:length(temp_levels)){
#
#       if(length(temp_levels)==1){
#         temp_color_scale[[j]] = c(0, sample_annotations[[i]]$colors[j])
#         temp_color_scale[[j+1]] = c(1, sample_annotations[[i]]$colors[j])
#       }else{
#         temp_color_scale[[j]] = c(j/(length(temp_levels)-1)-1, sample_annotations[[i]]$colors[j])
#       }
#
#     }
#
#     sample_annotation_traces[[i]]$x = heatmap_x
#     sample_annotation_traces[[i]]$z = as.numeric(factor(p[[heatmap_plot$sample_annotation[[i]]]]))[sample_order]-1
#     sample_annotation_traces[[i]]$colorscale =  temp_color_scale
#
#     sample_annotation_traces[[i]]$xaxis = paste0("x",i+3)
#     sample_annotation_traces[[i]]$yaxis = paste0("y",i+3)
#
#     sample_annotation_traces[[i]]$zmax = max(unlist(sample_annotation_traces[[i]]$z), na.rm = TRUE)
#
#
#
#
#     sample_annotation_traces[[i]]$y = 0
#     sample_annotation_traces[[i]]$type="heatmap"
#     sample_annotation_traces[[i]]$showscale = FALSE
#
#     sample_annotation_traces[[i]]$autocolorscale = FALSE
#
#     sample_annotation_traces[[i]]$showlegend = FALSE
#
#
#     sample_annotation_traces[[i]]$hoverinfo = "text"
#
#     sample_annotation_traces[[i]]$name = ""
#
#     sample_annotation_traces[[i]]$xgap = 1
#
#     sample_annotation_traces[[i]]$ygap = 1
#
#     sample_annotation_traces[[i]]$zmin = 0
#
#   }
#   layout$height = as.numeric(layout$height)
#
#   sample_tree_ratio = 1 - (sample_tree_height / layout$height)
#
#   height_of_sample_annotation = sample_annotation_height
#
#
#   mid_yrang_from  = (layout$height * sample_tree_ratio - rev(c(1:length(sample_annotations))) * height_of_sample_annotation)/layout$height
#
#
#
#   yrange_from = c(0, mid_yrang_from, sample_tree_ratio)
#   yrange_to = c(mid_yrang_from, sample_tree_ratio, 1)
#
#
#
#
#
#
#   compound_annotation_traces = list()
#   for(i in 1:length(heatmap_plot$compound_annotation)){
#     compound_annotation_traces[[i]] = list()
#
#     temp_z = f[[heatmap_plot$compound_annotation[[i]]]]
#
#     temp_color_scale = list()
#     temp_levels = compound_level_options[[heatmap_plot$compound_annotation[[i]]]]
#     for(j in 1:length(temp_levels)){
#
#       if(length(temp_levels)==1){
#         temp_color_scale[[j]] = c(0, compound_annotations[[i]]$colors[j])
#         temp_color_scale[[j+1]] = c(1, compound_annotations[[i]]$colors[j])
#       }else{
#         temp_color_scale[[j]] = c(j/(length(temp_levels)-1)-1, compound_annotations[[i]]$colors[j])
#       }
#
#     }
#
#     compound_annotation_traces[[i]]$x = 0
#     compound_annotation_traces[[i]]$y = heatmap_y
#     compound_annotation_traces[[i]]$z = as.numeric(factor(f[[heatmap_plot$compound_annotation[[i]]]]))[compound_order]-1
#     compound_annotation_traces[[i]]$colorscale =  temp_color_scale
#
#     compound_annotation_traces[[i]]$xaxis = paste0("x",length(heatmap_plot$sample_annotation)+3+i)
#     compound_annotation_traces[[i]]$yaxis = paste0("y",length(heatmap_plot$sample_annotation)+3+i)
#
#     compound_annotation_traces[[i]]$zmax = max(unlist(compound_annotation_traces[[i]]$z), na.rm = TRUE)
#
#
#
#     compound_annotation_traces[[i]]$type="heatmap"
#     compound_annotation_traces[[i]]$showscale = FALSE
#
#     compound_annotation_traces[[i]]$autocolorscale = FALSE
#
#     compound_annotation_traces[[i]]$showlegend = FALSE
#
#
#     compound_annotation_traces[[i]]$hoverinfo = "text"
#
#     compound_annotation_traces[[i]]$name = ""
#
#     compound_annotation_traces[[i]]$xgap = 1
#
#     compound_annotation_traces[[i]]$ygap = 1
#
#     compound_annotation_traces[[i]]$zmin = 0
#
#   }
#
#
#
#
#   layout$width = as.numeric(layout$width)
#   compound_tree_ratio = 1 - (compound_tree_height / layout$width)
#
#   height_of_compound_annotation = compound_annotation_height
#
#
#   mid_xrang_from  = (layout$width * compound_tree_ratio - rev(c(1:length(compound_annotations))) * height_of_compound_annotation)/layout$width
#
#
#
#   xrange_from = c(0, mid_xrang_from, compound_tree_ratio)
#   xrange_to = c(mid_xrang_from, compound_tree_ratio, 1)
#
#
#   layout$xaxis3$domain = c(xrange_from[length(xrange_from)], xrange_to[length(xrange_to)])
#   layout$xaxis3$range = as.numeric(  layout$xaxis3$range )
#
#   layout$yaxis3$domain = c(yrange_from[1],  yrange_to[1])
#   layout$yaxis3$range = c(0.25, max(heatmap_y)+1.5)
#
#
#
#   layout$xaxis2$domain = c(xrange_from[1], xrange_to[1])
#   layout$xaxis2$range = c(0.5, max(heatmap_x)+1.5)
#
#
#   layout$yaxis2$domain = c(yrange_from[length(yrange_from)], yrange_to[length(yrange_to)])
#
#
#   layout$xaxis$range = c(-0.5, max(heatmap_x)+0.5)
#   layout$xaxis$domain = c(xrange_from[1], xrange_to[1])
#   layout$xaxis$tickvals = heatmap_x
#   layout$xaxis$ticktext = heatmap_x_text
#   layout$xaxis$ticklen = ifelse(show_sample_label,5,0)
#   layout$xaxis$showticklabels = show_sample_label
#
#
#
#   layout$yaxis$range = unlist( layout$yaxis$range)
#   layout$yaxis$domain = c(yrange_from[1], yrange_to[1])
#   layout$yaxis$tickvals = heatmap_y
#   layout$yaxis$ticktext = heatmap_y_text
#   layout$yaxis$ticklen =  ifelse(show_compound_label,5,0)
#   layout$yaxis$showticklabels = show_compound_label
#
#
# for(i in 1:length(heatmap_plot$sample_annotation)){
#
#   # layout[[paste0("xaxis",i+3)]] = list(
#   #   autorange = FALSE,
#   #   range = c(-0.5, max(heatmap_x)+0.5),
#   #   type = "linear",
#   #   tickmode = "array",
#   #   domain = c(xrange_from[1], xrange_to[1]),
#   #   ticklen = 0,
#   #   showticklabels = FALSE,
#   #   showline = FALSE,
#   #   showgrid = FALSE,
#   #   zeroline = FALSE,
#   #   title = ""
#   # )
#
#   layout[[paste0("xaxis",i+3)]] = heatmap_plot$layout[[paste0("xaxis",i+3)]]
#
#   layout[[paste0("xaxis",i+3)]]$domain = c(xrange_from[1], xrange_to[1])
#   layout[[paste0("xaxis",i+3)]]$range = c(-0.5, max(heatmap_x)+0.5)
#
#
#   layout[[paste0("yaxis",i+3)]] = heatmap_plot$layout[[paste0("yaxis",i+3)]]
#   layout[[paste0("yaxis",i+3)]]$domain = c(yrange_from[i+1], yrange_to[i+1])
#   layout[[paste0("yaxis",i+3)]]$range = as.numeric(layout[[paste0("yaxis",i+3)]]$range)
#   layout[[paste0("yaxis",i+3)]]$ticktext = heatmap_plot$sample_annotation[i]
# }
#
#   for(i in 1:length(heatmap_plot$compound_annotation)){
#     layout[[paste0("xaxis",i+3+length(heatmap_plot$sample_annotation))]] = heatmap_plot$layout[[paste0("xaxis",i+3+length(heatmap_plot$sample_annotation))]]
#
#     layout[[paste0("xaxis",i+3+length(heatmap_plot$sample_annotation))]]$domain = c(xrange_from[i+1], xrange_to[i+1])
#     layout[[paste0("xaxis",i+3+length(heatmap_plot$sample_annotation))]]$range = as.numeric(layout[[paste0("xaxis",i+3+length(heatmap_plot$sample_annotation))]]$range)
#     layout[[paste0("xaxis",i+3+length(heatmap_plot$sample_annotation))]]$ticktext = heatmap_plot$compound_annotation[i]
#
#     layout[[paste0("yaxis",i+3+length(heatmap_plot$sample_annotation))]]$domain = c(yrange_from[1], yrange_to[1])
#     layout[[paste0("yaxis",i+3+length(heatmap_plot$sample_annotation))]]$range = as.numeric(layout[[paste0("yaxis",i+3+length(heatmap_plot$sample_annotation))]]$range)
#
#
#
#   }
#
#
#
# data = list(heatmap_trace)
# if(show_sample_dendrogram){
#   data = c(data, list(sample_dendro_trace))
# }
# if(show_compound_dendrogram){
#   data = c(data, list(compound_dendro_trace))
# }
#
# data = c(data, sample_annotation_traces, compound_annotation_traces)
#
#
#
#
#
#
#
#
#   pacman::p_load(ggplot2, plotly)
#
#
#   df <- data.frame()
#   g <- ggplot(df) + geom_point()
#   g <- ggplotly(g)
#   pp <- plotly_build(g)
#
#
#   # layout$traces <- NULL
#   layout$xaxis$autorange <- NULL
#   layout$yaxis$autorange <- NULL
#
#
#   pp$x$layout <- layout
#   # pp
#
#   pp$x$data = data
#   pp
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#   heatmap_plot_result = pp
#   # https://plot.ly/r/static-image-export/
#   # orca(heatmap_plot_result, "heatmap_plot.svg") # make sure to match children text.
#   svg(filename="heatmap_plot.svg",
#       width=5,
#       height=4,
#       pointsize=12)
#   plot(1:10)
#   dev.off()
#
#
#
#   full_data = scree_plot$full_data
#   full_layout = scree_plot$full_layout
#
#
#   data = scree_plot$data
#   layout = scree_plot$layout
#
#   df <- data.frame()
#   g <- ggplot(df) + geom_point()
#   g <- ggplotly(g)
#   pp <- plotly_build(g)
#
#
#   layout$traces <- NULL
#   layout$xaxis$autorange <- NULL
#   layout$yaxis$autorange <- NULL
#
#
#   pp$x$layout <- layout
#   # pp
#
#   pp$x$data = data
#   pp
#   scree_plot_result = pp
#   svg(filename="scree_plot.svg",
#       width=5,
#       height=4,
#       pointsize=12)
#   plot(1:10, main = "scree_plot.svg")
#   dev.off()
#
#   #orca(scree_plot_result, "scree_plot.svg") # make sure to match children text.


  result = jsonlite::toJSON(list("heatmap_plot.svg" = list(
    heatmap_x= heatmap_x, heatmap_y= heatmap_y, heatmap_z= heatmap_z, sample_label= sample_label, heatmap_x_text= heatmap_x_text, heatmap_y_text= heatmap_y_text, tickvals= tickvals,
    colorscale= colorscale,
    show_sample_dendrogram= show_sample_dendrogram, sample_dendro_trace_x= sample_dendro_trace_x,sample_dendro_trace_y= sample_dendro_trace_y,
    show_compound_dendrogram= show_compound_dendrogram, compound_dendro_trace_x= compound_dendro_trace_x,compound_dendro_trace_y= compound_dendro_trace_y,
    sample_annotations= sample_annotations,order_sample_by=order_sample_by,order_compound_by=order_compound_by,
    sample_level_options= sample_level_options, p= p, sample_order= sample_order,
    sample_tree_height= sample_tree_height, sample_annotation_height= sample_annotation_height, show_sample_label= show_sample_label,
    compound_annotations= compound_annotations,
    compound_level_options= compound_level_options, f= f, compound_order= compound_order,
    compound_tree_height= compound_tree_height, compound_annotation_height= compound_annotation_height, show_compound_label= show_compound_label,
    layout = layout, plot_id= ""
  )
  ), auto_unbox = TRUE, force = TRUE)





}else{
  result = list(results_description = "Here is the heatmap summary.",p = p, f = f, hc_col_order = hc.col.order-1, hc_row_order = hc.row.order-1,temp_data = t(e_scale),sx = xx$x$data[[1]]$x,sy = xx$x$data[[1]]$y,cx = yy$x$data[[1]]$x,cy = yy$x$data[[1]]$y,max = max(e_scale, na.rm = TRUE),median = median(e_scale, na.rm = TRUE),min = min(e_scale, na.rm = TRUE))




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
















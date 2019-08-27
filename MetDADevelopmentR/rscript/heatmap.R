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
pacman::p_load(data.table, ggdendro, ggplot2)

# pacman::p_load(,plotly)

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
  # yy = ggplotly(py)

  yy = list( x = list( data = list(
    list(
      y = c(t(matrix(c(dy$segments$x,dy$segments$xend,rep(NA,nrow(dy$segments))),nrow = nrow(dy$segments)))),
      x = c(t(matrix(c(dy$segments$y,dy$segments$yend,rep(NA,nrow(dy$segments))),nrow = nrow(dy$segments))))
      )
    )))

}else{
  hc.col = list()
  hc.col$order = 1:nrow(e)
}

if(order_compound=='dendrogram'){
  hc.row = hclust(dist(e_scale,method = dist_method),method = clust_method)
  dd.row <- as.dendrogram(hc.row)
  dx <- dendro_data(dd.row)
  px <- ggdend(dx$segments)
  # xx = ggplotly(px)

  xx = list( x = list( data = list(
    list(
      y = c(t(matrix(c(dx$segments$y,dx$segments$yend,rep(NA,nrow(dx$segments))),nrow = nrow(dx$segments)))),
      x = c(t(matrix(c(dx$segments$x,dx$segments$xend,rep(NA,nrow(dx$segments))),nrow = nrow(dx$segments))))
    )
  )))



}else{
  hc.row = list()
  hc.row$order = 1:ncol(e)
}


hc.col.order = hc.col$order
hc.row.order = hc.row$order


sample_order = data.table(sample_order = hc.row.order)
rownames(sample_order) = make.unique(p$label)
compound_order = data.table(compound_order = hc.col.order)
rownames(compound_order) = make.unique(f$label)

fwrite(sample_order, "sample_order.csv", col.names = TRUE,row.names = TRUE)
fwrite(compound_order, "compound_order.csv", col.names = TRUE,row.names = TRUE)



report_html = call_fun(parameter = list(
  scaling_method = scaling_method,
  dist_method = dist_method,
  clust_method = clust_method,
  type = "result_summary",
  fun_name = "report_heatmap"
))$text_html



if(exists("heatmap_plot")){# this means this call is from quick_analysis. Here we are going to draw score plot and loading plot.

  # heatmap_plot_style = get_heatmap_plot_style("slfan") # !!! HERE WE NEED TO CHANGE 'SLFAN' TO NEW ID.
  # heatmap_plot_style = call_fun(parameter = list(user_id="slfan",fun_name="get_heatmap_plot_style"))



  show_sample_label = heatmap_plot$show_sample_label
  show_compound_label = heatmap_plot$show_compound_label

  # here I need to re-generate the data according to user's new dataset.
  colorscale = heatmap_plot$colorscale
  cell_height = heatmap_plot$cell_height
  cell_width = heatmap_plot$cell_width
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



  layout = heatmap_plot$layout

  result = jsonlite::toJSON(list("heatmap_plot.svg" = list(
    heatmap_x= heatmap_x, heatmap_y= heatmap_y, heatmap_z= heatmap_z, sample_label= sample_label, heatmap_x_text= heatmap_x_text, heatmap_y_text= heatmap_y_text, tickvals= tickvals,
    colorscale= colorscale,cell_height=cell_height,cell_width=cell_width,
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
  result = list(results_description = report_html,p = p, f = f, hc_col_order = hc.col.order-1, hc_row_order = hc.row.order-1,temp_data = t(e_scale),sx = xx$x$data[[1]]$x,sy = xx$x$data[[1]]$y,cx = yy$x$data[[1]]$x,cy = yy$x$data[[1]]$y,max = max(e_scale, na.rm = TRUE),median = median(e_scale, na.rm = TRUE),min = min(e_scale, na.rm = TRUE))




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
















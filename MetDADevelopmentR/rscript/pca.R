# result = list(a = defination_of_missing_value)


# http://localhost:5656/ocpu/tmp/x08f655c87c/

pacman::p_load(data.table)

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

pca = prcomp(e_scale, center = FALSE)
variance = round(pca$sdev^2/sum(pca$sdev^2),4)


sample_scores = pca$x[,1:min(15,ncol(pca$x))]
sample_scores = data.table(sample_scores)
rownames(sample_scores) = make.unique(p$label)

compound_loadings = pca$rotation[,1:min(15,ncol(pca$rotation))]
compound_loadings = data.table(compound_loadings)
rownames(compound_loadings) = make.unique(f$label)

fwrite(sample_scores, "sample_scores.csv", col.names = TRUE,row.names = TRUE)
fwrite(compound_loadings, "compound_loadings.csv", col.names = TRUE,row.names = TRUE)





report_html = call_fun(parameter = list(
  scaling_method = scaling_method,
  variance = variance,
  type = "result_summary",
  fun_name = "report_pca"
))$text_html







if(exists("score_plot")){# this means this call is from quick_analysis. Here we are going to draw score plot and loading plot.



  # for(i in 1:length(data)){
  #   data[[i]]$x = unlist(data[[i]]$x)
  #   data[[i]]$y = unlist(data[[i]]$y)
  #   data[[i]]$text = unlist(data[[i]]$text)
  # }

  # score_plot_style = get_pca_score_plot_style("slfan") # !!! HERE WE NEED TO CHANGE 'SLFAN' TO NEW ID.


  # score_plot_style = call_fun(parameter = list(user_id = "slfan", fun_name = "get_pca_score_plot_style"))

  score_plot_style = score_plot$layout


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

  split_by = paste0(color_by,"SLFAN",shape_by,"SLFAN",size_by)
  split_by_revalue = paste0(color_by_revalue,"SLFAN",shape_by_revalue,"SLFAN",size_by_revalue)

  xs = by(x,split_by,function(x) x, simplify = FALSE)
  ys = by(y,split_by,function(x) x, simplify = FALSE)
  trace_keys = names(xs)
  names = trace_keys
  texts = by(p$label, split_by, function(x) x, simplify = FALSE)


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

      if(ellipse_trace_keys[i] == ""){
        ellipse_xs_ys[[ellipse_trace_keys[i]]] = unname(as.list(data.table(car::dataEllipse(x=ellipse_xs_from[[i]], y=ellipse_ys_from[[i]], levels=0.95, draw = F))))
      }else{

        ellipse_xs_ys[[ellipse_trace_keys[i]]] = unname(as.list(data.table(car::dataEllipse(x=ellipse_xs_from[[ellipse_trace_keys[i]]], y=ellipse_ys_from[[ellipse_trace_keys[i]]], levels=0.95, draw = F))))

      }


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


  if(identical(names,"SLFANSLFAN")){
    layout$showlegend = FALSE
  }





  score_plot_result = list(

    x= x, y= y, color_by= color_by, color_values= color_values, color_levels= color_levels,
    shape_by= shape_by, shape_values= shape_values, shape_levels= shape_levels,
    size_by= size_by, size_values= size_values, size_levels= size_levels,
    ellipse_group= ifelse(!is.null(score_plot$data[[length(score_plot$data)]]$fill),'color','no_ellipse'),
    labels= p$label,
    layout= layout,
    plot_id= ""

  )







  # loading_plot_style = call_fun(parameter = list(user_id = "slfan", fun_name = "get_pca_loading_plot_style"))
  loading_plot_style = loading_plot$layout


  x = compound_loadings$PC1
  y = compound_loadings$PC2

  # here I need to re-generate the data according to user's new dataset.
  if(!is.null(loading_plot$loading_plot_color_levels)){
    color_by = f[[loading_plot$loading_plot_color_levels]]
    color_levels = unique(color_by)
    color_values = unlist(loading_plot_style$traces$scatter_colors[[length(color_levels)]])
  }else{
    color_by = rep("", nrow(f))
    color_values = loading_plot$data[[1]]$marker$color
    color_levels = ""
  }
  temp_replace = color_values
  names(temp_replace) = color_levels
  color_by_revalue = plyr::revalue(color_by, temp_replace)


  if(!is.null(loading_plot$loading_plot_shape_levels)){
    shape_by = f[[loading_plot$loading_plot_shape_levels]]
    shape_levels = unique(shape_by)
    shape_values = unlist(loading_plot_style$traces$scatter_shapes[[length(shape_levels)]])
  }else{
    shape_by = rep("", nrow(f))
    shape_values = loading_plot$data[[1]]$marker$symbol
    shape_levels = ""
  }
  temp_replace = shape_values
  names(temp_replace) = shape_levels
  shape_by_revalue = plyr::revalue(shape_by, temp_replace)


  if(!is.null(loading_plot$loading_plot_size_levels)){
    size_by = f[[loading_plot$loading_plot_size_levels]]
    size_levels = unique(size_by)
    size_values = unlist(loading_plot_style$traces$scatter_sizes[[length(size_levels)]])
  }else{
    size_by = rep("", nrow(f))
    size_values = loading_plot$data[[1]]$marker$size
    size_levels = ""
  }
  temp_replace = size_values
  names(temp_replace) = size_levels
  size_by_revalue = plyr::revalue(size_by, temp_replace)

  split_by = paste0(color_by,"SLFAN",shape_by,"SLFAN",size_by)
  split_by_revalue = paste0(color_by_revalue,"SLFAN",shape_by_revalue,"SLFAN",size_by_revalue)

  xs = by(x,split_by,function(x) x, simplify = FALSE)
  ys = by(y,split_by,function(x) x, simplify = FALSE)
  trace_keys = names(xs)
  names = trace_keys
  texts = by(f$label, split_by, function(x) x, simplify = FALSE)


  # add ellipse
  if(!is.null(loading_plot$data[[length(loading_plot$data)]]$fill)){ # If true, this meas that the the last element of data has toself property, meaning the user has included ellipses..
    ellipse_split_by = rep("", nrow(f))
    # loading_plot_ellipse_group = "color"
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

      if(ellipse_trace_keys[i] == ""){
        ellipse_xs_ys[[ellipse_trace_keys[i]]] = unname(as.list(data.table(car::dataEllipse(x=ellipse_xs_from[[i]], y=ellipse_ys_from[[i]], levels=0.95, draw = F))))
      }else{

        ellipse_xs_ys[[ellipse_trace_keys[i]]] = unname(as.list(data.table(car::dataEllipse(x=ellipse_xs_from[[ellipse_trace_keys[i]]], y=ellipse_ys_from[[ellipse_trace_keys[i]]], levels=0.95, draw = F))))

      }


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



  layout = loading_plot$layout


  if(identical(names,"SLFANSLFAN")){
    layout$showlegend = FALSE
  }





  loading_plot_result = list(

    x= x, y= y, color_by= color_by, color_values= color_values, color_levels= color_levels,
    shape_by= shape_by, shape_values= shape_values, shape_levels= shape_levels,
    size_by= size_by, size_values= size_values, size_levels= size_levels,
    ellipse_group= ifelse(!is.null(loading_plot$data[[length(loading_plot$data)]]$fill),'color','no_ellipse'),
    labels= f$label,
    layout= layout,
    plot_id= ""

  )








  layout = scree_plot$layout


  ys = list(variance)
  texts = sapply(ys, function(x){
    paste0(signif(x*100,4),"%")
  }, simplify = F)

  hovertexts = sapply(texts, function(x){
    paste0("PC", 1:length(x), ": ", x)
  }, simplify = F)

  names = list("Variance Explained")
  add_line_trace = TRUE
  line_trace_index = 0
  scree_plot_layout = layout
  plot_id = ""
  scree_plot_result = list(
    ys= ys, texts= texts, hovertexts= hovertexts, names= names, add_line_trace= add_line_trace, line_trace_index= line_trace_index, scree_plot_layout= scree_plot_layout, plot_id= plot_id
  )


  result = jsonlite::toJSON(list("score_plot.svg" = score_plot_result, "scree_plot.svg" = scree_plot_result,"loading_plot.svg" = loading_plot_result
  ), auto_unbox = TRUE, force = TRUE)



}else{
  result = list(results_description = report_html,p = p, f = f, sample_scores = sample_scores, compound_loadings = compound_loadings, variance = variance[1:min(length(variance),10)])

}









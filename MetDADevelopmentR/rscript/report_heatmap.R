# report_heatmap = function(treatment_group,equal_variance_assumption,type,fdr,result,levels = NULL,alternative = "two.sided",doc = NULL, table_index = 1,figure_index = 1){

if (!exists("clust_method")) {
  clust_method <- NULL
}
if (!exists("dist_method")) {
  dist_method <- NULL
}
if (!exists("scaling_method")) {
  scaling_method <- NULL
}



if (!exists("doc")) {
  doc <- NULL
}
if (!exists("table_index")) {
  table_index <- 1
}
if (!exists("figure_index")) {
  figure_index <- 1
}
if (!exists("project_id")) {
  project_id <- ""
}
if (!exists("fold_id")) {
  fold_id <- NULL
}
text_html <- ""




# save(parameter, file = "report_heatmap.RData")

# load("report_heatmap.RData")
pacman::p_load(data.table, officer, magrittr)



if (type == "all") {
  projectUrl <- URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/metda_project/", project_id))
  projectList <- jsonlite::fromJSON(projectUrl, simplifyVector = F)

  id <- sapply(projectList$project_structure, function(x) x$id)
  parent <- sapply(projectList$project_structure, function(x) x$parent)

  data_ids <- id[parent == fold_id]


  # result <- fread(
  #   paste0(
  #     "http://metda.fiehnlab.ucdavis.edu/db/metda_project/",
  #     project_id,
  #     "/", data_ids[grepl("csv",data_ids)]
  #   )
  # )

  input_file_path <- sapply(call_fun(parameter = list(project_id = project_id, file_id = parameters$activate_data_id, fun_name = "get_fold_seq")), paste0, collapse = "->")
  output_file_path <- sapply(call_fun(parameter = list(project_id = project_id, file_id = data_ids, fun_name = "get_fold_seq")), paste0, collapse = "->")


  scaling_method <- parameters$scaling_method
  clust_method <- parameters$clust_method
  dist_method <- as.numeric(parameters$dist_method)


}



if (type %in% c("method_description", "all")) {
  if (is.null(doc)) {
    doc <- read_docx()
  }
  if (type %in% "all") {
    doc <- doc %>%
      body_add_par("Heatmap -- Dendrogram Summary: ", style = "heading 1")
  }

  doc <- doc %>%
    body_add_par("Heatmaps are an effective tool for displaying feature variation among groups of samples. The basic concept of a heatmap is to represent relationships among variables as a color image. Rows and columns typically are reordered according to the dendrograms so that variables and/or samples with similar profiles are closer to one another, making these profiles more visible. Each value in the data matrix is displayed as a color, making it possible to view the patterns graphically.", style = "Normal", pos = "after") %>%
    body_add_par("Heatmaps uses an agglomerative hierarchical clustering algorithm to order and display the data as a dendrogram. Two important factors to consider when constructing a heatmap are the type of distance measure and the agglomeration method used. For details on the various methods available see [https://bmcbioinformatics.biomedcentral.com/articles/10.1186/1471-2105-13-S16-S10].", style = "Normal", pos = "after")

  if (type %in% "method_description") {
    content <- docx_summary(doc)
    par_data <- subset(content, content_type %in% "paragraph")
    par_data <- par_data[, c("doc_index", "style_name", "text", "level", "num_id") ]
    par_data <- par_data[!is.na(par_data$style_name), ]

    text_html <- ""
    tags_begin <- revalue(par_data$style_name, c("heading 3", "Normal"), c("<h3>", "<p>"))
    tags_end <- revalue(par_data$style_name, c("heading 3", "Normal"), c("</h3>", "</p>"))
    for (i in 1:length(par_data$style_name)) {
      text_html <- paste0(text_html, tags_begin[i], par_data$text[i], tags_end[i])
    }
    text_html = strsplit(text_html,"<p>Figure")[[1]]
    text_html = unname(sapply(text_html, function(x){
      if(!is.na(as.numeric(substr(x,1,2)))){
        return(paste0("<p>Figure",x))
      }else{
        return(x)
      }
    }))
  }
}
if (type %in% c("parameter_settings_description", "all")) {
  if (is.null(doc)) {
    doc <- read_docx()
  }

  if (type == "all") {
    doc <- doc %>%
      body_add_par("Input Summary: ", style = "heading 3") %>%
      body_add_par("Input Dataset: ", style = "Normal") %>%
      slip_in_text(input_file_path, style = "Default Paragraph Font", pos = "after")


    doc <- doc %>%
      body_add_par("Output Datasets and Files: ", style = "Normal") %>%
      slip_in_text(output_file_path, style = "Default Paragraph Font", pos = "after")
  }



  if (!exists("clust_method")) {
    clust_method <- NULL
  }
  if (!exists("dist_method")) {
    dist_method <- NULL
  }
  if (!exists("scaling_method")) {
    scaling_method <- NULL
  }



  if(!exists("scaling_method_name")){
    scaling_method_name <- revalue(scaling_method, c("none","center","pareto","standard"),c("No Scaling","Mean Centering","Pareto",'Auto Scaling'))
  }



  doc <- doc %>%
    body_add_fpar(fpar(ftext(" - Scaling Method: ", prop = fp_text(bold = TRUE))), style = "Normal") %>%
    slip_in_text(scaling_method_name, style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(". Scaling methods are data pretreatment approaches that divide each variable by a factor, the scaling factor, which is different for each variable. They aim to adjust for the differences in fold differences between the different metabolites by converting the data into differences in concentration relative to the scaling factor. It is highly recommended for multivariate statistical analyses. More information is available at https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1534033/.", style = "Default Paragraph Font", pos = "after")



  doc <- doc %>%
    body_add_fpar(fpar(ftext(" - Agglomeration Method: ", prop = fp_text(bold = TRUE))), style = "Normal") %>%
    slip_in_text(clust_method, style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(". Agglomeration is the process by which clusters are merged into larger clusters.", style = "Default Paragraph Font", pos = "after")


  doc <- doc %>%
    body_add_fpar(fpar(ftext(" - Distance Function: ", prop = fp_text(bold = TRUE))), style = "Normal") %>%
    slip_in_text(dist_method, style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(". A distance metric is a non-negative number which measures the difference between two objects (e.g. samples/compounds.)", style = "Default Paragraph Font", pos = "after")


  if (type == "parameter_settings_description") {
    content <- docx_summary(doc)
    par_data <- subset(content, content_type %in% "paragraph")
    par_data <- par_data[, c("doc_index", "style_name", "text", "level", "num_id") ]
    par_data <- par_data[!is.na(par_data$style_name), ]

    text_html <- ""
    tags_begin <- revalue(par_data$style_name, c("heading 3", "Normal"), c("<h3>", "<p>"))
    tags_end <- revalue(par_data$style_name, c("heading 3", "Normal"), c("</h3>", "</p>"))
    for (i in 1:length(par_data$style_name)) {
      text_html <- paste0(text_html, tags_begin[i], par_data$text[i], tags_end[i])
    }
    text_html = strsplit(text_html,"<p>Figure")[[1]]
    text_html = unname(sapply(text_html, function(x){
      if(!is.na(as.numeric(substr(x,1,2)))){
        return(paste0("<p>Figure",x))
      }else{
        return(x)
      }
    }))
  }
}
if (type %in% c("result_summary", "all")) {
  if (is.null(doc)) {
    doc <- read_docx()
  }
  if(!exists("scaling_method_name")){
    scaling_method_name <- revalue(scaling_method, c("none","center","pareto","standard"),c("No Scaling","Mean Centering","Pareto",'Auto Scaling'))
  }

  doc <- doc %>%
    body_add_par("Result Summary: ", style = "heading 3") %>%
    body_add_par(paste0("The Heatmap and Dendrograms on the dataset with ",scaling_method_name,". See Figure",figure_index," for more details."), style = "Normal", pos = "after")





  if(type == "result_summary"){
    doc <- doc %>%
      body_add_par(paste0("Figure ", figure_index), style = "Normal", pos = "after") %>%
      body_add_par(paste0(" shows the heatmap and dendrogram analysis on the dataset with ",scaling_method_name,". The row displays compounds and the column represents the samples. The color represent the value scale for the corresponding compound and sample (see colorbar). "), style = "Normal", pos = "after") %>%
      body_add_par(paste0("The dendrogram on the right is conducted using distance metric ",dist_method, " with agglomeration method of ",clust_method," on the compounds while the top is on the samples. "), style = "Normal", pos = "after")

    doc <- doc%>%
      body_add_par(paste0("Please note, sample/compound annotation and ordering can be ajusted in the TRACES tab. "), style = "Normal", pos = "after")
  }else{


    doc <- doc %>%
      body_add_par(paste0("Figure ", figure_index), style = "Normal", pos = "after") %>%
      body_add_par(paste0(" shows the heatmap and dendrogram analysis on the dataset with ",scaling_method_name,". The row displays compounds and the column represents the samples. The color represent the value scale for the corresponding compound and sample (see colorbar)."), style = "Normal", pos = "after") %>%
      body_add_par(paste0("The dendrogram on the right is conducted using distance metric ",dist_method, " with agglomeration method of ",clust_method," on the compounds while the top is on the samples. "), style = "Normal", pos = "after") %>%
      body_add_par(paste0("The order of samples is determined by the ",paste0(parameters$heatmap_plot$order_sample_by,collapse = ", "),", and the compounds by the ",paste0(parameters$heatmap_plot$order_compound_by,collapse = ", "),". "), style = "Normal", pos = "after")

    if(length(parameters$heatmap_plot$sample_annotation)>0){
      doc <- doc %>%
        slip_in_text(paste0("The annotation of the samples (",paste0(parameters$heatmap_plot$sample_annotation, collapse = ", "), ") were added on top of the plot. "), style = "Default Paragraph Font", pos = "after")
    }else{
      doc <- doc %>%
        slip_in_text(paste0("No annotation of the samples were added to the plot. "), style = "Default Paragraph Font", pos = "after")
    }

    if(length(parameters$heatmap_plot$compound_annotation)>0){
      doc <- doc %>%
        slip_in_text(paste0("The annotation of the compounds (",paste0(parameters$heatmap_plot$compound_annotation, collapse = ", "), ") were added on the right of the plot. "), style = "Default Paragraph Font", pos = "after")
    }else{
      doc <- doc %>%
        slip_in_text(paste0("No annotation of the compounds were added to the plot. "), style = "Default Paragraph Font", pos = "after")
    }



  }



  if (type == "result_summary") {
    content <- docx_summary(doc)
    par_data <- subset(content, content_type %in% "paragraph")
    par_data <- par_data[, c("doc_index", "style_name", "text", "level", "num_id") ]
    par_data <- par_data[!is.na(par_data$style_name), ]

    text_html <- ""
    tags_begin <- revalue(par_data$style_name, c("heading 3", "Normal"), c("<h3>", "<p>"))
    tags_end <- revalue(par_data$style_name, c("heading 3", "Normal"), c("</h3>", "</p>"))
    for (i in 1:length(par_data$style_name)) {
      text_html <- paste0(text_html, tags_begin[i], par_data$text[i], tags_end[i])
    }

    text_html = strsplit(text_html,"<p>Figure")[[1]]
    text_html = unname(sapply(text_html, function(x){
      if(!is.na(as.numeric(substr(x,1,2)))){
        return(paste0("<p>Figure",x))
      }else{
        return(x)
      }
    }))


  }
}

# if this is all, put all the tables and figures here.
if (type == "all") {

  figures_paths = data_ids[grepl("svg",data_ids)]

  for(i in 1:length(figures_paths)){
    download.file(URLencode(paste0(
      "http://metda.fiehnlab.ucdavis.edu/db/metda_project/",
      project_id,
      "/", figures_paths[i]
    )), destfile = figures_paths[i])


    if(grepl("heatmap",figures_paths[i])){
      doc <- doc %>%
        body_add_img(src = figures_paths[i], width = as.numeric(parameters$heatmap_plot$layout$width)/100*0.8, height = as.numeric(parameters$heatmap_plot$layout$height)/100*0.8) %>%
        body_add_par(value = paste0("Figure ", figure_index+i-1,": the heatmap of the dataset with ",scaling_method_name,"."), style = "table title")
    }

  }










  doc %>% print(target = "report_heatmap.docx")
}


result <- list(text_html = text_html, method_name = "Heatmap -- Dendrogram", table_index = table_index + 1, figure_index = figure_index+2)


# }

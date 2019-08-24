# report_volcano = function(treatment_group,equal_variance_assumption,type,fdr,result,levels = NULL,alternative = "two.sided",doc = NULL, table_index = 1,figure_index = 1){



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




save(parameter, file = "report_volcano.RData")

# load("report_volcano.RData")
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


  # levels <- levels(factor(call_fun(parameter = list(project_id = project_id, activate_data_id = parameters$activate_data_id, fun_name = "read_data_from_projects"))$p[[treatment_group]]))
}



if (type %in% c("method_description", "all")) {
  if (is.null(doc)) {
    doc <- read_docx()
  }
  if (type %in% "all") {
    doc <- doc %>%
      body_add_par("Volcano Plot Summary: ", style = "heading 1")
  }

  doc <- doc %>%
    body_add_par("Volcano plots are sometimes used for visualization of statistical results of omics data such as differential expression of genes measured through microarrays. The interactive volcano plot has the power to show at a click of a mouse button which metabolites show a stronger combination of fold change and statistical significance. They represent significance from a statistical test (such as a p-value) on the y-axis and fold-change on the x-axis. They can also compare metabolite levels with different experimental conditions. As a consequence, metabolites in the volcano plot that have a relatively low fold-change between the two samples appear near the center and metabolites that have significant p-values are found in the upper-right or upper-left. [https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3629923/]", style = "Normal", pos = "after")

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



  if(type == "parameter_settings_description"){
    doc <- doc %>%
      body_add_fpar(fpar(ftext(" no parameter needed. Click Submit.", prop = fp_text(bold = TRUE))), style = "Normal")
  }else if(type=="all"){

    if(is.null(parameters$p_value_data_treatment)){
      doc <- doc %>%
        body_add_fpar(fpar(ftext(" - P-value Comparing: ", prop = fp_text(bold = TRUE))), style = "Normal")%>%
        slip_in_text(paste0(parameters$p_value_data_treatment,". "), style = "Default Paragraph Font", pos = "after")
    }
    if(is.null(parameters$fold_change_data_treatment)){
      doc <- doc %>%
        body_add_fpar(fpar(ftext(" - Fold Change Comparing: ", prop = fp_text(bold = TRUE))), style = "Normal")%>%
        slip_in_text(paste0(parameters$fold_change_data_treatment,". "), style = "Default Paragraph Font", pos = "after")
    }




    doc <- doc %>%
      body_add_fpar(fpar(ftext(" - P-value Cut-off: ", prop = fp_text(bold = TRUE))), style = "Normal")%>%
      slip_in_text(paste0(parameters$volcano_plot$p_value_cut_off,". "), style = "Default Paragraph Font", pos = "after")

    doc <- doc %>%
      body_add_fpar(fpar(ftext(" - Fold Change Cut-off: ", prop = fp_text(bold = TRUE))), style = "Normal")%>%
      slip_in_text(paste0(parameters$volcano_plot$fold_change_cut_off," (Fold change greater than ",parameters$volcano_plot$fold_change_cut_off," is considered to be large increase, whereas fold change less than 1/",parameters$volcano_plot$fold_change_cut_off,"=",signif(1/as.numeric(parameters$volcano_plot$fold_change_cut_off),2)," is considered to be large decrease)."), style = "Default Paragraph Font", pos = "after")

  }





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

  doc <- doc %>%
    body_add_par("Result Summary: ", style = "heading 3") %>%
    body_add_par(paste0("Volcano plot shows the relationship between the p-values and the fold changes. See Figure ",figure_index), style = "Normal", pos = "after")

  if(type == "all"){
    categories <-parameters$volcano_plot$data$x

    doc <- doc %>%
      body_add_par("Figure ", style = "Normal") %>%
      slip_in_text(figure_index, style = "Default Paragraph Font", pos = "after") %>%
      slip_in_text(" is the volcano plot. There are ", style = "Default Paragraph Font", pos = "after") %>%
      slip_in_text(length(categories[[1]]), style = "Default Paragraph Font", pos = "after") %>%
      slip_in_text(" compounds significantly increased more than the fold change cut-off, while ", style = "Default Paragraph Font", pos = "after") %>%
      slip_in_text(length(categories[[2]]), style = "Default Paragraph Font", pos = "after") %>%
      slip_in_text(" compounds significantly decreased more than the fold change cut-off.", style = "Default Paragraph Font", pos = "after") %>%
      slip_in_text(" The y axis is the -log10 p-values. The higher the more significant. The x axis is the log2 Fold Change. The further from the origin the larger the fold change.", style = "Default Paragraph Font", pos = "after")




  }



if(type == "result_summary"){
  doc <- doc %>%
    body_add_par(paste0("Figure ", figure_index), style = "Normal", pos = "after") %>%
    body_add_par(paste0(" Visualize the p-values and fold changes for each compound. The x-axis shows the log2 scale fold change. The further from the origin the larger the fold change. The y-axis is the -log10 p-values. The higher the more significant. Only p-values less than the criterion and fold change greater than the criterion, the dots are colored. See TRACES for more options."), style = "Normal", pos = "after")
}else if(type == "all"){
  doc <- doc %>%
    body_add_par(paste0("Figure ", figure_index), style = "Normal", pos = "after") %>%
    body_add_par(paste0(" Visualize the p-values and fold changes for each compound. The x-axis shows the log2 scale fold change. The further from the origin the larger the fold change. The y-axis is the -log10 p-values. The higher the more significant. Only p-values less than the criterion and fold change greater than the criterion, the dots are colored. See TRACES for more options."), style = "Normal", pos = "after")
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


    if(grepl("volcano",figures_paths[i])){
      doc <- doc %>%
        body_add_img(src = figures_paths[i], width = as.numeric(parameters$volcano_plot$layout$width)/100*0.8, height = as.numeric(parameters$volcano_plot$layout$height)/100*0.8) %>%
        body_add_par(value = paste0("Figure ", figure_index+i-1,": volcano plot."))
    }

  }



  doc %>% print(target = "report_volcano.docx")
}


result <- list(text_html = text_html, method_name = "Volcano Plot", table_index = table_index + 1, figure_index = figure_index+2)


# }

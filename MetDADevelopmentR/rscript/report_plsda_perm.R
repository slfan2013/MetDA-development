# report_plsda_perm = function(treatment_group,equal_variance_assumption,type,fdr,result,levels = NULL,alternative = "two.sided",doc = NULL, table_index = 1,figure_index = 1){

if (!exists("n_perm")) {
  n_perm <- NULL
}
if (!exists("best_predI")) {
  best_predI <- NULL
}

if (!exists("perm_summary")) {
  perm_summary <- NULL
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




save(parameter, file = "report_plsda_perm.RData")

# load("report_plsda_perm.RData")
pacman::p_load(data.table, officer, magrittr)



if (type == "all") {
  projectUrl <- URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/metda_project/", project_id))
  projectList <- jsonlite::fromJSON(projectUrl, simplifyVector = F)

  id <- sapply(projectList$project_structure, function(x) x$id)
  icon <- sapply(projectList$project_structure, function(x) x$icon)

  data_ids <- id[parent == fold_id & (!icon=="fa fa-folder")]

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


  # levels <- levels(factor(call_fun(parameter = list(project_id = project_id, activate_data_id = parameters$activate_data_id, fun_name = "read_data_from_projects"))$p[[treatment_group]]))
}



if (type %in% c("method_description", "all")) {
  if (is.null(doc)) {
    doc <- read_docx()
  }
  if (type %in% "all") {
    doc <- doc %>%
      body_add_par("Partial Least Square - Discriminant Analysis (PLSDA) Summary: ", style = "heading 1")
  }

  doc <- doc %>%
    body_add_par("PLS-DA is a chemometrics technique used to optimise separation between different groups of samples, which is accomplished by linking two data matrices X (i.e., raw data) and Y (i.e., groups, class membership etc.). The method is in fact an extension of PLS1 which handles single dependent continues variable whereas PLS2 (called PLS-DA) can handle multiple dependent categorical variables. This approach aims to maximize the covariance between the independent variables X (sample readings; that is to say the metabolomics data) and the corresponding dependent variable Y (classes, groups; that is to say the targets that one wants to predict) of highly multidimensional data by finding a linear subspace of the explanatory variables. This new subspace permits the prediction of the Y variable based on a reduced number of factors (PLS components, or what are also known as latent variables). These factors describe the behavior of dependent variables Y and they span the subspace onto which the independent variables X are projected. ", style = "Normal", pos = "after") %>%
    body_add_par("The main advantage of this PLS-DA approach is the availability and handling of highly collinear and noisy data, which are very common outputs from metabolomics experiments. In addition, this provides several statistics such as loading weight, variable importance on projection (VIP) and regression coefficient that can be used to identify the most important variables. This technique provides a visual interpretation of complex datasets through a low-dimensional, easily interpretable scores plot that illustrates the separation between different groups. Comparison of loadings and scores plot supports investigations in terms of the relationship between important variables that can be specific to the group of interest.", style = "Normal", pos = "after")


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


  if(!exists("scaling_method_name")){
    scaling_method_name <- revalue(scaling_method, c("none","center","pareto","standard"),c("No Scaling","Mean Centering","Pareto",'Auto Scaling'))
  }


  doc <- doc %>%
    body_add_fpar(fpar(ftext(" - Treatment Group: ", prop = fp_text(bold = TRUE))), style = "Normal")%>%
    slip_in_text(treatment_group, style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(paste0(". The PLS-DA model will be performed to find a linear transformation on the compounds to discriminant the ",treatment_group," group."), style = "Default Paragraph Font", pos = "after")


  doc <- doc %>%
    body_add_fpar(fpar(ftext(" - Scaling Method: ", prop = fp_text(bold = TRUE))), style = "Normal") %>%
    slip_in_text(scaling_method_name, style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(". Scaling methods are data pretreatment approaches that divide each variable by a factor, the scaling factor, which is different for each variable. They aim to adjust for the differences in fold differences between the different metabolites by converting the data into differences in concentration relative to the scaling factor. It is highly recommended for multivariate statistical analyses. More information is available at https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1534033/.", style = "Default Paragraph Font", pos = "after")





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
    body_add_par(paste0("Figure ", figure_index), style = "Normal", pos = "after") %>%
    body_add_par(paste0("Permutation test plot. A permutation test can evaluate whether the PLS-DA classification in the designed groups is significantly better than any other random classification in arbitrary groups. "), style = "Normal", pos = "after") %>%
    body_add_par(paste0("In our case, ",n_perm," permutations was performed on ",best_predI," components (which achieved the highest Q2 score). The p-value of the R2Y is ",min(perm_summary$pR2Y,1),", while the Q2 (cum) is ",min(perm_summary$pQ2,1),". At least one of the p-values of R2Y and Q2 (cum) less than 0.05 indicates a valid model. Otherwise, it is hard to justify whether the designed dataset is different from a random arbitrarty dataset."), style = "Normal", pos = "after")



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


    if(grepl("score",figures_paths[i])){
      doc <- doc %>%
        body_add_img(src = figures_paths[i], width = as.numeric(parameters$score_plot$layout$width)/100*0.8, height = as.numeric(parameters$score_plot$layout$height)/100*0.8) %>%
        body_add_par(value = paste0("Figure ", figure_index+i-1,": plsda Scores Plot."), style = "table title")
    }else if(grepl("loading",figures_paths[i])){
      doc <- doc %>%
        body_add_img(src = figures_paths[i], width = as.numeric(parameters$loading_plot$layout$width)/100*0.8, height = as.numeric(parameters$loading_plot$layout$height)/100*0.8) %>%
        body_add_par(value = paste0("Figure ", figure_index+i-1,": plsda Loadings Plot."), style = "table title")
    }else{
      doc <- doc %>%
        body_add_img(src = figures_paths[i], width = as.numeric(parameters$scree_plot$layout$width)/100*0.8, height = as.numeric(parameters$score_plot$layout$height)/100*0.8) %>%
        body_add_par(value = paste0("Figure ", figure_index+i-1,": plsda Scree Plot."), style = "table title")
    }

  }










  doc %>% print(target = "report_plsda_perm.docx")
}


result <- list(text_html = text_html, method_name = "Partial Least Square - Discriminant Analysis (PLS-DA)", table_index = table_index, figure_index = figure_index+1)


# }

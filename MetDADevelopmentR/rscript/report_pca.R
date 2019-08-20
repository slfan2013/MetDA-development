# report_pca = function(treatment_group,equal_variance_assumption,type,fdr,result,levels = NULL,alternative = "two.sided",doc = NULL, table_index = 1,figure_index = 1){

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




save(parameter, file = "report_pca.RData")

# load("report_pca.RData")
pacman::p_load(data.table, officer, magrittr)



if (type == "all") {
  projectUrl <- URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/metda_project/", project_id))
  projectList <- jsonlite::fromJSON(projectUrl, simplifyVector = F)

  id <- sapply(projectList$project_structure, function(x) x$id)
  parent <- sapply(projectList$project_structure, function(x) x$parent)

  data_ids <- id[parent == fold_id]


  result <- fread(
    paste0(
      "http://metda.fiehnlab.ucdavis.edu/db/metda_project/",
      project_id,
      "/", data_ids[grepl("csv",data_ids)]
    )
  )

  input_file_path <- sapply(call_fun(parameter = list(project_id = project_id, file_id = parameters$activate_data_id, fun_name = "get_fold_seq")), paste0, collapse = "->")
  output_file_path <- sapply(call_fun(parameter = list(project_id = project_id, file_id = data_ids, fun_name = "get_fold_seq")), paste0, collapse = "->")


  test_type <- parameters$test_type
  treatment_group <- parameters$treatment_group
  n <- as.numeric(parameters$n)
  power <- as.numeric(parameters$power)

  fdr_check <- parameters$fdr_check
  fdr_criterion <- as.numeric(parameters$fdr_criterion)

  if(power>1){
    power = power/100
  }
  sig_level <- as.numeric(parameters$sig_level)
  # levels <- levels(factor(call_fun(parameter = list(project_id = project_id, activate_data_id = parameters$activate_data_id, fun_name = "read_data_from_projects"))$p[[treatment_group]]))
}



if (type %in% c("method_description", "all")) {
  if (is.null(doc)) {
    doc <- read_docx()
  }
  if (type %in% "all") {
    doc <- doc %>%
      body_add_par("Principal Component Analysis (PCA) Summary: ", style = "heading 1")
  }

  doc <- doc %>%
    body_add_par("The high-dimensional and wide data tables that are encountered in metabolomics can be difficult to analyse, but the metabolomics community is now routinely applying many techniques to interrogate these large data sets and increase our understanding of the changes in metabolism. The use of data reduction or dimension reduction methods to reduce the size of the data table (while minimizing information loss) before further statistical analysis takes place is extremely important in this respect. The previous step discussed a popular dimension reduction method, namely principal component analysis (PCA). [https://www.futurelearn.com/courses/metabolomics/0/steps/25039]", style = "Normal", pos = "after") %>%
    body_add_par("PCA is an example of a so-called unsupervised technique. This means that the method does not use class label information (i.e. to which group does each sample in the data table belong). This has important consequences for dimension reduction. Dimension reduction is achieved by a rotation of the data followed by mathematical projection to a lower dimension resulting in a small data table. PCA rotates (i.e. linearly transforms) the variables (i.e. compound values) such that the largest differences between the samples are highlighted. This is very useful for explorative analysis of the data, for example, to detect outliers.", style = "Normal", pos = "after")


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
  if(!exists("scaling_method_name")){
    scaling_method_name <- revalue(scaling_method, c("none","center","pareto","standard"),c("No Scaling","Mean Centering","Pareto",'Auto Scaling'))
  }
  doc <- doc %>%
    body_add_par("Result Summary: ", style = "heading 3") %>%
    body_add_par(paste0("The dataset was first scaled using ",scaling_method_name,". Then the Principal Component Analysis (PCA) was performed on the scaled dataset."), style = "Normal", pos = "after")

  doc <- doc %>%
    body_add_par(paste0("Figure ", figure_index), style = "Normal", pos = "after") %>%
    body_add_par(paste0("Scores plot. It summarizes the linear relationship/similarity between the samples. Samples colors/shapes/sizes with 95% confidence intervals can be added afterwards to visualize the sample clusters. The confidence interval can also be used for outlier detection."), style = "Normal", pos = "after")

  doc <- doc %>%
    body_add_par(paste0("Figure ", figure_index+1), style = "Normal", pos = "after") %>%
    body_add_par(paste0("Loadings plot. It summarizes the linear relationship/similarity between the compounds. Compounds colors/shapes/sizes with 95% confidence intervals can be added afterwards to visualize the compound clusters. Together with the scores plot (Figure ",figure_index,"), loadings plot can help to understand the relationship between the compounds and samples. For example, the compounds with loadings in the first quadrant in the loadings plot is positively correlated with the samples with scores in the first quadrant in the scores plot. The further the loadings from the origin, the higher the correlation. On the other hand, the compounds with loadings in the third quadrant are negatively correlated with samples in the first quadrant in the score plot."), style = "Normal", pos = "after")

  doc <- doc %>%
    body_add_par(paste0("Figure ", figure_index+2), style = "Normal", pos = "after") %>%
    body_add_par(paste0("Screes plot. It visualizes the percentage of variance explained by each of the principal components. Variance can be deemed as 'information' in the dataset. The first two principal components summarize a total of ",signif(sum(variance[1:2])/sum(variance),4)*100,"% variation in the dataset."), style = "Normal", pos = "after")



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
  doc <- doc %>%
    body_add_table(value = result[1:10, ], style = "table_template") %>%
    body_add_par(value = paste0("Table ", table_index, ": First 10 compounds and their estimated statistial powers of having ",n," samples and required sample size for ",power*100,"% power."), style = "table title")



  figures_paths = data_ids[grepl("svg",data_ids)]

  for(i in 1:length(figures_paths)){
    download.file(URLencode(paste0(
      "http://metda.fiehnlab.ucdavis.edu/db/metda_project/",
      project_id,
      "/", figures_paths[i]
    )), destfile = figures_paths[i])


    if(grepl("power",figures_paths[i])){
      doc <- doc %>%
        body_add_img(src = figures_paths[i], width = as.numeric(parameters$power_plot$layout$width)/100*0.8, height = as.numeric(parameters$power_plot$layout$height)/100*0.8) %>%
        body_add_par(value = paste0("Figure ", figure_index+i-1,": the proportion of compounds having x% statistical power when having ",n," samples."), style = "table title")
    }else{
      doc <- doc %>%
        body_add_img(src = figures_paths[i], width = as.numeric(parameters$power_plot$layout$width)/100*0.8, height = as.numeric(parameters$power_plot$layout$height)/100*0.8) %>%
        body_add_par(value = paste0("Figure ", figure_index+i-1,": the proportion of compounds needing x samples to achieve a ",power*100,"% statistical power."), style = "table title")
    }

  }










  doc %>% print(target = "report_pca.docx")
}


result <- list(text_html = text_html, method_name = "Principal Component Analysis (PCA)", table_index = table_index + 1, figure_index = figure_index+2)


# }

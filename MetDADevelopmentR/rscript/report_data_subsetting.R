# report_data_subsetting = function(treatment_group,equal_variance_assumption,type,fdr,result,levels = NULL,alternative = "two.sided",doc = NULL, table_index = 1,figure_index = 1){


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
if(!exists("report_generator")){report_generator = FALSE}
text_html <- ""




save(parameter, file = "report_data_subsetting.RData")

# load("report_data_subsetting.RData")
pacman::p_load(data.table, officer, magrittr)



if (type == "all") {
  projectUrl <- URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/metda_project/", project_id))
  projectList <- jsonlite::fromJSON(projectUrl, simplifyVector = F)

  id <- sapply(projectList$project_structure, function(x) x$id)
  parent <- sapply(projectList$project_structure, function(x) x$parent)
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


  parameter_names <- names(parameters)


  for (i in 1:length(parameters)) {
    assign(parameter_names[i], parameters[[parameter_names[i]]])
  }
}



if (type %in% c("method_description", "all")) {
  if (is.null(doc)) {
    doc <- read_docx()
  }
  if (type %in% "all") {
    doc <- doc %>%
      body_add_par("Data Subsetting: ", style = "heading 1")
  }

  doc <- doc %>%
    body_add_par("This module can subset a dataset based on sample information and/or compound information. For example, you could subset dataset with Gender == 'Female' only. Or you could subset compounds with p-value less than 0.05 and get the dataset with significant compounds only. ", style = "Normal", pos = "after")

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




  doc <- doc %>%
    body_add_fpar(fpar(ftext(" - Subset Data By Samples: ", prop = fp_text(bold = TRUE))), style = "Normal") %>%
    slip_in_text(subset_by_sample, style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(". ", style = "Default Paragraph Font", pos = "after")

  if(subset_by_sample){

    doc <- doc %>%
      body_add_par("Samples having all of the following criterions will be subset. ", style = "Normal")

    sample_i = 1
    while(paste0(exists(paste0("sample_criterion_data_id__",sample_i)))){
      sample_i = sample_i + 1
    }
    sample_i = sample_i-1

    for(i in 1:sample_i){
      current_type = eval(parse(text=paste0("sample_criterion_type__",i)))
      # call_fun(parameter = list(project_id = project_id, file_id = parameters$activate_data_id, fun_name = "get_fold_seq"))
      if(current_type == "character"){
        doc <- doc %>%
          body_add_par(paste0(i, ". Sample Info Data: ",call_fun(parameter = list(project_id = project_id, file_id = eval(parse(text=paste0("sample_criterion_data_id__",i))), fun_name = "get_fold_seq")), ". Column: ",eval(parse(text=paste0("sample_criterion_column__",i))),". Type: ", current_type,". Levels: ",paste0(eval(parse(text=paste0("sample_criterion_level__",i))),collapse = ", "),'. '), style = "Normal")
      }else{
        doc <- doc %>%
          body_add_par(paste0(i, ". Sample Info Data: ",call_fun(parameter = list(project_id = project_id, file_id = eval(parse(text=paste0("sample_criterion_data_id__",i))), fun_name = "get_fold_seq")), ". Column: ",eval(parse(text=paste0("sample_criterion_column__",i))),". Type: ", current_type,". Range: ",eval(parse(text=paste0("sample_criterion_level_min__",i)))," to ",eval(parse(text=paste0("sample_criterion_level_max__",i))),'. '), style = "Normal")
      }

    }


  }

  doc <- doc %>%
    body_add_fpar(fpar(ftext(" - Subset Data By Compounds: ", prop = fp_text(bold = TRUE))), style = "Normal") %>%
    slip_in_text(subset_by_compound, style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(". ", style = "Default Paragraph Font", pos = "after")


  if(subset_by_compound){

    doc <- doc %>%
      body_add_par("Compounds having all of the following criterions will be subset. ", style = "Normal")

    compound_i = 1
    while(paste0(exists(paste0("compound_criterion_data_id__",compound_i)))){
      compound_i = compound_i + 1
    }
    compound_i = compound_i-1

    for(i in 1:compound_i){
      current_type = eval(parse(text=paste0("compound_criterion_type__",i)))
      if(current_type == "character"){
        doc <- doc %>%
          body_add_par(paste0(i, ". Compound Info Data: ",call_fun(parameter = list(project_id = project_id, file_id = eval(parse(text=paste0("compound_criterion_data_id__",i))), fun_name = "get_fold_seq")), ". Column: ",eval(parse(text=paste0("compound_criterion_column__",i))),". Type: ", current_type,". Levels: ",paste0(eval(parse(text=paste0("compound_criterion_level__",i))),collapse = ", "),'. '), style = "Normal")
      }else{
        doc <- doc %>%
          body_add_par(paste0(i, ". Compound Info Data: ",call_fun(parameter = list(project_id = project_id, file_id = eval(parse(text=paste0("compound_criterion_data_id__",i))), fun_name = "get_fold_seq")), ". Column: ",eval(parse(text=paste0("compound_criterion_column__",i))),". Type: ", current_type,". Range: ",eval(parse(text=paste0("compound_criterion_level_min__",i)))," to ",eval(parse(text=paste0("compound_criterion_level_max__",i))),'. '), style = "Normal")
      }

    }


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
    body_add_par(paste0("Data was subset according to the sample and compound criterion. "), style = "Normal", pos = "after")



  doc <- doc %>%
    body_add_fpar(fpar(ftext(" - Subset Data By Samples: ", prop = fp_text(bold = TRUE))), style = "Normal") %>%
    slip_in_text(subset_by_sample, style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(". ", style = "Default Paragraph Font", pos = "after")

  if(subset_by_sample){

    doc <- doc %>%
      body_add_par("Samples having all of the following criterions are subset. ", style = "Normal")

    sample_i = 1
    while(paste0(exists(paste0("sample_criterion_data_id__",sample_i)))){
      sample_i = sample_i + 1
    }
    sample_i = sample_i-1

    for(i in 1:sample_i){
      current_type = eval(parse(text=paste0("sample_criterion_type__",i)))
      # call_fun(parameter = list(project_id = project_id, file_id = parameters$activate_data_id, fun_name = "get_fold_seq"))
      if(current_type == "character"){
        doc <- doc %>%
          body_add_par(paste0(i, ". Sample Info Data: ",call_fun(parameter = list(project_id = project_id, file_id = eval(parse(text=paste0("sample_criterion_data_id__",i))), fun_name = "get_fold_seq")), ". Column: ",eval(parse(text=paste0("sample_criterion_column__",i))),". Type: ", current_type,". Levels: ",paste0(eval(parse(text=paste0("sample_criterion_level__",i))),collapse = ", "),'. '), style = "Normal")
      }else{
        doc <- doc %>%
          body_add_par(paste0(i, ". Sample Info Data: ",call_fun(parameter = list(project_id = project_id, file_id = eval(parse(text=paste0("sample_criterion_data_id__",i))), fun_name = "get_fold_seq")), ". Column: ",eval(parse(text=paste0("sample_criterion_column__",i))),". Type: ", current_type,". Range: ",eval(parse(text=paste0("sample_criterion_level_min__",i)))," to ",eval(parse(text=paste0("sample_criterion_level_max__",i))),'. '), style = "Normal")
      }

    }


  }

  doc <- doc %>%
    body_add_fpar(fpar(ftext(" - Subset Data By Compounds: ", prop = fp_text(bold = TRUE))), style = "Normal") %>%
    slip_in_text(subset_by_compound, style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(". ", style = "Default Paragraph Font", pos = "after")


  if(subset_by_compound){

    doc <- doc %>%
      body_add_par("Compounds having all of the following criterions are subset. ", style = "Normal")

    compound_i = 1
    while(paste0(exists(paste0("compound_criterion_data_id__",compound_i)))){
      compound_i = compound_i + 1
    }
    compound_i = compound_i-1

    for(i in 1:compound_i){
      current_type = eval(parse(text=paste0("compound_criterion_type__",i)))
      if(current_type == "character"){
        doc <- doc %>%
          body_add_par(paste0(i, ". Compound Info Data: ",call_fun(parameter = list(project_id = project_id, file_id = eval(parse(text=paste0("compound_criterion_data_id__",i))), fun_name = "get_fold_seq")), ". Column: ",eval(parse(text=paste0("compound_criterion_column__",i))),". Type: ", current_type,". Levels: ",paste0(eval(parse(text=paste0("compound_criterion_level__",i))),collapse = ", "),'. '), style = "Normal")
      }else{
        doc <- doc %>%
          body_add_par(paste0(i, ". Compound Info Data: ",call_fun(parameter = list(project_id = project_id, file_id = eval(parse(text=paste0("compound_criterion_data_id__",i))), fun_name = "get_fold_seq")), ". Column: ",eval(parse(text=paste0("compound_criterion_column__",i))),". Type: ", current_type,". Range: ",eval(parse(text=paste0("compound_criterion_level_min__",i)))," to ",eval(parse(text=paste0("compound_criterion_level_max__",i))),'. '), style = "Normal")
      }

    }


  }


  doc <- doc %>%
    body_add_par(paste0("As a result, the subset data contains ",num_sample_left," samples and ",num_compound_left," compounds."), style = "Normal", pos = "after")




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
  # doc <- doc %>%
  #   body_add_table(value = result[1:10, ], style = "table_template") %>%
  #   body_add_par(value = paste0("Table ", table_index, ": First 10 compounds and their estimated statistial powers of having ",n," samples and required sample size for ",power*100,"% power."), style = "table title")



  # figures_paths = data_ids[grepl("svg",data_ids)]

  # for(i in 1:length(figures_paths)){
  #   download.file(URLencode(paste0(
  #     "http://metda.fiehnlab.ucdavis.edu/db/metda_project/",
  #     project_id,
  #     "/", figures_paths[i]
  #   )), destfile = figures_paths[i])
  #
  #
  #   if(grepl("power",figures_paths[i])){
  #     doc <- doc %>%
  #       body_add_img(src = figures_paths[i], width = as.numeric(parameters$power_plot$layout$width)/100*0.8, height = as.numeric(parameters$power_plot$layout$height)/100*0.8) %>%
  #       body_add_par(value = paste0("Figure ", figure_index+i-1,": the proportion of compounds having x% statistical power when having ",n," samples."), style = "table title")
  #   }else{
  #     doc <- doc %>%
  #       body_add_img(src = figures_paths[i], width = as.numeric(parameters$power_plot$layout$width)/100*0.8, height = as.numeric(parameters$power_plot$layout$height)/100*0.8) %>%
  #       body_add_par(value = paste0("Figure ", figure_index+i-1,": the proportion of compounds needing x samples to achieve a ",power*100,"% statistical power."), style = "table title")
  #   }
  #
  # }







  if(!report_generator){
    doc %>% print(target = "report_data_subsetting.docx")
  }



}

if(!report_generator){


  result <- list(text_html = text_html, method_name = "Data Subsetting", table_index = table_index + 1, figure_index = figure_index+2)
}else{
  result = list(table_index = table_index, figure_index = figure_index+2, doc = doc)
}



# }

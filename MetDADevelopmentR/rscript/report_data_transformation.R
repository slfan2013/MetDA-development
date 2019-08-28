# report_data_transformation = function(treatment_group,equal_variance_assumption,type,fdr,result,levels = NULL,alternative = "two.sided",doc = NULL, table_index = 1,figure_index = 1){


if(!exists("treatment_group")){treatment_group=""}
if(!exists("method")){method=NULL}



if(!exists("type")){type=NULL}

if(!exists("result")){result=NULL}
if(!exists("levels")){levels=NULL}
if(!exists("alternative")){alternative=NULL}
if(!exists("doc")){doc=NULL}
if(!exists("table_index")){table_index=1}
if(!exists("figure_index")){figure_index=1}
if(!exists("project_id")){project_id = ""}
if(!exists("fold_id")){fold_id = NULL}
if(!exists("report_generator")){report_generator = FALSE}
text_html = ""




# save(treatment_group,equal_variance_assumption,type,fdr,result, levels,alternative, doc,table_index ,  figure_index ,file = "report_data_transformation.RData")

# load("report_data_transformation.RData")
pacman::p_load(data.table, officer, magrittr)



if(type == "all"){

  projectUrl <- URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/metda_project/", project_id))
  projectList <- jsonlite::fromJSON(projectUrl, simplifyVector = F)

  id <- sapply(projectList$project_structure, function(x) x$id)
  parent <- sapply(projectList$project_structure, function(x) x$parent)
  icon <- sapply(projectList$project_structure, function(x) x$icon)

  data_ids <- id[parent == fold_id & (!icon=="fa fa-folder")]


  # result <- read.csv(
  #   paste0(
  #     "http://metda.fiehnlab.ucdavis.edu/db/metda_project/",
  #     project_id,
  #     "/", data_ids
  #   ),
  #   row.names = 1
  # )

  input_file_path <- sapply(call_fun(parameter = list(project_id=project_id, file_id = parameters$activate_data_id, fun_name="get_fold_seq")), paste0,collapse = "->")
  output_file_path = sapply(call_fun(parameter = list(project_id=project_id, file_id = data_ids, fun_name="get_fold_seq")), paste0,collapse = "->")

#
#   treatment_group = parameters$treatment_group
#   equal_variance_assumption = parameters$equal_variance_assumption
#   fdr = parameters$fdr
#   alternative = "two.sided"
#
#   levels = levels(factor(call_fun(parameter = list(project_id=project_id,activate_data_id=parameters$activate_data_id,fun_name="read_data_from_projects"))$p[[treatment_group]]))

method = parameters$method
treatment_group = parameters$treatment_group


}



if(type %in% c("method_description", "all")){

  if (is.null(doc)) {
    doc <- read_docx()
  }
  if (type %in% "all") {

    doc <- doc %>%
      body_add_par("Data Transformation Summary: ", style = "heading 1")
  }

  doc <- doc %>%
    body_add_par("Transformations are nonlinear conversions of the data like, for instance, the log transformation and the power transformation. Transformations are generally applied to correct for heteroscedasticity, to convert multiplicative relations into additive relations, and to make skewed distributions (more) symmetric. In biology, relations between variables are not necessarily additive but can also be multiplicative. A transformation is then necessary to identify such a relation with linear techniques. [https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1534033/]", style = "Normal", pos = "after")

  if (type %in% "method_description") {
    content = docx_summary(doc)
    par_data <- subset(content, content_type %in% "paragraph")
    par_data <- par_data[, c("doc_index", "style_name", "text", "level", "num_id") ]
    par_data = par_data[!is.na(par_data$style_name),]

    text_html = ""
    tags_begin = revalue(par_data$style_name,c("heading 3", "Normal"),c("<h3>","<p>"))
    tags_end = revalue(par_data$style_name,c("heading 3", "Normal"),c("</h3>","</p>"))
    for(i in 1:length(par_data$style_name)){
      text_html = paste0(text_html,tags_begin[i],par_data$text[i],tags_end[i])
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
if(type %in% c("parameter_settings_description","all")){

  if (is.null(doc)) {
    doc <- read_docx()
  }

  if(type == "all"){
    doc <- doc %>%
      body_add_par("Input Summary: ", style = "heading 3")%>%
      body_add_par("Input Dataset: ", style = "Normal")%>%
      slip_in_text(input_file_path, style = "Default Paragraph Font", pos = "after")

    doc <- doc %>%
      body_add_par("Output Datasets and Files: ", style = "Normal")%>%
      slip_in_text(output_file_path, style = "Default Paragraph Font", pos = "after")
  }

  doc <- doc %>%
    body_add_fpar(fpar(ftext(" - Method: ", prop = fp_text(bold = TRUE))), style = "Normal")%>%
    slip_in_text(method, style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(paste0(". Either generalized log2, generalized log10, square root, cubic root, and boxcox-transformation. When the Box-Cox transformation is selected, the treatment group must be provided. "), style = "Default Paragraph Font", pos = "after")


  if(method == "boxcox"){
    if(length(treatment_group) == 0){
      treatment_group = ""
    }
    doc <- doc %>%
      body_add_fpar(fpar(ftext(" - Treatment Group: ", prop = fp_text(bold = TRUE))), style = "Normal")%>%
      slip_in_text(treatment_group, style = "Default Paragraph Font", pos = "after") %>%
      slip_in_text(paste0(". The treatment group will be used to estimate the best lambda for each compound."), style = "Default Paragraph Font", pos = "after")
  }



  if(type == 'parameter_settings_description'){
    content = docx_summary(doc)
    par_data <- subset(content, content_type %in% "paragraph")
    par_data <- par_data[, c("doc_index", "style_name", "text", "level", "num_id") ]
    par_data = par_data[!is.na(par_data$style_name),]

    text_html = ""
    tags_begin = revalue(par_data$style_name,c("heading 3", "Normal"),c("<h3>","<p>"))
    tags_end = revalue(par_data$style_name,c("heading 3", "Normal"),c("</h3>","</p>"))
    for(i in 1:length(par_data$style_name)){
      text_html = paste0(text_html,tags_begin[i],par_data$text[i],tags_end[i])
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
if(type %in% c("result_summary","all")){

  if (is.null(doc)) {
    doc <- read_docx()
  }

  doc <- doc %>%
    body_add_par("Result Summary: ", style = "heading 3")%>%
    body_add_par(paste0("The dataset was transformed using ",method," method."), style = "Normal", pos = "after")

  if(method == 'boxcox'){
    doc <- doc %>% body_add_par(paste0("Please note, it is normal to have negative values after boxcox tranformation. Avoid using the boxcox transformed dataset for fold change analysis."), style = "Normal", pos = "after")
  }

  doc <- doc %>%
    body_add_par("Table Explanation.", style = "Normal", pos = "after") %>%
    body_add_par(" - columns: the samples.", style = "Normal", pos = "after") %>%
    body_add_par(" - rows: the compounds.", style = "Normal", pos = "after") %>%
    body_add_par(" - this dataset can be further used for other statistical analysis.", style = "Normal", pos = "after")



  if(type == 'result_summary'){
    content = docx_summary(doc)
    par_data <- subset(content, content_type %in% "paragraph")
    par_data <- par_data[, c("doc_index", "style_name", "text", "level", "num_id") ]
    par_data = par_data[!is.na(par_data$style_name),]

    text_html = ""
    tags_begin = revalue(par_data$style_name,c("heading 3", "Normal"),c("<h3>","<p>"))
    tags_end = revalue(par_data$style_name,c("heading 3", "Normal"),c("</h3>","</p>"))
    for(i in 1:length(par_data$style_name)){
      text_html = paste0(text_html,tags_begin[i],par_data$text[i],tags_end[i])
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


if(type=="all"){

  if(!report_generator){
    doc %>% print(target = "report_data_transformation.docx")
  }
}


if(!report_generator){
  result = list(text_html = text_html, method_name = "Data Transformation", table_index = table_index+1, figure_index = figure_index)
}else{
  result = list(table_index = table_index, figure_index = figure_index, doc = doc)
}




# }




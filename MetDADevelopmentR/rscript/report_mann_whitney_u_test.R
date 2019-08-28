# report_mann_whitney_u_test = function(treatment_group,equal_variance_assumption,type,fdr,result,levels = NULL,alternative = "two.sided",doc = NULL, table_index = 1,figure_index = 1){

if(!exists("treatment_group")){treatment_group=NULL}
if(!exists("type")){type=NULL}
if(!exists("fdr")){fdr=NULL}
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




# save(treatment_group,equal_variance_assumption,type,fdr,result, levels,alternative, doc,table_index ,  figure_index ,file = "report_mann_whitney_u_test.RData")

# load("report_mann_whitney_u_test.RData")
pacman::p_load(data.table, officer, magrittr)



if(type == "all"){

  projectUrl <- URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/metda_project/", project_id))
  projectList <- jsonlite::fromJSON(projectUrl, simplifyVector = F)

  id <- sapply(projectList$project_structure, function(x) x$id)
  parent <- sapply(projectList$project_structure, function(x) x$parent)
  icon <- sapply(projectList$project_structure, function(x) x$icon)

  data_ids <- id[parent == fold_id & (!icon=="fa fa-folder")]


  result <- read.csv(
    paste0(
      "http://metda.fiehnlab.ucdavis.edu/db/metda_project/",
      project_id,
      "/", data_ids
    ),
    row.names = 1
  )

  input_file_path <- sapply(call_fun(parameter = list(project_id=project_id, file_id = parameters$activate_data_id, fun_name="get_fold_seq")), paste0,collapse = "->")
  output_file_path = sapply(call_fun(parameter = list(project_id=project_id, file_id = data_ids, fun_name="get_fold_seq")), paste0,collapse = "->")


  treatment_group = parameters$treatment_group
  equal_variance_assumption = parameters$equal_variance_assumption
  fdr = parameters$fdr
  alternative = "two.sided"

  levels = levels(factor(call_fun(parameter = list(project_id=project_id,activate_data_id=parameters$activate_data_id,fun_name="read_data_from_projects"))$p[[treatment_group]]))




}



if(type %in% c("method_description", "all")){

  if (is.null(doc)) {
    doc <- read_docx()
  }
  if (type %in% "all") {

    doc <- doc %>%
      body_add_par("Mann-Whitney U test Summary: ", style = "heading 1")
  }

  doc <- doc %>%
    body_add_par("In statistics, the Mann–Whitney U test (also called the Mann–Whitney–Wilcoxon (MWW), Wilcoxon rank-sum test, or Wilcoxon–Mann–Whitney test) is a nonparametric test of the null hypothesis that it is equally likely that a randomly selected value from one sample will be less than or greater than a randomly selected value from a second sample.

This test can be used to determine whether two independent samples were selected from populations having the same distribution; a similar nonparametric test used on dependent samples is the Wilcoxon signed-rank test. [https://en.wikipedia.org/wiki/Mann%E2%80%93Whitney_U_test]", style = "Normal", pos = "after")


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
    body_add_fpar(fpar(ftext(" - Treatment Group: ", prop = fp_text(bold = TRUE))), style = "Normal")%>%
    slip_in_text(treatment_group, style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(paste0(". The Mann-Whitney U test will be performed on each compound to detect those significantly altered by ",treatment_group,"."), style = "Default Paragraph Font", pos = "after")


  doc <- doc %>%
    body_add_fpar(fpar(ftext(" - Correct the False Discovery Rate: ", prop = fp_text(bold = TRUE))), style = "Normal")%>%
    slip_in_text(as.character(plyr::revalue(fdr, c("fdr"="Benjamini -- Hochberg (1995)", 'bonferroni'="Bonferroni correction", "holm"= "Holm (1979)", "hochberg" = "Hochberg (1988)", "hommel" = "Hommel (1988)", "BH" = "Benjamini -- Hochberg (1995)", "BY" = "Benjamini -- Yekutieli (2001)"))), style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(paste0(". When conducting multiple tests, the rate of incorrectly reject a null hypothesis will increase. FDR-controlling procedures are designed to control the expected proportion of \"discoveries\" (rejected null hypotheses) that are false (incorrect rejections). The suggested method for metabolomics is the Benjamini -- Hochberg procedure. For more information, please visit https://en.wikipedia.org/wiki/False_discovery_rate."), style = "Default Paragraph Font", pos = "after")


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
    body_add_par("Mann-Whitney U test", style = "Normal", pos = "after")%>%
    slip_in_text(" was performed on each compound to test if the median average of ", style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(levels[1], style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(" ", style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(ifelse(alternative=='two.sided',"different from", ifelse(alternative=='greater', "greater than", "less than")), style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(" ", style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(levels[2], style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(".", style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(" Out of ", style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(nrow(result), style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(" compounds, ", style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(sum(result$p_values<0.05,na.rm = TRUE), style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(" are significant with p-value less than 0.05. To control the false discovery rate (FDR), the ", style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(as.character(plyr::revalue(fdr, c("fdr"="Benjamini -- Hochberg (1995)", 'bonferroni'="Bonferroni correction", "holm"= "Holm (1979)", "hochberg" = "Hochberg (1988)", "hommel" = "Hommel (1988)", "BH" = "Benjamini -- Hochberg (1995)", "BY" = "Benjamini -- Yekutieli (2001)"))), style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(" procedure was used. After FDR correction, ", style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(sum(result$p_values_adjusted<0.05,na.rm = TRUE), style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(" compounds are still significant. See Table ", style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(table_index, style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(" for more detail.", style = "Default Paragraph Font", pos = "after")

  doc <- doc %>%
    body_add_par("Table Explanation.", style = "Normal", pos = "after") %>%
    body_add_par(" - index: the index of compounds, mainly for sorting the table.", style = "Normal", pos = "after") %>%
    body_add_par(" - label: compound labels.", style = "Normal", pos = "after") %>%
    body_add_par(" - p_values: p-values from mann-whitney u test.", style = "Normal", pos = "after") %>%
    body_add_par(" - p_values_adjusted: p-values adjusted by the FDR correction procedure.", style = "Normal", pos = "after")



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
  doc <- doc %>%
    body_add_table(value = result[order(result$p_values, decreasing = FALSE)[1:10],], style = "table_template")%>%
    body_add_par(value = paste0("Table ", table_index, ": most significant compounds (i.e. small p-values)"), style = "table title")

  if(!report_generator){
    doc %>% print(target = "report_mann_whitney_u_test.docx")
  }
}


if(!report_generator){
  result = list(text_html = text_html, method_name = "Mann-Whitney U test", table_index = table_index+1, figure_index = figure_index)
}else{
  result = list(table_index = table_index, figure_index = figure_index, doc = doc)
}




# }




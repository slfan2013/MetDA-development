# report_fold_change = function(treatment_group,equal_variance_assumption,type,fdr,result,levels = NULL,alternative = "two.sided",doc = NULL, table_index = 1,figure_index = 1){

if(!exists("treatment_group")){treatment_group=NULL}
if(!exists("mean_or_median")){mean_or_median=NULL}
if(!exists("treatment_group_levels")){treatment_group_levels=NULL}





if(!exists("doc")){doc=NULL}
if(!exists("result")){result=NULL}
if(!exists("table_index")){table_index=1}
if(!exists("figure_index")){figure_index=1}
if(!exists("project_id")){project_id = ""}
if(!exists("fold_id")){fold_id = NULL}
if(!exists("report_generator")){report_generator = FALSE}
text_html = ""




# save(treatment_group,equal_variance_assumption,type,fdr,result, levels,alternative, doc,table_index ,  figure_index ,file = "report_fold_change.RData")

# load("report_fold_change.RData")
pacman::p_load(data.table, officer, magrittr)



if(type == "all"){

  projectUrl <- URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/metda_project/", project_id))
  projectList <- jsonlite::fromJSON(projectUrl, simplifyVector = F)

  id <- sapply(projectList$project_structure, function(x) x$id)
  parent <- sapply(projectList$project_structure, function(x) x$parent)
  icon <- sapply(projectList$project_structure, function(x) x$icon)

  data_ids <- id[parent == fold_id & (!icon=="fa fa-folder")]



  result <- read.csv(URLencode(
    paste0(
      "http://metda.fiehnlab.ucdavis.edu/db/metda_project/",
      project_id,
      "/", data_ids
    )),
    row.names = 1
  )

  input_file_path <- sapply(call_fun(parameter = list(project_id=project_id, file_id = parameters$activate_data_id, fun_name="get_fold_seq")), paste0,collapse = "->")
  output_file_path = sapply(call_fun(parameter = list(project_id=project_id, file_id = data_ids, fun_name="get_fold_seq")), paste0,collapse = "->")


  treatment_group = parameters$treatment_group
  mean_or_median = parameters$mean_or_median
  treatment_group_levels = parameters$treatment_group_levels

}



if(type %in% c("method_description", "all")){

  if (is.null(doc)) {
    doc <- read_docx()
  }
  if (type %in% "all") {

    doc <- doc %>%
      body_add_par("Fold Change Summary: ", style = "heading 1")
  }

  doc <- doc %>%
    body_add_par("Fold change is often used to reveal the direction as well as the magnitude of changing of two groups for a compound. A fold change is defined as the average value of one group divided by another (i.e. the baseline group). There are two metrics for the average, mean and median. The mean fold change can be deemed as parametric, while the median as the non-parametric. A fold change greater than 1 means the compounds increased compared to the baseline and vise versa.", style = "Normal", pos = "after")

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

  if(length(treatment_group_levels)==1){
    treatment_group_levels = strsplit(treatment_group_levels,"\\|\\|")[[1]]
  }
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
    slip_in_text(paste0(". The fold change, defined as the average of ",treatment_group_levels[1]," divided by ",treatment_group_levels[2],", will be performed on each of the compounds."), style = "Default Paragraph Font", pos = "after")

  doc <- doc %>%
    body_add_fpar(fpar(ftext(" - Mean or Median: ", prop = fp_text(bold = TRUE))), style = "Normal")%>%
    slip_in_text(mean_or_median, style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(paste0(". Mean is the Arithmetic average, while the median is the 'middle value' (i.e. 50% quantile) average. Mean can be deemed as parametric, while median as non-parametric."), style = "Default Paragraph Font", pos = "after")




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
  if(length(treatment_group_levels)==1){
    treatment_group_levels = strsplit(treatment_group_levels,"\\|\\|")[[1]]
  }
  if (is.null(doc)) {
    doc <- read_docx()
  }

  num_comp = nrow(result)
  num_increase = sum(result$fold_changes>1, na.rm = TRUE)
  num_decrease = sum(result$fold_changes<1, na.rm = TRUE)
  num_increase_20 = sum(result$fold_changes>1.2, na.rm = TRUE)
  num_decrease_20 = sum(result$fold_changes<1/1.2, na.rm = TRUE)
  num_increase_50 = sum(result$fold_changes>1.5, na.rm = TRUE)
  num_decrease_50 = sum(result$fold_changes<1/1.5, na.rm = TRUE)
  num_increase_100 = sum(result$fold_changes>2, na.rm = TRUE)
  num_decrease_100 = sum(result$fold_changes<1/2, na.rm = TRUE)

  doc <- doc %>%
    body_add_par("Result Summary: ", style = "heading 3")%>%
    body_add_par(paste0("Fold change, defined as the ",mean_or_median," average ratio of ",treatment_group_levels[1]," to the ",treatment_group_levels[2]," were calculated for each of the compound. "),style = "Normal")%>%
    slip_in_text("Out of ", style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(num_comp, style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(" compounds, there are ", style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(num_increase, style = "strong", pos = "after")%>%
    slip_in_text(" (", style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(signif(num_increase/num_comp, 2)*100, style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text("%) increased from ", style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(treatment_group_levels[2], style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(" to ", style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(treatment_group_levels[1], style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(" with fold_change greater than 1, while ", style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(num_decrease, style = "strong", pos = "after")%>%
    slip_in_text(" (", style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(signif(num_decrease/num_comp, 2)*100, style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text("%) decreased.", style = "Default Paragraph Font", pos = "after")


  doc <- doc %>%
    body_add_par("Table Explanation.", style = "Normal", pos = "after") %>%
    body_add_par(" - index: the index of compounds, mainly for sorting the table.", style = "Normal", pos = "after") %>%
    body_add_par(" - label: compound labels.", style = "Normal", pos = "after") %>%
    body_add_par(paste0(" - fold_changes: the ",mean_or_median," average of ",treatment_group_levels[1]," divided by the ",mean_or_median," average of ",treatment_group_levels[2],". A fold change greater than 1 indicates a increasing from ",treatment_group_levels[2]," to ",treatment_group_levels[1],". "), style = "Normal", pos = "after")




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
  body_add_par(paste0("See Table ", table_index, ", Table ",table_index+1," and Figure ",figure_index," for more detail."), style = "Normal", pos = "after")


  doc <- doc %>%
    body_add_table(value = result[order(result$fold_changes, decreasing = TRUE)[1:10],], style = "table_template")%>%
    body_add_par(value = paste0("Table ", table_index, ": most increased compounds (from ",treatment_group_levels[2]," to ",treatment_group_levels[1],")."), style = "table title")


  doc <- doc %>%
    body_add_table(value = result[order(result$fold_changes, decreasing = FALSE)[1:10],], style = "table_template")%>%
    body_add_par(value = paste0("Table ", table_index+1, ": most decreased compounds (from ",treatment_group_levels[2]," to ",treatment_group_levels[1],")."), style = "table title")


  slices = cut(result$fold_changes, c(0,1/2,1/1.5,1/1.2,1,1.2,1.5,2,Inf))

  labels = paste0(signif(table(slices)/nrow(result),2)*100, "%")

  pie_colors = c("#3456eb","#3474eb","#348ceb","#34a8eb","#ebae34", "#eb8634","#eb6b34","#eb3434")
  # produce an emf file containing the ggplot
  svg(filename="pie_chart.svg",
      width=5*3,
      height=4*3,
      pointsize=8*3)
  pie(table(slices),labels  =labels , col = pie_colors,radius=0.7,cex=0.8)
  legend("bottomright",legend=c("Decreased > 100%","              50~100%","                20~50%","                  0~20%","Increased    0~20%","                20~50%","              50~100%","                 > 100%"),bty="n", fill=pie_colors,cex=0.8)
  dev.off()
  doc <- doc %>%
    body_add_img(src = "pie_chart.svg", width = 5, height = 4)%>%
    body_add_par(value = paste0("Figure ", figure_index, ": Detailed summary of Fold Changes."), style = "table title")%>%
    body_add_par(paste0("Figure ",figure_index," shows a more detailed summary of fold changes, where the percentage of compounds with 0~20%, 20~50% and more than 100% increasing and decreasing are shown. "), style = "Normal", pos = "after")



  if(!report_generator){
    doc %>% print(target = "report_fold_change.docx")
  }

}


if(!report_generator){
  result = list(text_html = text_html, method_name = "Fold Change", table_index = table_index+2, figure_index = figure_index+1)
}else{
  result = list(table_index = table_index, figure_index = figure_index+1, doc = doc)
}




# }




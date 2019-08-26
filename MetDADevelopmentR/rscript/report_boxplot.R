# report_boxplot = function(treatment_group,equal_variance_assumption,type,fdr,result,levels = NULL,alternative = "two.sided",doc = NULL, table_index = 1,figure_index = 1){


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




save(parameter, file = "report_boxplot.RData")

# load("report_boxplot.RData")
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




  }



if (type %in% c("method_description", "all")) {
  if (is.null(doc)) {
    doc <- read_docx()
  }
  if (type %in% "all") {
    doc <- doc %>%
      body_add_par("Boxplot Visualization Summary: ", style = "heading 1")
  }

  doc <- doc %>%
    body_add_par("Boxplots are good ways to visualize and compare compounds among different samples. A boxplot graphically depicts a vector through its five-number summary. The edges of the box represent the lower and upper quartiles while the whiskers represent the minimum and maximum values. The median is displayed as a line within the box. Outliers are represented as symbols outside of the whiskers. More information is available on https://www.nature.com/articles/nmeth.2813.", style = "Normal", pos = "after")

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
  }else if(type == "all"){

    if(identical(parameters$boxplot_plot$categoryarray,'value')){
      doc <- doc %>%
        body_add_fpar(fpar(ftext(" - values: ", prop = fp_text(bold = TRUE))), style = "Normal")%>%
        slip_in_text("The boxplot were generated to visualize the value of each compound. No sample grouping was applied. ", style = "Default Paragraph Font", pos = "after")
    }else if(is.null(parameters$boxplot_plot$data$x)){
      doc <- doc %>%
        body_add_fpar(fpar(ftext(" - values: ", prop = fp_text(bold = TRUE))), style = "Normal")%>%
        slip_in_text(paste0("The boxplot were generated to visualize the value of each compound. Samples were colored by ",paste0(parameters$boxplot_plot$categoryarray, collapse = ", "),". "), style = "Default Paragraph Font", pos = "after")
    }else{
      doc <- doc %>%
        body_add_fpar(fpar(ftext(" - values: ", prop = fp_text(bold = TRUE))), style = "Normal")%>%
        slip_in_text(paste0("The boxplot were generated to visualize the value of each compound. Samples were grouped by ",paste0(parameters$boxplot_plot$categoryarray, collapse = ", ")," and colored by ",paste0(parameters$boxplot_plot$data$name, collapse = ", "),". "), style = "Default Paragraph Font", pos = "after")
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

  if(type == "result_summary"){
    doc <- doc %>%
      body_add_par("Result Summary: ", style = "heading 3") %>%
      body_add_par(paste0("Boxplot of one compound is generated as shown in Figure ",figure_index,". "), style = "Normal", pos = "after")
    doc <- doc %>%
      body_add_par(paste0("To edit plot, please use TRACES tab on the right."), style = "Normal", pos = "after")
  }else{
    doc <- doc %>%
      body_add_par("Result Summary: ", style = "heading 3") %>%
      body_add_par(paste0("Boxplot for each compound were generated and saved in a zip file."), style = "Normal", pos = "after")

    if(identical(parameters$boxplot_plot$categoryarray,'value')){
      doc <- doc %>%
        body_add_fpar(fpar(ftext(" - values: ", prop = fp_text(bold = TRUE))), style = "Normal")%>%
        slip_in_text("The boxplot were generated to visualize the value of each compound. No sample grouping was applied. ", style = "Default Paragraph Font", pos = "after")
    }else if(is.null(parameters$boxplot_plot$data$x)){
      doc <- doc %>%
        body_add_fpar(fpar(ftext(" - values: ", prop = fp_text(bold = TRUE))), style = "Normal")%>%
        slip_in_text(paste0("The boxplot were generated to visualize the value of each compound. Samples were colored by ",paste0(parameters$boxplot_plot$categoryarray, collapse = ", "),". "), style = "Default Paragraph Font", pos = "after")
    }else{
      doc <- doc %>%
        body_add_fpar(fpar(ftext(" - values: ", prop = fp_text(bold = TRUE))), style = "Normal")%>%
        slip_in_text(paste0("The boxplot were generated to visualize the value of each compound. Samples were grouped by ",paste0(parameters$boxplot_plot$categoryarray, collapse = ", ")," and colored by ",paste0(parameters$boxplot_plot$data$name, collapse = ", "),". "), style = "Default Paragraph Font", pos = "after")
    }


    doc <- doc %>%
      body_add_par(paste0("An example boxplot is shown in Figure ",figure_index,"."), style = "Normal", pos = "after")

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

  figures_paths = data_ids


  i = 1

    download.file(URLencode(paste0(
      "http://metda.fiehnlab.ucdavis.edu/db/metda_project/",
      project_id,
      "/", figures_paths[i]
    )), destfile = figures_paths[i])

    unzip(figures_paths[i])

    file_names = list.files()




      doc <- doc %>%
        body_add_img(src = file_names[grepl("1th",file_names)][1], width = as.numeric(parameters$boxplot_plot$layout$width)/100*0.8, height = as.numeric(parameters$boxplot_plot$layout$height)/100*0.8) %>%
        body_add_par(value = paste0("Figure ", figure_index+i-1,": an example of boxplot."), style = "table title")







      if(!report_generator){
        doc %>% print(target = "report_boxplot.docx")
      }





}
if(!report_generator){
  result <- list(text_html = text_html, method_name = "Boxplot Visualization", table_index = table_index + 1, figure_index = figure_index+1)

}else{
  result = list(table_index = table_index+1, figure_index = figure_index+1, doc = doc)
}





# }

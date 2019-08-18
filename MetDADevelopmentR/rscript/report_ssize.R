# report_ssize = function(treatment_group,equal_variance_assumption,type,fdr,result,levels = NULL,alternative = "two.sided",doc = NULL, table_index = 1,figure_index = 1){

if (!exists("treatment_group")) {
  treatment_group <- NULL
}
if (!exists("test_type")) {
  test_type <- NULL
}
if (!exists("n")) {
  n <- NULL
}
if (!exists("power")) {
  power <- NULL
}
if (!exists("sample_id")) {
  sample_id <- NULL
}
if (!exists("sig_level")) {
  sig_level <- NULL
}

if(!exists("groups")){groups=NULL}


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




save(parameter, file = "report_ssize.RData")

# load("report_ssize.RData")
pacman::p_load(data.table, officer, magrittr)



if (type == "all") {
  projectUrl <- URLencode(paste0("http://metda:metda@localhost:5985/metda_project/", project_id))
  projectList <- jsonlite::fromJSON(projectUrl, simplifyVector = F)

  id <- sapply(projectList$project_structure, function(x) x$id)
  parent <- sapply(projectList$project_structure, function(x) x$parent)

  data_ids <- id[parent == fold_id]


  result <- read.csv(
    paste0(
      "http://metda:metda@localhost:5985/metda_project/",
      project_id,
      "/", data_ids[grepl("csv",data_ids)]
    ),
    row.names = 1
  )

  input_file_path <- paste0(sapply(call_fun(parameter = list(project_id = project_id, file_id = parameters$activate_data_id, fun_name = "get_fold_seq")), paste0, collapse = "->"), "; ")
  output_file_path <- paste0(sapply(call_fun(parameter = list(project_id = project_id, file_id = data_ids, fun_name = "get_fold_seq")), paste0, collapse = "->"), "; ")


  treatment_group <- parameters$treatment_group
  equal_variance_assumption <- parameters$equal_variance_assumption
  fdr <- parameters$fdr
  alternative <- "two.sided"

  levels <- levels(factor(call_fun(parameter = list(project_id = project_id, activate_data_id = parameters$activate_data_id, fun_name = "read_data_from_projects"))$p[[treatment_group]]))
}



if (type %in% c("method_description", "all")) {
  if (is.null(doc)) {
    doc <- read_docx()
  }
  if (type %in% "all") {
    doc <- doc %>%
      body_add_par("Sample Size Estimation & Power Analysis Summary: ", style = "heading 1")
  }

  doc <- doc %>%
    body_add_par("Warnes and Liu (2006) provide a simple method for computing sample size for microarray experiments, and reports on a series of simulations demonstrating its performance. Surprisingly, despite its simplicity, the method performs exceptionally well even for data with very high correlation between measurements.
", style = "Normal", pos = "after") %>%
    body_add_par("The key component of this method is the generation of a cumulative plot of the proportion of compounds achieving a desired power as a function of sample size, based on simple gene-by-gene calculations. While this mechanism can be used to select a sample size numerically based on pre-specified conditions, its real utility is as a visual tool for understanding the trade off between sample size and power. In our consulting work, this latter use as a visual tool has been exceptionally valuable in helping scientific clients to make the difficult trade offs between experiment cost and statistical power. ", style = "Normal", pos = "after") %>%
    body_add_par("Multiple comparison problem can also be taken into account in this method. The criterion rate for each compounds can be estiamted using qvalue package.", style = "Normal", pos = "after")

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
      body_add_par("Output Dataset: ", style = "Normal") %>%
      slip_in_text(output_file_path, style = "Default Paragraph Font", pos = "after")
  }

  doc <- doc %>%
    body_add_fpar(fpar(ftext(" - Test Type: ", prop = fp_text(bold = TRUE))), style = "Normal") %>%
    slip_in_text(test_type, style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(". ", style = "Default Paragraph Font", pos = "after")
  test_name <- revalue(test_type, c("t-test", "paired t-test", "ANOVA", "repeated ANOVA"), c("two-tailed student t-test", "two-tailed paired t-test", "one-way ANOVA", "repeated ANOVA"))


  doc <- doc %>%
    slip_in_text(paste0("Compute the statistical power of the ", test_name, " given a sample size, and determines the sample size to obtain a target statistical power."), style = "Default Paragraph Font", pos = "after")




  doc <- doc %>%
    body_add_fpar(fpar(ftext(" - Treatment Group: ", prop = fp_text(bold = TRUE))), style = "Normal") %>%
    slip_in_text(treatment_group, style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(paste0(". The effect size, an input parameter for power analysis, will be estimated by the ", treatment_group, ". Then the statistical power will be calculated based on the sample size in your dataset and the estimated sample size will be calculated based on the target statistical power."), style = "Default Paragraph Font", pos = "after")


  if (test_type %in% c("paired t-test", "repeated ANOVA")) {
    doc <- doc %>%
      body_add_fpar(fpar(ftext(" - Sample ID information: ", prop = fp_text(bold = TRUE))), style = "Normal") %>%
      slip_in_text(paste0(sample_id,". The ",sample_id," is used to paired the samples. Samples with same Sample ID are treated as from a same subject."), style = "Default Paragraph Font", pos = "after")
  }


  doc <- doc %>%
    body_add_fpar(fpar(ftext(" - Interested Number of Observations (per group): ", prop = fp_text(bold = TRUE))), style = "Normal") %>%
    slip_in_text(" the given sample size. The statistical power will be estimated based on the given sample size.", style = "Default Paragraph Font", pos = "after")

  doc <- doc %>%
    body_add_fpar(fpar(ftext(" - Target Power (%): ", prop = fp_text(bold = TRUE))), style = "Normal") %>%
    slip_in_text(" the target statistical power. The sample size to achieve the target power will be calculated.", style = "Default Paragraph Font", pos = "after")

  doc <- doc %>%
    body_add_fpar(fpar(ftext(" - Significance Level: ", prop = fp_text(bold = TRUE))), style = "Normal") %>%
    slip_in_text(" Type I error rate (the significant criterion), the rate of falsely reject a true null hypothesis.", style = "Default Paragraph Font", pos = "after")


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
    body_add_par(paste0("The statistical powers were estimated for each compound given a sample size of ",n,", and the sample size was estimated based on a target power of ",power,". The effect size of each compound was calculated from the dataset using the treatment group ", treatment_group, '. A significant level of ',sig_level," was used. See Table ",table_index, ",  Figure ", figure_index, " and ", figure_index+1, " for more detail. "), style = "Normal", pos = "after")

  # index	label	power (n=12)	n (power=0.8)

  doc <- doc %>%
    body_add_par("Table Explanation.", style = "Normal", pos = "after") %>%
    body_add_par(" - index: the index of compounds, mainly for sorting the table.", style = "Normal", pos = "after") %>%
    body_add_par(" - label: compound labels.", style = "Normal", pos = "after") %>%
    body_add_par(paste0(" - power (n=",n,"): the estimated statistical power given sample size of ",n,"."), style = "Normal", pos = "after") %>%
    body_add_par(paste0(" - n (power=",power,"): the estimated sample size for the target power of ",power*100,"%."), style = "Normal", pos = "after")




  doc <- doc %>%
    body_add_par(paste0("Figure ", figure_index), style = "Normal", pos = "after") %>%
    body_add_par(paste0(" answers the question of What is the necessary per-group sample size for ",power*100,"% powe with the observed effect size and at significant level of ",sig_level,"?."), style = "Normal", pos = "after") %>%
    body_add_par(paste0("The plot illustrates that smaple size of ",paste0(ceiling(quantile(result[[4]], c(.10, .20, .30)) ),collapse = " ,")," is required to ensure that at least 10%, 20%, and 30% of compounds have a statistical power greater than ",power*100,"%. It is also shown that a sample size of ",min(table(groups))," is sufficient if ",signif(sum(result[[4]]< min(table(groups)))/nrow(result),4)*100,"% of the compounds need to achieve a ",power*100,"% power."), style = "Normal", pos = "after")


  doc <- doc %>%
    body_add_par(paste0("Figure ", figure_index+1), style = "Normal", pos = "after") %>%
    body_add_par(paste0(" answers the question of What is the power for ",n," parients per group with the observed effect size and significant level of ", sig_level,'?. '), style = "Normal", pos = "after") %>%
    body_add_par(paste0("From the plot, ",signif(sum(result[[3]]>0.8)/nrow(result),digits = 4)*100,"% of compounds achieve at ",power*100,"% statistical power at the sample size of ",n," and significant level of ",sig_level,". "), style = "Normal", pos = "after")


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


if (type == "all") {
  doc <- doc %>%
    body_add_table(value = result[order(result$p_values, decreasing = FALSE)[1:10], ], style = "table_template") %>%
    body_add_par(value = paste0("Table ", table_index, ": most significant compounds (i.e. small p-values)"), style = "table title")

  doc %>% print(target = "report_ssize.docx")
}


result <- list(text_html = text_html, method_name = "Sample Size Estimation & Power Analysis", table_index = table_index + 1, figure_index = figure_index+2)


# }

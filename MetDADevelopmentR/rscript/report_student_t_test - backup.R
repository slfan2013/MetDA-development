# report_student_t_test <- function(project_id = "report t test11565154747", fold_id = "Student t-test1565154823", table_index = 1,figure_index = 1, doc = NULL) {
  pacman::p_load(data.table, officer, magrittr)

  projectUrl <- URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/metda_project/", project_id))
  projectList <- jsonlite::fromJSON(projectUrl, simplifyVector = F)

  id <- sapply(projectList$project_structure, function(x) x$id)
  parent <- sapply(projectList$project_structure, function(x) x$parent)
  icon <- sapply(projectList$project_structure, function(x) x$icon)

  data_ids <- id[parent == fold_id & (!icon=="fa fa-folder")]

  result_summary <- read.csv(URLencode(
    paste0(
      "http://metda.fiehnlab.ucdavis.edu/db/metda_project/",
      project_id,
      "/", data_ids
    )),
    row.names = 1
  )



  parameters <- projectList$project_structure[[which(id %in% fold_id)]]$parameter



  # fold_seq <- get_fold_seq(project_id, parameters$activate_data_id)
  fold_seq <- call_fun(parameter = list(project_id=project_id, file_id = parameters$activate_data_id, fun_name="get_fold_seq"))

  if (is.null(doc)) {
    doc <- read_docx()
  }




  doc <- doc %>%
    body_add_par("T-test Result Summary ", style = "heading 1") %>%
    body_add_par("Input Dataset: ", style = "Normal") %>%
    slip_in_text(paste0(fold_seq, collapse = "->"), style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(".", style = "Default Paragraph Font", pos = "after")

  doc <- doc %>%
    body_add_par("Treatment Group: ", style = "Normal") %>%
    slip_in_text(parameters$treatment_group, style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(".", style = "Default Paragraph Font", pos = "after")

  doc <- doc %>%
    body_add_par("Assumption of Equal Variances: ", style = "Normal") %>%
    slip_in_text(parameters$equal_variance_assumption, style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(". When the equal variances between two groups hold, the t-test is Student's t-test, otherwise, the Welch t-test. ", style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text("In this case, it is the ", style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(ifelse(parameters$equal_variance_assumption,"Student's t-test.", "Welch t-test."), style = "Default Paragraph Font", pos = "after")


  if(parameters$fdr == 'none'){
    doc <- doc %>%
      body_add_par("False Discovery Rate (FDR) Correction: ", style = "Normal") %>%
      slip_in_text("FALSE. No correction was applied on the p-values of the t-tests.", style = "Default Paragraph Font", pos = "after")
  }else{
    FDR_method_name = as.character(plyr::revalue(parameters$fdr, c("fdr"="Benjamini & Hochberg (1995)", 'bonferroni'="Bonferroni correction", "holm"= "Holm (1979)", "hochberg" = "Hochberg (1988)", "hommel" = "Hommel (1988)", "BH" = "Benjamini & Hochberg (1995)", "BY" = "Benjamini & Yekutieli (2001)")))

    doc <- doc %>%
      body_add_par("False Discovery Rate (FDR) Correction: ", style = "Normal") %>%
      slip_in_text("In order to control the false discovery rate, the ", style = "Default Paragraph Font", pos = "after") %>%
      slip_in_text(FDR_method_name, style = "Default Paragraph Font", pos = "after") %>%
      slip_in_text(" Procedure was used on the p-values of the t-tests. The adjusted p-values are reported as p_values_adjusted.", style = "Default Paragraph Font", pos = "after")
  }

  num_comp = nrow(result_summary)
  num_sig = sum(result_summary$p_values<0.05, na.rm = TRUE)
  num_sig_after_FDR = sum(result_summary$p_values_adjusted<0.05, na.rm = TRUE)


  table_index = table_index+1
  doc <- doc %>%
    body_add_par("Result Summary: ", style = "Normal")%>%
    slip_in_text("out of ", style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(num_comp, style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(" compounds, there are ", style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(num_sig, style = "strong", pos = "after")%>%
    slip_in_text(" (", style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(signif(num_sig/num_comp, 2), style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text("%) having p-values less than 0.05 ,and ", style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(num_sig_after_FDR, style = "strong", pos = "after")%>%
    slip_in_text(" (", style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(signif(num_sig_after_FDR/num_comp, 2), style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text("%) adjusted p-values less than 0.05. Table ", style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(table_index, style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(" shows the 20 most significant compounds.", style = "Default Paragraph Font", pos = "after")%>%
    body_add_table(value = result_summary[order(result_summary$p_values, decreasing = FALSE)[1:20],], style = "table_template")%>%
    body_add_par(value = paste0("Table ", table_index, ": t-test result summary (", paste0(sapply(call_fun(parameter = list(project_id=project_id, file_id = data_ids, fun_name="get_fold_seq")), paste0,collapse = "->"),"; "), ")"), style = "table title")



  # if (sum(result_summary$excluded == "Yes") > 0) {
  #   table_index <- table_index + 1
  #   doc <- doc %>%
  #     slip_in_text("These compounds are marked as excluded = Yes in the Table ", style = "Default Paragraph Font", pos = "after") %>%
  #     slip_in_text(table_index, style = "Default Paragraph Font", pos = "after") %>%
  #     slip_in_text(".", style = "Default Paragraph Font", pos = "after")
  #
  #   result_summary_table <- result_summary[order(result_summary$total, decreasing = TRUE), ]
  #   result_summary_table <- result_summary_table[result_summary_table$total > 0, ]
  #
  #   doc <- doc %>%
  #     body_add_par("Missing Value Summary: Table ", style = "Normal") %>%
  #     slip_in_text(table_index, style = "Default Paragraph Font", pos = "after") %>%
  #     slip_in_text(".", style = "Default Paragraph Font", pos = "after") %>%
  #     body_add_table(value = result_summary_table, style = "table_template") %>%
  #     body_add_par(value = paste0("Table ", table_index, ": missing value summary (", paste0(sapply(get_fold_seq(project_id, data_ids[grepl("summary", data_ids)]), paste0,collapse = "->"),"; "), ")"), style = "table title")
  # }




  doc %>% print(target = "report_student_t_test.docx")



  result = list(doc = doc, table_index = table_index,figure_index =figure_index)
# }

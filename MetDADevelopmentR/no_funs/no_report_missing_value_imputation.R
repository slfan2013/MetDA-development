report_missing_value_imputation <- function(project_id = "report 31565132374", fold_id = "Missing Value Imputation1565132404", table_index = 1, figure_index = 1,doc = NULL) {
  pacman::p_load(data.table, officer, magrittr)

  projectUrl <- URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/metda_project/", project_id))
  projectList <- jsonlite::fromJSON(projectUrl, simplifyVector = F)

  id <- sapply(projectList$project_structure, function(x) x$id)
  parent <- sapply(projectList$project_structure, function(x) x$parent)

  data_ids <- id[parent == fold_id]


  result_summary <- read.csv(
    paste0(
      "http://metda.fiehnlab.ucdavis.edu/db/metda_project/",
      project_id,
      "/", data_ids[grepl("summary", data_ids)]
    ),
    row.names = 1
  )



  parameters <- projectList$project_structure[[which(id %in% fold_id)]]$parameter



  # fold_seq <- get_fold_seq(project_id, parameters$activate_data_id)
  fold_seq = call_fun(parameter = list(project_id=project_id, file_id = parameters$activate_data_id, fun_name="get_fold_seq"))


  defination_of_missing_value <- unlist(parameters$defination_of_missing_value)
  if ("values less than ..." %in% defination_of_missing_value) {
    defination_of_missing_value[defination_of_missing_value %in% "values less than ..."] <- paste0("values less than ", parameters$defination_of_missing_value_values_less_than)
  }



  if (is.null(doc)) {
    doc <- read_docx()
  }

  doc <- doc %>%
    body_add_par("Missing Value Imputation Summary ", style = "heading 1") %>%
    body_add_par("Input Dataset: ", style = "Normal") %>%
    slip_in_text(paste0(fold_seq, collapse = "->"), style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(".", style = "Default Paragraph Font", pos = "after")

  doc <- doc %>%
    body_add_par("Defination of Missing Value: ", style = "Normal") %>%
    slip_in_text(paste0(defination_of_missing_value, collapse = ", "), style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(".", style = "Default Paragraph Font", pos = "after")


  doc <- doc %>%
    body_add_par("Features Removal: ", style = "Normal") %>%
    slip_in_text(parameters$remove_missing_values_more_than, style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(".", style = "Default Paragraph Font", pos = "after")

  if (parameters$remove_missing_values_more_than) {
    doc <- doc %>%
      slip_in_text(" ", style = "Default Paragraph Font") %>%
      slip_in_text(sum(result_summary$excluded == "Yes"), style = "Default Paragraph Font") %>%
      slip_in_text(" compounds with more than ", style = "Default Paragraph Font") %>%
      slip_in_text(parameters$remove_missing_values_more_than_value, style = "Default Paragraph Font", pos = "after") %>%
      slip_in_text("% of missing values were removed before the missing value imputation. ", style = "Default Paragraph Font", pos = "after")
  }

  if (sum(result_summary$excluded == "Yes") > 0) {
    table_index <- table_index + 1
    doc <- doc %>%
      slip_in_text("These compounds are marked as excluded = Yes in the Table ", style = "Default Paragraph Font", pos = "after") %>%
      slip_in_text(table_index, style = "Default Paragraph Font", pos = "after") %>%
      slip_in_text(".", style = "Default Paragraph Font", pos = "after")

    result_summary_table <- result_summary[order(result_summary$total, decreasing = TRUE), ]
    result_summary_table <- result_summary_table[result_summary_table$total > 0, ]

    doc <- doc %>%
      body_add_par("Missing Value Summary: Table ", style = "Normal") %>%
      slip_in_text(table_index, style = "Default Paragraph Font", pos = "after") %>%
      slip_in_text(".", style = "Default Paragraph Font", pos = "after") %>%
      body_add_table(value = result_summary_table, style = "table_template") %>%
      body_add_par(value = paste0("Table ", table_index, ": missing value summary (", paste0(sapply(call_fun(parameter = list(project_id=project_id, file_id = data_ids[grepl("summary", data_ids)], fun_name="get_fold_seq")), paste0,collapse = "->"),"; "), ")"), style = "table title")
  }



  doc <- doc %>%
    body_add_par("Missing Value Imputation Method: ", style = "Normal") %>%
    slip_in_text(parameters$missing_value_imputation_method, style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(". ", style = "Default Paragraph Font", pos = "after")

  if (parameters$missing_value_imputation_method == "replace by half minimum") {
    doc <- doc %>%
      slip_in_text("For each compound, the 1/2 of the smallest non-missing value was used to impute the missing values. A small disturbance (random values from a normal distribution with a standard deviation of 1/10 of the smallest non-missing value) was added to each imputed value to prevent constant value that may cause trouble in statistical modelings. ", style = "Default Paragraph Font", pos = "after")
  }


  doc <- doc %>%
    body_add_par("Output Dataset: ", style = "Normal") %>%
    slip_in_text(paste0(sapply(call_fun(parameter = list(project_id=project_id, file_id = data_ids[!grepl("summary", data_ids)], fun_name="get_fold_seq")), paste0,collapse = "->"),"; "), style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(". ", style = "Default Paragraph Font", pos = "after")



  doc %>% print(target = "report_missing_value_imputation.docx")



  return(list(doc = doc, table_index = table_index,figure_index =figure_index))
}

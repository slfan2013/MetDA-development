# report_e <- function(project_id = "report 11565112203", e_id = "e.csv", table_index = 0,figure_index = 1, doc = NULL) {
  e <- read.csv(URLencode(
    paste0(
      "http://metda.fiehnlab.ucdavis.edu/db/metda_project/",
      project_id,
      "/", e_id
    )),
    row.names = 1
  )





  fold_seq <- call_fun(parameter = list(project_id=project_id, file_id = e_id, fun_name="get_fold_seq"))



  num_of_character <- sum(is.na(as.numeric(data.matrix(e))))
  num_of_missing <- sum(is.na(e)) + num_of_character



  if (is.null(doc)) {
    doc <- read_docx()
  }

  doc <- doc %>%
    body_add_par("The dataset ", style = "Normal") %>%
    slip_in_text(paste0(fold_seq, collapse = "->"), style = "strong") %>%
    slip_in_text(" contains ", style = "Default Paragraph Font") %>%
    slip_in_text(ncol(e), style = "Default Paragraph Font") %>%
    slip_in_text(" samples and ", style = "Default Paragraph Font") %>%
    slip_in_text(nrow(e), style = "Default Paragraph Font") %>%
    slip_in_text(" compounds. ", style = "Default Paragraph Font")

  if (num_of_character == 0) {
    doc <- doc %>%
      slip_in_text("All values in the dataset are numeric. ", style = "Default Paragraph Font", pos = "after")
  } else {
    doc <- doc %>%
      slip_in_text(num_of_character, style = "strong", pos = "after") %>%
      slip_in_text(" values in the dataset are characters (not numeric). They will be treated as missing values.", style = "strong", pos = "after")
  }

  if (num_of_missing == 0) {
    doc <- doc %>%
      slip_in_text("No missing values were found in the dataset. ", style = "Default Paragraph Font", pos = "after")
  } else {
    doc <- doc %>%
      slip_in_text(num_of_missing, style = "strong", pos = "after") %>%
      slip_in_text(" missing values were found in the dataset.", style = "strong", pos = "after")
  }


  doc %>% print(target = "report_e.docx")





  result = list(doc = doc, table_index = table_index,figure_index =figure_index)
# }

report_heatmap <- function(project_id = "report heatmap21565307593", fold_id = "Heatmap1565307638", table_index = 1, figure_index = 1, doc = NULL) {
  pacman::p_load(data.table, officer, magrittr)

  projectUrl <- URLencode(paste0("http://metda:metda@localhost:5985/metda_project/", project_id))
  projectList <- jsonlite::fromJSON(projectUrl, simplifyVector = F)

  id <- sapply(projectList$project_structure, function(x) x$id)
  parent <- sapply(projectList$project_structure, function(x) x$parent)

  data_ids <- id[parent == fold_id]


  # result_summary <- read.csv(
  #   paste0(
  #     "http://metda:metda@localhost:5985/metda_project/",
  #     project_id,
  #     "/", data_ids
  #   ),
  #   row.names = 1
  # )

  sample_order_id = data_ids[grepl("sample_order", data_ids)]

  sample_order = read.csv(
    paste0(
      "http://metda:metda@localhost:5985/metda_project/",
      project_id,
      "/", sample_order_id
    ),
    row.names = 1
  )

  compound_order_id = data_ids[grepl("compound_order", data_ids)]

  compound_order = read.csv(
    paste0(
      "http://metda:metda@localhost:5985/metda_project/",
      project_id,
      "/", compound_order_id
    ),
    row.names = 1
  )




  parameters <- projectList$project_structure[[which(id %in% fold_id)]]$parameter



  fold_seq <- get_fold_seq(project_id, parameters$activate_data_id)

  # paste0(sapply(get_fold_seq(project_id, parameters$activate_data_id), paste0, collapse = "->"), "; ")



  if (is.null(doc)) {
    doc <- read_docx()
  }




  doc <- doc %>%
    body_add_par("Heatmap Plot Visualization Summary ", style = "heading 1") %>%
    body_add_par("Input Statistics: ", style = "Normal") %>%
    slip_in_text(paste0(sapply(fold_seq, paste0, collapse = "->"), "; "), style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(".", style = "Default Paragraph Font", pos = "after")


  if(is.null(parameters$p_value_data_treatment)){ # this means this is in and out. User uploaded the dataset. So we don't know p-values and fold change comparing what.
    doc <- doc %>%
      body_add_par(". Cut-off: ", style = "Normal") %>%
      slip_in_text(parameters$heatmap_plot$p_value_cut_off, style = "Default Paragraph Font", pos = "after") %>%
      slip_in_text(".", style = "Default Paragraph Font", pos = "after")


    doc <- doc %>%
      body_add_par("Cut-off: ", style = "Normal") %>%
      slip_in_text(paste0(signif(as.numeric(parameters$heatmap_plot$fold_change_cut_off), 2), " and ", signif(1 / as.numeric(parameters$heatmap_plot$fold_change_cut_off),2)), style = "Default Paragraph Font", pos = "after") %>%
      slip_in_text(".", style = "Default Paragraph Font", pos = "after")


  }else{
    doc <- doc %>%
      body_add_par("p-value comparing: ", style = "Normal") %>%
      slip_in_text(parameters$p_value_data_treatment, style = "Default Paragraph Font", pos = "after") %>%
      slip_in_text(". Cut-off: ", style = "Default Paragraph Font", pos = "after") %>%
      slip_in_text(parameters$heatmap_plot$p_value_cut_off, style = "Default Paragraph Font", pos = "after") %>%
      slip_in_text(".", style = "Default Paragraph Font", pos = "after")

    doc <- doc %>%
      body_add_par("fold change comparing: ", style = "Normal") %>%
      slip_in_text(parameters$fold_change_data_treatment, style = "Default Paragraph Font", pos = "after") %>%
      slip_in_text(". Cut-off: ", style = "Default Paragraph Font", pos = "after") %>%
      slip_in_text(paste0(signif(as.numeric(parameters$heatmap_plot$fold_change_cut_off), 2), " and ", signif(1 / as.numeric(parameters$heatmap_plot$fold_change_cut_off),2)), style = "Default Paragraph Font", pos = "after") %>%
      slip_in_text(".", style = "Default Paragraph Font", pos = "after")
  }





  figure_index <- figure_index + 1

  categories <- sapply(parameters$heatmap_plot$data, function(data) unlist(data$x))


  doc <- doc %>%
    body_add_par("Figure ", style = "Normal") %>%
    slip_in_text(figure_index, style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(" is the heatmap plot. There are ", style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(length(categories[[1]]), style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(" compounds significantly increased more than the fold change cut-off, while ", style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(length(categories[[2]]), style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(" compounds significantly decreased more than the fold change cut-off.", style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(" The y axis is the -log10 p-values. The higher the more significant. The x axis is the log2 Fold Change. The further from the origin the larger the fold change.", style = "Default Paragraph Font", pos = "after")






  data_ids_name_split <- strsplit(data_ids, "\\.")[[1]]
  data_ids_name_split1 <- paste0(data_ids_name_split[1:(length(data_ids_name_split) - 1)])
  data_ids_name <- paste0(substr(data_ids_name_split1, 1, nchar(data_ids_name_split1) - 11 + 1), ".", data_ids_name_split[length(data_ids_name_split)])

  download.file(URLencode(paste0(
    "http://metda:metda@localhost:5985/metda_project/",
    project_id,
    "/", data_ids
  )), destfile = data_ids_name)

  doc <- doc %>%
    body_add_img(src = data_ids_name, width = 5, height = 4) %>%
    body_add_par(value = paste0("Figure ", figure_index, ": Heatmap Plot ("), style = "table title")%>%
    body_add_par(value = paste0(sapply(get_fold_seq(project_id, data_ids), paste0, collapse = "->"), "; "), style = "table title") %>%
    body_add_par(value = ". ", style = "table title")





  doc %>% print(target = "report_heatmap.docx")



  return(list(doc = doc, table_index = table_index, figure_index = figure_index))
}

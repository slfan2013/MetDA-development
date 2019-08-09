report_heatmap <- function(project_id = "report heatmap21565307593", fold_id = "Heatmap1565307638", table_index = 1, figure_index = 1, doc = NULL) {
  pacman::p_load(data.table, officer, magrittr, magick)

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

  doc <- doc %>%
    body_add_par("Scaling Method: ", style = "Normal") %>%
    slip_in_text(parameters$scaling_method, style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(".", style = "Default Paragraph Font", pos = "after")

  doc <- doc %>%
    body_add_par("Dendrogram Clustering Method: ", style = "Normal") %>%
    slip_in_text(parameters$clust_method, style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(".", style = "Default Paragraph Font", pos = "after")

  doc <- doc %>%
    body_add_par("Dendrogram Distance Method: ", style = "Normal") %>%
    slip_in_text(parameters$dist_method, style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(".", style = "Default Paragraph Font", pos = "after")


  if(length(parameters$heatmap_plot$sample_annotation)>0){
    doc <- doc %>%
      body_add_par("Sample Annotations: ", style = "Normal") %>%
      slip_in_text(paste0(parameters$heatmap_plot$sample_annotation, collapse = ", "), style = "Default Paragraph Font", pos = "after") %>%
      slip_in_text(".", style = "Default Paragraph Font", pos = "after")
  }

  if(length(parameters$heatmap_plot$compound_annotation)>0){
    doc <- doc %>%
      body_add_par("compound Annotations: ", style = "Normal") %>%
      slip_in_text(paste0(parameters$heatmap_plot$compound_annotation, collapse = ", "), style = "Default Paragraph Font", pos = "after") %>%
      slip_in_text(".", style = "Default Paragraph Font", pos = "after")
  }



    doc <- doc %>%
      body_add_par("Sample Order: ", style = "Normal") %>%
      slip_in_text(paste0(parameters$heatmap_plot$order_sample_by, collapse = ", "), style = "Default Paragraph Font", pos = "after") %>%
      slip_in_text(".", style = "Default Paragraph Font", pos = "after")

    doc <- doc %>%
      body_add_par("Compound Order: ", style = "Normal") %>%
      slip_in_text(paste0(parameters$heatmap_plot$order_compound_by, collapse = ", "), style = "Default Paragraph Font", pos = "after") %>%
      slip_in_text(".", style = "Default Paragraph Font", pos = "after")



  figure_index <- figure_index + 1






  data_ids = data_ids[grepl("svg",data_ids)]
  data_ids_name_split <- strsplit(data_ids, "\\.")[[1]]
  data_ids_name_split1 <- paste0(data_ids_name_split[1:(length(data_ids_name_split) - 1)])
  data_ids_name <- paste0(substr(data_ids_name_split1, 1, nchar(data_ids_name_split1) - 11 + 1), ".", data_ids_name_split[length(data_ids_name_split)])

  download.file(URLencode(paste0(
    "http://metda:metda@localhost:5985/metda_project/",
    project_id,
    "/", data_ids
  )), destfile = data_ids_name)


  figure <- image_read_svg(data_ids_name, height = 500)


  doc <- doc %>%
    body_add_img(src = data_ids_name, width = image_info(figure)$width/72, height = image_info(figure)$height/72) %>%
    body_add_par(value = paste0("Figure ", figure_index, ": Heatmap Plot ("), style = "table title")%>%
    body_add_par(value = paste0(sapply(get_fold_seq(project_id, data_ids), paste0, collapse = "->"), "; "), style = "table title") %>%
    body_add_par(value = ". ", style = "table title")





  doc %>% print(target = "report_heatmap.docx")



  return(list(doc = doc, table_index = table_index, figure_index = figure_index))
}

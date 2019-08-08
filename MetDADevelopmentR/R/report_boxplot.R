report_boxplot <- function(project_id = "report boxploot21565233588", fold_id = "Boxplot1565239035", table_index = 1, figure_index = 1, doc = NULL) {
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
  # unzip(URLencode(paste0(
  #   "http://metda:metda@localhost:5985/metda_project/",
  #   project_id,
  #   "/", data_ids
  # )), list = TRUE)


  download.file(URLencode(paste0(
    "http://metda:metda@localhost:5985/metda_project/",
    project_id,
    "/", data_ids
  )), destfile = "boxplot.zip")


  files = unzip("boxplot.zip", list = TRUE)


  unzip("boxplot.zip", files  = files[1,1])



  parameters <- projectList$project_structure[[which(id %in% fold_id)]]$parameter



  fold_seq <- get_fold_seq(project_id, parameters$activate_data_id)

  if (is.null(doc)) {
    doc <- read_docx()
  }




  doc <- doc %>%
    body_add_par("Boxplot Visualization Summary ", style = "heading 1") %>%
    body_add_par("Input Dataset: ", style = "Normal") %>%
    slip_in_text(paste0(fold_seq, collapse = "->"), style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(".", style = "Default Paragraph Font", pos = "after")

  figure_index = figure_index+1
  if(length(parameters$boxplot_plot$group_sample_by)>1){
    group_sample_by = unlist(parameters$boxplot_plot$group_sample_by)
    categoryarray = unlist(parameters$boxplot_plot$categoryarray)
    main_group_split = unlist(parameters$boxplot_plot$main_group_split)

    doc <- doc %>%
      body_add_par("Two-way Boxplots: ", style = "Normal") %>%
      slip_in_text(length(files), style = "Default Paragraph Font", pos = "after") %>%
      slip_in_text("boxplots were generated for all the compounds. The", style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(" samples were grouped by ", style = "Default Paragraph Font", pos = "after") %>%
      slip_in_text(paste0(group_sample_by, collapse =  " and "), style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(". The factor of ", style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(parameters$boxplot_plot$main_group, style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(" was distinguished by the colors. The ", style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(group_sample_by[1], style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(" has ", style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(length(categoryarray), style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(" levels, ", style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(paste0(categoryarray, collapse = ", "), style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(", while the ", style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(group_sample_by[2], style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(" has ", style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(length(main_group_split), style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(" levels, ", style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(paste0(main_group_split, collapse = ", "), style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(". An example boxplot (", style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(files[1,1], style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(") is given in the Figure ", style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(figure_index, style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(".", style = "Default Paragraph Font", pos = "after")
  }else{


    group_sample_by = unlist(parameters$boxplot_plot$group_sample_by)
    categoryarray = unlist(parameters$boxplot_plot$categoryarray)
    main_group_split = unlist(parameters$boxplot_plot$main_group_split)

    doc <- doc %>%
      body_add_par("One-way Boxplots: ", style = "Normal") %>%
      slip_in_text(length(files), style = "Default Paragraph Font", pos = "after") %>%
      slip_in_text("boxplots were generated for all the compounds. The", style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(" samples were grouped by ", style = "Default Paragraph Font", pos = "after") %>%
      slip_in_text(paste0(group_sample_by, collapse =  " and "), style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(". The factor of ", style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(parameters$boxplot_plot$main_group, style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(" was distinguished by the colors. The ", style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(group_sample_by[1], style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(" has ", style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(length(categoryarray), style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(" levels, ", style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(paste0(categoryarray, collapse = ", "), style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(". An example boxplot (", style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(files[1,1], style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(") is given in the Figure ", style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(figure_index, style = "Default Paragraph Font", pos = "after")%>%
      slip_in_text(".", style = "Default Paragraph Font", pos = "after")



  }

  doc <- doc %>%
    body_add_img(src = files[1,1], width = 5, height = 5*(6/9))%>%
    body_add_par(value = paste0("Figure ",figure_index,", an example boxplot: ",files[1,1],"."), style = "table title")


  #  if(parameters$boxplot_plot$data[[1]]$boxmean == "mean"){
  #
  # }



  fpar_ <- fpar(ftext("For the purpose of publication and presentations, MetDA outputs graphics as .svg format. The .svg is vector graphics format, meaning the picture won't get blurred when zoomed out. It can also be easily converted to other formats like .png, .eps and .pdf using online tools. Multiple applications, including Chrome, IE, Inkscape, can open it.", prop = fp_text(italic = TRUE, font.size = 8)))
  doc <- doc %>% body_add_fpar(fpar_)







  doc <- doc %>%
    body_add_par("Output file: ", style = "Normal")%>%
    slip_in_text(paste0(get_fold_seq(project_id, data_ids), collapse ="->"), style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(". ", style = "Default Paragraph Font", pos = "after")



  doc %>% print(target = "report_boxplot.docx")



  return(list(doc = doc, table_index = table_index,figure_index =figure_index))
}

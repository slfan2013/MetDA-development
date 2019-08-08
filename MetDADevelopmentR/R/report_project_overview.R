report_project_overview <- function(project_id = "report 11565112203", table_index = 1, figure_index = 1,doc = NULL) {

  pacman::p_load(data.table, officer, magrittr)

  p_and_f <- get_p_and_f(project_id)


  p <- p_and_f$p
  f <- p_and_f$f

  projectList <- p_and_f$projectList

  project_name <- projectList$project_structure[[1]]$text

  number_of_samples <- nrow(p)
  number_of_compound <- nrow(f)

  colnames_p = colnames(p)
  colnames_f = colnames(f)

  unique_p = sapply(p, function(x){
    unique(x)
  })
  unique_f = sapply(f, function(x){
    unique(x)
  })
  unique_p_num = sapply(unique_p, length)
  unique_f_num = sapply(unique_f, length)


  number_of_sample_info <- ncol(p)
  number_of_compound_info <- ncol(f)

  if(is.null(doc)){
    doc <- read_docx()
  }

  doc <- doc %>%
    body_add_par("Project Overview ", style = "heading 1") %>%
    body_add_par("The project ", style = "Normal") %>%
    slip_in_text(project_name, style = "strong", pos = "after") %>%
    slip_in_text(" contains ", style = "Default Paragraph Font") %>%
    slip_in_text(number_of_samples, style = "strong", pos = "after") %>%
    slip_in_text(" samples and ", style = "Default Paragraph Font") %>%
    slip_in_text(number_of_compound, style = "strong", pos = "after") %>%
    slip_in_text(" compounds. ", style = "Default Paragraph Font")


  doc <- doc %>%
    slip_in_text(number_of_sample_info, style = "strong", pos = "after") %>%
    slip_in_text(" columns of samples informations and ", style = "Default Paragraph Font") %>%
    slip_in_text(number_of_compound_info, style = "strong", pos = "after") %>%
    slip_in_text(" columns of compound information are included in the project. A summary of sample information and compound information are given in Table ", style = "Default Paragraph Font") %>%
    slip_in_text(table_index, style = "Default Paragraph Font") %>%
    slip_in_text(" and ", style = "Default Paragraph Font") %>%
    slip_in_text(" Table ", style = "Default Paragraph Font") %>%
    slip_in_text(table_index + 1, style = "Default Paragraph Font") %>%
    slip_in_text(".", style = "Default Paragraph Font")

  summary_of_sample_info_colnames = c("sample info", "number of unique", "mean (SD)", "levels", "type", 'number of missing')
  summary_of_sample_info = matrix(NA, ncol = length(summary_of_sample_info_colnames),  nrow = ncol(p))

  summary_of_sample_info = data.table(t(sapply(1:nrow(summary_of_sample_info), function(i){
    temp_class = class(p[[i]])
    if(temp_class %in% c("character")){
      temp_levels = unique_p[[i]]
      if(length(temp_levels)>3){
        temp_levels = temp_levels[1:3]
      }
      if(length(temp_levels)==1){

      }else{
        temp_levels = paste0(temp_levels,collapse = ", ")
      }
      if(nchar(temp_levels)>10){
        temp_too_long = TRUE
      }else{
        temp_too_long = FALSE
      }
      if(temp_too_long){
        temp_levels = strtrim(temp_levels, 10)
        temp_levels = paste0(temp_levels, "...")
      }
      return(c(colnames_p[i],unique_p_num[i],"-",temp_levels, "character", sum(is.na(p[[i]]))))

    }else if(temp_class %in% c("number", "integer")){
      temp_levels = unique_p[[i]]
      if(length(temp_levels)>3){
        temp_levels = temp_levels[1:3]
      }
      if(length(temp_levels)==1){

      }else{
        temp_levels = paste0(temp_levels,collapse = ", ")
      }

      if(nchar(temp_levels)>10){
        temp_too_long = TRUE
      }else{
        temp_too_long = FALSE
      }

      if(temp_too_long){
        temp_levels = strtrim(temp_levels, 10)
        temp_levels = paste0(temp_levels, "...")
      }
      return(c(colnames_p[i],unique_p_num[i],paste0(signif(mean(p[[i]], na.rm = TRUE),2), " (",signif(sd(p[[i]], na.rm = TRUE),2),")"),temp_levels, "numeric", sum(is.na(p[[i]]))))

    }

  })))
  colnames(summary_of_sample_info) = summary_of_sample_info_colnames




  summary_of_compound_info_colnames = c("compound info", "number of unique", "mean (SD)", "levels", "type", 'number of missing')
  summary_of_compound_info = matrix(NA, ncol = length(summary_of_compound_info_colnames),  nrow = ncol(f))

  summary_of_compound_info = data.table(t(sapply(1:nrow(summary_of_compound_info), function(i){
    temp_class = class(f[[i]])
    if(temp_class %in% c("character")){
      temp_levels = unique_f[[i]]
      if(length(temp_levels)>3){
        temp_levels = temp_levels[1:3]
      }
      if(length(temp_levels)==1){

      }else{
        temp_levels = paste0(temp_levels,collapse = ", ")
      }
      if(nchar(temp_levels)>10){
        temp_too_long = TRUE
      }else{
        temp_too_long = FALSE
      }
      if(temp_too_long){
        temp_levels = strtrim(temp_levels, 10)
        temp_levels = paste0(temp_levels, "...")
      }
      return(c(colnames_f[i],unique_f_num[i],"-",temp_levels, "character", sum(is.na(f[[i]]))))

    }else if(temp_class %in% c("number", "integer")){
      temp_levels = unique_f[[i]]
      if(length(temp_levels)>3){
        temp_levels = temp_levels[1:3]
      }
      if(length(temp_levels)==1){

      }else{
        temp_levels = paste0(temp_levels,collapse = ", ")
      }
      if(nchar(temp_levels)>10){
        temp_too_long = TRUE
      }else{
        temp_too_long = FALSE
      }
      if(temp_too_long){
        temp_levels = strtrim(temp_levels, 10)
        temp_levels = paste0(temp_levels, "...")
      }

      return(c(colnames_f[i],unique_f_num[i],paste0(signif(mean(f[[i]], na.rm = TRUE),2), " (",signif(sd(f[[i]], na.rm = TRUE),2),")"),temp_levels, "numeric", sum(is.na(f[[i]]))))

    }

  })))
  colnames(summary_of_compound_info) = summary_of_compound_info_colnames






  doc <- doc %>%
    body_add_table(value = summary_of_sample_info, style = "table_template") %>%
    body_add_par(value = paste0("Table ", table_index, ": sample info (", paste0(get_fold_seq(project_id, 'p.csv'), collapse = "->"),")"), style = "table title")%>%
    body_add_table(value = summary_of_compound_info, style = "table_template") %>%
    body_add_par(value = paste0("Table ", table_index+1, ": compound info (",paste0(get_fold_seq(project_id, 'f.csv'), collapse = "->"),")"), style = "table title")






    table_index <- table_index + 2




  doc = report_e(project_id, e_id = "e.csv", table_index = table_index, doc = doc)$doc
  doc %>% print(target = "report_project_overview.docx")


  return(list(doc = doc, table_index = table_index,figure_index =figure_index))




}

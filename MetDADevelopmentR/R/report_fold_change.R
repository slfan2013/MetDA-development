report_fold_change <- function(project_id = "report fold change21565219216", fold_id = "Fold Change1565219311", table_index = 1, figure_index = 1, doc = NULL) {
  pacman::p_load(data.table, officer, magrittr)

  projectUrl <- URLencode(paste0("http://metda:metda@localhost:5985/metda_project/", project_id))
  projectList <- jsonlite::fromJSON(projectUrl, simplifyVector = F)

  id <- sapply(projectList$project_structure, function(x) x$id)
  parent <- sapply(projectList$project_structure, function(x) x$parent)

  data_ids <- id[parent == fold_id]


  result_summary <- read.csv(
    paste0(
      "http://metda:metda@localhost:5985/metda_project/",
      project_id,
      "/", data_ids
    ),
    row.names = 1
  )



  parameters <- projectList$project_structure[[which(id %in% fold_id)]]$parameter



  fold_seq <- get_fold_seq(project_id, parameters$activate_data_id)

  if (is.null(doc)) {
    doc <- read_docx()
  }




  doc <- doc %>%
    body_add_par("Fold Change Result Summary ", style = "heading 1") %>%
    body_add_par("Input Dataset: ", style = "Normal") %>%
    slip_in_text(paste0(fold_seq, collapse = "->"), style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(".", style = "Default Paragraph Font", pos = "after")

  doc <- doc %>%
    body_add_par("Treatment Group: ", style = "Normal") %>%
    slip_in_text(parameters$treatment_group, style = "Default Paragraph Font", pos = "after") %>%
    slip_in_text(".", style = "Default Paragraph Font", pos = "after")


  group_levels = unlist(strsplit(parameters$treatment_group_levels, "\\|\\|"))
  doc <- doc %>%
    body_add_par("Fold Change Calculation: ", style = "Normal") %>%
    slip_in_text(paste0("the ",parameters$mean_or_median," of ", group_levels[1]," devided by the ", parameters$mean_or_median, " of ", group_levels[2]), style = "strong", pos = "after") %>%
    slip_in_text(".", style = "Default Paragraph Font", pos = "after")


  num_comp = nrow(result_summary)
  num_increase = sum(result_summary$fold_changes>1, na.rm = TRUE)
  num_decrease = sum(result_summary$fold_changes<1, na.rm = TRUE)
  num_increase_20 = sum(result_summary$fold_changes>1.2, na.rm = TRUE)
  num_decrease_20 = sum(result_summary$fold_changes<1/1.2, na.rm = TRUE)
  num_increase_50 = sum(result_summary$fold_changes>1.5, na.rm = TRUE)
  num_decrease_50 = sum(result_summary$fold_changes<1/1.5, na.rm = TRUE)
  num_increase_100 = sum(result_summary$fold_changes>2, na.rm = TRUE)
  num_decrease_100 = sum(result_summary$fold_changes<1/2, na.rm = TRUE)


  slices = cut(result_summary$fold_changes, c(0,1/2,1/1.5,1/1.2,1,1.2,1.5,2,Inf))

  labels = paste0(signif(table(slices)/nrow(result_summary),2)*100, "%")

  pie_colors = c("#3456eb","#3474eb","#348ceb","#34a8eb","#ebae34", "#eb8634","#eb6b34","#eb3434")



  table_index = table_index+2
  figure_index = figure_index+1
  doc <- doc %>%
    body_add_par("Result Summary: ", style = "Normal")%>%
    slip_in_text("out of ", style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(num_comp, style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(" compounds, there are ", style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(num_increase, style = "strong", pos = "after")%>%
    slip_in_text(" (", style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(signif(num_increase/num_comp, 2), style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text("%) increased from ", style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(group_levels[1], style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(" to ", style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(group_levels[2], style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(" with fold_change greater than 1, while ", style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(num_decrease, style = "strong", pos = "after")%>%
    slip_in_text(" (", style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(signif(num_decrease/num_comp, 2), style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text("%) decreased.", style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(". Table ", style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(table_index-1, style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(" and Table ")%>%
    slip_in_text(table_index, style = "Default Paragraph Font", pos = "after")%>%
    slip_in_text(" show the 10 compounds increased and decreased the most.", style = "Default Paragraph Font", pos = "after")%>%
    body_add_table(value = result_summary[order(result_summary$fold_changes, decreasing = TRUE)[1:10],], style = "table_template")%>%
    body_add_par(value = paste0("Table ", table_index-1, ": most increased compounds (", paste0(get_fold_seq(project_id, data_ids), collapse = "->"), ")"), style = "table title")%>%
    body_add_table(value = result_summary[order(result_summary$fold_changes, decreasing = FALSE)[1:10],], style = "table_template")%>%
    body_add_par(value = paste0("Table ", table_index, ": most decreased compounds (", paste0(get_fold_seq(project_id, data_ids), collapse = "->"), ")"), style = "table title")



  # produce an emf file containing the ggplot
  svg(filename="pie_chart.svg",
      width=5*3,
      height=4*3,
      pointsize=8*3)
  pie(table(slices),labels  =labels , col = pie_colors,radius=0.7,cex=0.8)
  legend("bottomright",legend=c("Decrease > 100%","              50~100%","                20~50%","                  0~20%","Increase    0~20%","                20~50%","              50~100%","                 > 100%"),bty="n", fill=pie_colors,cex=0.8)
  dev.off()
  doc <- doc %>%
    body_add_img(src = "pie_chart.svg", width = 5, height = 4)%>%
    body_add_par(value = paste0("Figure ", figure_index, ": Detailed summary of Fold Changes."), style = "table title")%>%
    body_add_par(paste0("Figure ",figure_index," shows a more detailed summary of fold changes, where the percentage of compounds with 0~20%, 20~50% and more than 100% increasing and decreasing are shown. "), style = "Normal", pos = "after")



  doc %>% print(target = "report_fold_change.docx")



  return(list(doc = doc, table_index = table_index,figure_index =figure_index))
}

# generate_report
project_id <- "aaa1566880884"


projectUrl <- URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/metda_project/", project_id))
projectList <- jsonlite::fromJSON(projectUrl, simplifyVector = FALSE)

project_structure <- projectList$project_structure



icons <- sapply(project_structure, function(x) x$icon)
project_structure_folders_only <- project_structure[icons == "fa fa-folder"]


doc = NULL
table_index = 1
figure_index = 1
for (i in 1:length(project_structure_folders_only)) {

  parameters <- project_structure_folders_only[[i]]$parameter

  if (!is.null(parameters)) {
    folder_id = project_structure_folders_only[[i]]$id
    object = call_fun(parameter = list(project_id = project_id, fold_id = folder_id, table_index = table_index, figure_index = figure_index, type = "all", parameters = parameters, report_generator = TRUE, fun_name = paste0("report_", parameters$fun_name)))


    doc = object$doc
    table_index = object$table_index
    figure_index = object$figure_index
  }


}









doc %>% print(target = "report_a.docx")

# result = list(a = defination_of_missing_value)


# http://localhost:5656/ocpu/tmp/x08f655c87c/

pacman::p_load(data.table)

data = call_fun(parameter = list(project_id=project_id,activate_data_id=activate_data_id,fun_name="read_data_from_projects"))
e = data$e
f = data$f
p = data$p

# Summarize the information about missing values.
# data = wcmc::read_data("GCTOF_Abraham_CM_v_M_heart_NoSwim.xlsx")
# e = data$e_matrix
# f = data$f
# p = data$p


## Here, calculate the p-values and FDRs.






groups = factor(p[[treatment_group]])
levels = levels(groups)



if(!length(levels)==2){
  stop(paste0("The Treatment Group (",treatment_group,") you've selected has more (or less) than 2 level(s). It has ",length(levels)," level(s)."))
}

candicate_levels = unlist(strsplit(treatment_group_levels, "\\|\\|"))
if(all(levels %in% candicate_levels)){
  groups = factor(p[[treatment_group]], levels = candicate_levels)
}


avg_fun = get(mean_or_median)

means1 = apply(e[,groups %in% levels[1]],1,function(x){
  avg_fun(x, na.rm = TRUE)
})
means2 = apply(e[,groups %in% levels[2]],1,function(x){
  avg_fun(x, na.rm = TRUE)
})
fold_changes = means1/means2

result = data.table(index = 1:nrow(f), label = f$label, fold_changes = fold_changes)




report_html = call_fun(parameter = list(
  treatment_group = treatment_group,
  treatment_group_levels = treatment_group_levels,
  mean_or_median = mean_or_median,
  type = "result_summary",
  result = result,
  fun_name = "report_fold_change"
))$text_html




# report_html = paste0("<h4>Fold Change was calculated using the ",mean_or_median, " average.")




# result =list(
#   result = result,
#   report_html =report_html
# )

# result_dataset =  aggregate_p_f_e(p, f, e)
fwrite(result, "fold_change.csv", col.names = TRUE)
# summary_data = data.table(index = 1:nrow(iris), iris)
# fwrite(summary_data, "summary_data.csv", col.names = TRUE)


result = list(results_description = report_html)



# if(grepl("temp_project_", project_id)){
#
#   projectUrl <- URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/metda_project/", project_id))
#   projectList <- jsonlite::fromJSON(projectUrl, simplifyVector = T)
#   temp_time = substr(project_id, nchar(project_id)-10+1, nchar(project_id))
#
#   fold_id = paste0("Fold Change", temp_time)
#   data1_id = "fold_change.csv"
#
#
#   projectList[["project_structure"]] <- list(
#     list(
#       id = project_id,
#       parent = "#",
#       text = "",
#       icon = "fa fa-folder"
#     ),
#     list(
#       id = "e.csv",
#       parent = project_id,
#       text = "e.csv",
#       icon = "fa fa-file-excel-o",
#       with_attachment = TRUE,
#       epf = "e",
#       parameter = list(
#         r_function = "create_new_project",
#         parameters = ""
#       )
#     ),
#     list(
#       id = "f.csv",
#       parent = project_id,
#       text = "f.csv",
#       icon = "fa fa-file-excel-o",
#       with_attachment = TRUE,
#       epf = "f",
#       parameter = list(
#         r_function = "create_new_project",
#         parameters = ""
#       )
#     ),
#     list(
#       id = "p.csv",
#       parent = project_id,
#       text = "p.csv",
#       icon = "fa fa-file-excel-o",
#       with_attachment = TRUE,
#       epf = "p",
#       parameter = list(
#         r_function = "create_new_project",
#         parameters = ""
#       )
#     ),
#     list(
#       id = fold_id,
#       parent = project_id,
#       text = "Student t-test",
#       icon = "fa fa-folder",
#       with_attachment = TRUE,
#       epf = "p",
#       parameter = list(
#         treatment_group = treatment_group,
#         treatment_group_levels = treatment_group_levels,
#         mean_or_median = mean_or_median,
#         project_id = project_id,
#         fun_name = fun_name,
#         activate_data_id = activate_data_id
#       ),
#       files_sources = "",
#       files_types = "",
#       epf_index = 1
#     ),
#     list(
#       id = data1_id,
#       parent = fold_id,
#       text = data1_id,
#       icon = "fa fa-file-excel-o",
#       with_attachment = TRUE,
#       epf = "e",
#       parameter = list(
#         activate_data_id= "e.csv"
#       )
#     )
#   )
#
#
#   attname = c('p.csv', 'f.csv', 'e.csv', data1_id)
#   write.csv(p, 'p.csv')
#   write.csv(f, 'f.csv')
#   write.csv(e, 'e.csv')
#   content_types = c("application/vnd.ms-excel","application/vnd.ms-excel","application/vnd.ms-excel","application/vnd.ms-excel")
#   projectList[["_attachments"]] <- list()
#   for (i in 1:length(attname)) {
#     projectList[["_attachments"]][[attname[i]]] <- list(
#       content_type = content_types[i],
#       data = strsplit(markdown:::.b64EncodeFile(attname[i]), "base64,")[[1]][2]
#     )
#   }
#   RCurl::getURL(projectUrl, customrequest = "PUT", httpheader = c("Content-Type" = "application/json"), postfields = jsonlite::toJSON(projectList, auto_unbox = TRUE, force = TRUE))
#
#   report_fold_change(project_id, fold_id)
#
#
#   filename = "report_fold_change"
#   suffix = '.docx'
#
#
#
#
#
#   result = list(results_description = report_html, report_base64 = as.character(RCurl::base64Encode(readBin(paste0(filename, suffix), "raw", file.info(paste0(filename, suffix))[1, "size"]), "txt")))
#
#
#
# }else{
#   result = list(results_description = report_html)
# }














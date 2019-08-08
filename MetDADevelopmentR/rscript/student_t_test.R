# result = list(a = defination_of_missing_value)


# http://localhost:5656/ocpu/tmp/x08f655c87c/

pacman::p_load(data.table)


data = read_data_from_projects(project_id, activate_data_id)
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

alternative = 'two.sided'
p_values = apply(e,1,function(x){
  tryCatch(t.test(x~groups, alternative = alternative, var.equal = equal_variance_assumption)$p.value,error = function(e){return(1)})
})


result = data.table(index = 1:nrow(f), label = f$label, p_values = p_values, p_values_adjusted = p.adjust(p_values, method = fdr))


report_html = paste0("<h4>Student's t test (",ifelse(equal_variance_assumption,"assuming equal variance","not assuming equal variance"),") was performed on each compound to test if the mean average of <code>",levels[1],"</code> ",ifelse(alternative=='two.sided',"different from", ifelse(alternative=='greater', "greater than", "less than")), " <code>", levels[2],"</code>. Out of <code>",nrow(f),"</code> compounds, <code>", sum(result$p_values<0.05,na.rm = TRUE),"</code> are significant with p_value < 0.05. To control the false disvoery rate (FDR), the <code>",fdr,"</code> procedure was used and <code>",sum(result$p_values_adjusted<0.05,na.rm = TRUE),"</code> compounds are significant after FDR correction.</h4>")




# result =list(
#   result = result,
#   report_html =report_html
# )

# result_dataset =  aggregate_p_f_e(p, f, e)
fwrite(result, "student_t_test.csv", col.names = TRUE)
# summary_data = data.table(index = 1:nrow(iris), iris)
# fwrite(summary_data, "student_t_test.csv", col.names = TRUE)


if(grepl("temp_project_", project_id)){

  projectUrl <- URLencode(paste0("http://metda:metda@localhost:5985/metda_project/", project_id))
  projectList <- jsonlite::fromJSON(projectUrl, simplifyVector = T)
  temp_time = substr(project_id, nchar(project_id)-10+1, nchar(project_id))

  fold_id = paste0("Student t-test", temp_time)
  data1_id = "student_t_test.csv"


  projectList[["project_structure"]] <- list(
    list(
      id = project_id,
      parent = "#",
      text = "",
      icon = "fa fa-folder"
    ),
    list(
      id = "e.csv",
      parent = project_id,
      text = "e.csv",
      icon = "fa fa-file-excel-o",
      with_attachment = TRUE,
      epf = "e",
      parameter = list(
        r_function = "create_new_project",
        parameters = ""
      )
    ),
    list(
      id = "f.csv",
      parent = project_id,
      text = "f.csv",
      icon = "fa fa-file-excel-o",
      with_attachment = TRUE,
      epf = "f",
      parameter = list(
        r_function = "create_new_project",
        parameters = ""
      )
    ),
    list(
      id = "p.csv",
      parent = project_id,
      text = "p.csv",
      icon = "fa fa-file-excel-o",
      with_attachment = TRUE,
      epf = "p",
      parameter = list(
        r_function = "create_new_project",
        parameters = ""
      )
    ),
    list(
      id = fold_id,
      parent = project_id,
      text = "Student t-test",
      icon = "fa fa-folder",
      with_attachment = TRUE,
      epf = "p",
      parameter = list(
        treatment_group = treatment_group,
        equal_variance_assumption = equal_variance_assumption,
        fdr = fdr,
        project_id = project_id,
        fun_name = fun_name,
        activate_data_id = activate_data_id
      ),
      files_sources = "",
      files_types = "",
      epf_index = 1
    ),
    list(
      id = data1_id,
      parent = fold_id,
      text = data1_id,
      icon = "fa fa-file-excel-o",
      with_attachment = TRUE,
      epf = "e",
      parameter = list(
        activate_data_id= "e.csv"
      )
    )
  )


  attname = c('p.csv', 'f.csv', 'e.csv', data1_id)
  write.csv(p, 'p.csv')
  write.csv(f, 'f.csv')
  write.csv(e, 'e.csv')
  content_types = c("application/vnd.ms-excel","application/vnd.ms-excel","application/vnd.ms-excel","application/vnd.ms-excel")
  projectList[["_attachments"]] <- list()
  for (i in 1:length(attname)) {
    projectList[["_attachments"]][[attname[i]]] <- list(
      content_type = content_types[i],
      data = strsplit(markdown:::.b64EncodeFile(attname[i]), "base64,")[[1]][2]
    )
  }
  RCurl::getURL(projectUrl, customrequest = "PUT", httpheader = c("Content-Type" = "application/json"), postfields = jsonlite::toJSON(projectList, auto_unbox = TRUE, force = TRUE))

  report_student_t_test(project_id, fold_id)


  filename = "report_student_t_test"
  suffix = '.docx'





  result = list(results_description = report_html, report_base64 = as.character(RCurl::base64Encode(readBin(paste0(filename, suffix), "raw", file.info(paste0(filename, suffix))[1, "size"]), "txt")))



}else{
  result = list(results_description = report_html)
}













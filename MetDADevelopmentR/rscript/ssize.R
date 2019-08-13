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


e = call_fun(parameter = list(e = e, fun_name="deal_with_missing_values"))


exp.sd = log2(apply(e, 1, function(x){
  sqrt(anova(lm(x ~ groups))["Residuals", "Mean Sq"])
}))

n = as.numeric(n)
delta = as.numeric(delta)
sig.level = as.numeric(sig_level)
power = as.numeric(power)/100

all.power <- pow(sd=exp.sd, n=n, delta=log2(delta),
                 sig.level=sig.level)
power.plot(all.power, lwd=2, col="blue")
xmax <- par("usr")[2]-0.05; ymax <- par("usr")[4]-0.05
legend(x=xmax, y=ymax,
       legend= strsplit( paste("n=",n,",",
                               "fold change=",delta,",",
                               "alpha=", sig.level, ",",
                               "# genes=", nobs(exp.sd), sep=''), "," )[[1]],
       xjust=1, yjust=1, cex=1.0)
title("Power to Detect 2-Fold Change")




all.size <- ssize(sd=exp.sd, delta=log2(delta),
                  sig.level=sig.level, power=power)
ssize.plot(all.size, lwd=2, col="magenta", xlim=c(1,20))
xmax <- par("usr")[2]-1; ymin <- par("usr")[3] + 0.05
legend(x=xmax, y=ymin,
       legend= strsplit( paste("fold change=",delta,",",
                               "alpha=", sig.level, ",",
                               "power=",power,",",
                               "# genes=", nobs(exp.sd), sep=''), "," )[[1]],
       xjust=1, yjust=0, cex=1.0)
title("Sample Size to Detect 2-Fold Change")



all.delta <- delta(sd=exp.sd, power=power, n=n,
                   sig.level=sig.level)
delta.plot(all.delta, lwd=2, col="magenta", xlim=c(1,10), ylim = c(0,0.03))
xmax <- par("usr")[2]-1; ymin <- par("usr")[3] + 0.05
legend(x=xmax, y=ymin,
       legend= strsplit( paste("n=",n,",",
                               "alpha=", sig.level, ",",
                               "power=",power,",",
                               "# genes=", nobs(exp.sd), sep=''), "," )[[1]],
       xjust=1, yjust=0, cex=1.0)
title("Fold Change to Achieve 80% Power")





result = data.table(index = 1:nrow(f), label = f$label, p_values = p_values, p_values_adjusted = p.adjust(p_values, method = fdr))


report_html = paste0("<h4>Student's t test (",ifelse(equal_variance_assumption,"assuming equal variance","not assuming equal variance"),") was performed on each compound to test if the mean average of <code>",levels[1],"</code> ",ifelse(alternative=='two.sided',"different from", ifelse(alternative=='greater', "greater than", "less than")), " <code>", levels[2],"</code>. Out of <code>",nrow(f),"</code> compounds, <code>", sum(result$p_values<0.05,na.rm = TRUE),"</code> are significant with p_value < 0.05. To control the false disvoery rate (FDR), the <code>",fdr,"</code> procedure was used and <code>",sum(result$p_values_adjusted<0.05,na.rm = TRUE),"</code> compounds are significant after FDR correction.</h4>")




# result =list(
#   result = result,
#   report_html =report_html
# )

# result_dataset =  aggregate_p_f_e(p, f, e)
fwrite(result, "ssize.csv", col.names = TRUE)
# summary_data = data.table(index = 1:nrow(iris), iris)
# fwrite(summary_data, "ssize.csv", col.names = TRUE)


# if(grepl("temp_project_", project_id)){
#
#   projectUrl <- URLencode(paste0("http://metda:metda@localhost:5985/metda_project/", project_id))
#   projectList <- jsonlite::fromJSON(projectUrl, simplifyVector = T)
#   temp_time = substr(project_id, nchar(project_id)-10+1, nchar(project_id))
#
#   fold_id = paste0("Student t-test", temp_time)
#   data1_id = "ssize.csv"
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
#         equal_variance_assumption = equal_variance_assumption,
#         fdr = fdr,
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
#   report_ssize(project_id, fold_id)
#
#
#   filename = "report_ssize"
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
#
# }
result = list(results_description = report_html)












# result = list(a = defination_of_missing_value)


# http://localhost:5656/ocpu/tmp/x08f655c87c/

pacman::p_load(data.table)


f = read.csv(paste0(
  "http://metda:metda@localhost:5985/metda_project/",
  project_id,
  "/f.csv"
))
p = read.csv(paste0(
  "http://metda:metda@localhost:5985/metda_project/",
  project_id,
  "/p.csv"
))
e = data.matrix(read.csv(
  paste0(
    "http://metda:metda@localhost:5985/metda_project/",
    project_id,
    "/",activate_data_id
  )
))[, -1]

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
avg_fun = get(mean_or_median)

means1 = apply(e[,groups %in% levels[1]],1,function(x){
  avg_fun(x, na.rm = TRUE)
})
means2 = apply(e[,groups %in% levels[2]],1,function(x){
  avg_fun(x, na.rm = TRUE)
})
fold_changes = means1/means2

result = data.table(index = 1:nrow(f), label = f$label, fold_changes = fold_changes)


report_html = paste0("<h4>Fold Change was calculated using the ",mean_or_median, " average.")




# result =list(
#   result = result,
#   report_html =report_html
# )

# result_dataset =  aggregate_p_f_e(p, f, e)
fwrite(result, "summary_data.csv", col.names = TRUE)
# summary_data = data.table(index = 1:nrow(iris), iris)
# fwrite(summary_data, "summary_data.csv", col.names = TRUE)


result = list(results_description = report_html)

















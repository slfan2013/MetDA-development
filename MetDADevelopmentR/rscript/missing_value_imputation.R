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


## Here, we want to replace missing values.


result_dataset =  aggregate_p_f_e(p, f, e)
fwrite(result_dataset, "result_dataset.csv", col.names = FALSE)
summary_data = data.table(index = 1:nrow(iris), iris)
fwrite(summary_data, "summary_data.csv", col.names = TRUE)


result = list(results_description = "Here is the missing value summary.")

# result = list(a = defination_of_missing_value)


# http://localhost:5656/ocpu/tmp/x08f655c87c/

data = jsonlite::fromJSON(paste0("http://metda:metda@localhost:5985/metda_project/",project_id))

e = data$e
f = data$f
p = data$p

#

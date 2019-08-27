# get_userinfo



data_frame = read.csv(URLencode(paste0("https://metda.fiehnlab.ucdavis.edu/db/metda_userinfo/" , user_id, "/metda_userinfo_" , user_id, ".csv")), stringsAsFactors = FALSE)
data = do.call("cbind",sapply(data_frame,function(x) x, simplify = F))

result = list(data = rbind(colnames(data),data))
#
#
# oo = read.csv(URLencode(paste0("https://metda.fiehnlab.ucdavis.edu/db/metda_userinfo/" , user_id, "/metda_userinfo_" , user_id, ".csv")), stringsAsFactors = FALSE)

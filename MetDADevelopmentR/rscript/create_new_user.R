# create_new_user

# get the list (including styles) first.
initiateUrl <- URLencode("http://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/metda_userinfo/initiate")
initiateList <- jsonlite::fromJSON(initiateUrl, simplifyVector = FALSE)
table_name = paste0("metda_userinfo_",new_user_id,".csv")

data.table::fwrite(data.table::fread(URLencode("http://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/metda_userinfo/initiate/metda_userinfo_initiate.csv")),table_name)


projectUrl <- URLencode(paste0("http://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/metda_userinfo"))

new_user_list = initiateList
new_user_list$`_id` = new_user_id
new_user_list$`_rev` = NULL
new_user_list$`_attachments`[["metda_userinfo_initiate.csv"]] = NULL


new_user_list$`_attachments`[[table_name]] <- list(
  content_type = "application/vnd.ms-excel",
  data = strsplit(markdown:::.b64EncodeFile(table_name), "base64,")[[1]][2]
)






result = RCurl::getURL(projectUrl, customrequest = "POST", httpheader = c("Content-Type" = "application/json"), postfields = jsonlite::toJSON(new_user_list, auto_unbox = TRUE, force = TRUE))

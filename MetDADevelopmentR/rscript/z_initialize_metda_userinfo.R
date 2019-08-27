new_user_id = 'initiate'

# get the list (including styles) first.
initiateUrl <- URLencode("http://localhost:5985/metda_userinfo/initiate")
initiateList <- jsonlite::fromJSON(initiateUrl, simplifyVector = FALSE)
table_name = paste0("metda_userinfo_initiate.csv")




metda_userinfo_data = data.table::fread(URLencode("http://localhost:5985/metda_userinfo/initiate/metda_userinfo_initiate.csv"))

metda_userinfo_data = metda_userinfo_data[0,]

data.table::fwrite(metda_userinfo_data,table_name)







projectUrl <- URLencode(paste0("http://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/metda_userinfo"))


new_user_list = initiateList
new_user_list$`_id` = new_user_id
new_user_list$`_rev` = NULL
# new_user_list$`_attachments`[[paste0("metda_userinfo_initiate.csv")]] = NULL


new_user_list$`_attachments`[[table_name]] <- list(
  content_type = "application/vnd.ms-excel",
  data = strsplit(markdown:::.b64EncodeFile(table_name), "base64,")[[1]][2]
)



result = RCurl::getURL(projectUrl, customrequest = "POST", httpheader = c("Content-Type" = "application/json"), postfields = jsonlite::toJSON(new_user_list, auto_unbox = TRUE, force = TRUE))




if(grepl("conflict", result)){
  initiateUrl <- URLencode("http://metda.fiehnlab.ucdavis.edu/db/metda_userinfo/initiate")
  initiateList <- jsonlite::fromJSON(initiateUrl, simplifyVector = FALSE)
  RCurl::getURL(paste0("http://metda.fiehnlab.ucdavis.edu/db/metda_userinfo/initiate?rev=",initiateList$`_rev`), customrequest = "DELETE", httpheader = c("Content-Type" = "application/json"))
}

result



########## DELETE THE PREVIOUS DEFAULT ##########

# initiateUrl <- URLencode("http://metda.fiehnlab.ucdavis.edu/db/metda_userinfo/initiate")
# initiateList <- jsonlite::fromJSON(initiateUrl, simplifyVector = FALSE)
# RCurl::getURL(paste0("http://metda.fiehnlab.ucdavis.edu/db/metda_userinfo/initiate?rev=",initiateList$`_rev`), customrequest = "DELETE", httpheader = c("Content-Type" = "application/json"))

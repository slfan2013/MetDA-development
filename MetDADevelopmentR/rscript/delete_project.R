# delete_project
# user_id = "user1566419973501"
# project_id = "test1566420011"


# change the .csv first then change the structure.
userUrl <- URLencode(paste0("http://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/metda_userinfo/",user_id))
userList <- jsonlite::fromJSON(userUrl, simplifyVector = FALSE)


userinfo <- data.table::fread(URLencodepaste0("http://metda.fiehnlab.ucdavis.edu/db/metda_userinfo/", user_id, "/metda_userinfo_", user_id, ".csv")))
userinfo = userinfo[!userinfo$project_id %in% project_id,]


write.csv(userinfo, "metda_userinfo.csv", row.names = FALSE)
userList$`_attachments`[[paste0("metda_userinfo_",user_id,".csv")]] <- list(
  content_type = "application/vnd.ms-excel",
  data = strsplit(markdown:::.b64EncodeFile("metda_userinfo.csv"), "base64,")[[1]][2]
)




RCurl::getURL(userUrl, customrequest = "PUT", httpheader = c("Content-Type" = "application/json"), postfields = jsonlite::toJSON(userList, auto_unbox = TRUE, force = TRUE))

result = TRUE

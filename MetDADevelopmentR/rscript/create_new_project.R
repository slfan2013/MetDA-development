# create_new_project <- function(
#                                user_id, # = 'slfan',
#                                new_name, # = 'a',
#                                temp_project_id # = 'temp_project_1560370470'
# ) {


# 1 read the old project.
projectUrl_old <- URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/metda_project/", temp_project_id))
projectList_old <- jsonlite::fromJSON(projectUrl_old, simplifyVector = F)

# 2 create a new project
new_id <- paste0(new_name, as.integer(Sys.time()))
projectUrl_new <- URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/metda_project/", new_id))
projectList_new <- list(a = new_id, b = "1-967a00dff5e02add41819138abb3284f")
names(projectList_new)[1:2] <- c("_id", "_rev")
RCurl::getURL(projectUrl_new, customrequest = "PUT", httpheader = c("Content-Type" = "application/json"), postfields = jsonlite::toJSON(projectList_new, auto_unbox = TRUE, force = TRUE))

projectUrl <- URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/metda_project/", new_id))
projectList <- jsonlite::fromJSON(projectUrl)

attname <- names(projectList_old$`_attachments`)
projectList[["_attachments"]] <- list()
for (i in 1:length(attname)) {
  download.file(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/metda_project/", temp_project_id, "/", gsub("\\+", "%2B", attname[i]))), attname[i], mode = "wb")
  projectList[["_attachments"]][[attname[i]]] <- list(
    content_type = projectList_old[["_attachments"]][[i]]$content_type,
    data = strsplit(markdown:::.b64EncodeFile(attname[i]), "base64,")[[1]][2]
  )
}

# current_parameters <- get_current_parameters(as.list(match.call())[-1])

current_parameters <- call_fun(list(current_parameters = as.list(match.call())[-1], fun_name = "get_current_parameters"))


projectList[["project_structure"]] <- list(
  list(
    id = new_id,
    parent = "#",
    text = new_name,
    icon = "fa fa-folder"
  ),
  list(
    id = "e.csv",
    parent = new_id,
    text = "e.csv",
    icon = "fa fa-file-excel-o",
    with_attachment = TRUE,
    epf = "e",
    parameter = list(
      r_function = "create_new_project",
      parameters = current_parameters
    )
  ),
  list(
    id = "f.csv",
    parent = new_id,
    text = "f.csv",
    icon = "fa fa-file-excel-o",
    with_attachment = TRUE,
    epf = "f",
    parameter = list(
      r_function = "create_new_project",
      parameters = current_parameters
    ),
    subset = c("compound")
  ),
  list(
    id = "p.csv",
    parent = new_id,
    text = "p.csv",
    icon = "fa fa-file-excel-o",
    with_attachment = TRUE,
    epf = "p",
    parameter = list(
      r_function = "create_new_project",
      parameters = current_parameters
    ),
    subset = c("sample")
  )
)
#   print(jsonlite::toJSON(projectList,auto_unbox = TRUE, force = TRUE))
#
#
# print(ooo)
# print(jsonlite::toJSON(projectList,auto_unbox = TRUE, force = TRUE))
#
#

RCurl::getURL(projectUrl, customrequest = "PUT", httpheader = c("Content-Type" = "application/json"), postfields = jsonlite::toJSON(projectList, auto_unbox = TRUE, force = TRUE))


# 3. update the userinfo slfan
userinfo <- data.table::fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/metda_userinfo/", user_id, "/metda_userinfo_", user_id, ".csv")))

# new project table
new_project_table <- data.table::data.table(project_id = new_id, project_name = new_name, create_time = as.character(Sys.time()))
userinfo <- rbind(userinfo, new_project_table)
userinfoUrl <- URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/metda_userinfo/", user_id))
userinfoList <- jsonlite::fromJSON(userinfoUrl)
names(userinfoList)[1:2] <- c("_id", "_rev")


table_name = paste0("metda_userinfo_",user_id,".csv")

write.csv(userinfo, table_name, row.names = FALSE)

userinfoList$`_attachments`[[table_name]] <- list(
  content_type = "application/vnd.ms-excel",
  data = strsplit(markdown:::.b64EncodeFile(table_name), "base64,")[[1]][2]
)

RCurl::getURL(userinfoUrl, customrequest = "PUT", httpheader = c("Content-Type" = "application/json"), postfields = jsonlite::toJSON(userinfoList, auto_unbox = TRUE, force = TRUE))







result = list(
  status = "good",
  new_id = new_id
)
# }

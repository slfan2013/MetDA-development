# z_get_initiate_from_couchdb


old_user_id = "initiate"
plot_name = "plsda_score_plot_layout"
new_plot_name = "plsda_score_plot_layout"
# get the list (including styles) first.
oldUrl <- URLencode(paste0("http://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/metda_userinfo/",old_user_id))
oldList <- jsonlite::fromJSON(oldUrl, simplifyVector = FALSE)




new_user_id = 'initiate'

# get the list (including styles) first.
initiateUrl <- URLencode(paste0("http://localhost:5985/metda_userinfo/",new_user_id))
initiateList <- jsonlite::fromJSON(initiateUrl, simplifyVector = FALSE)


initiateList[[new_plot_name]] = oldList[[plot_name]]




RCurl::getURL(initiateUrl, customrequest = "PUT", httpheader = c("Content-Type" = "application/json"), postfields = jsonlite::toJSON(initiateList, auto_unbox = TRUE, force = TRUE))


result = TRUE



old_user_id = "user1566659208940"
plot_name = "heatmap_plot_layout"
new_plot_name = "heatmap_plot_layout"
# get the list (including styles) first.
oldUrl <- URLencode(paste0("http://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/metda_userinfo/",old_user_id))
oldList <- jsonlite::fromJSON(oldUrl, simplifyVector = FALSE)




new_user_id = 'initiate'

# get the list (including styles) first.
initiateUrl <- URLencode("http://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/metda_userinfo/initiate")
initiateList <- jsonlite::fromJSON(initiateUrl, simplifyVector = FALSE)


initiateList[[new_plot_name]] = oldList[[plot_name]]
# initiateList[[new_plot_name]]$shapes = list(
#   list(
#     type='rect',
#     fillcolor= "transparent",
#     line =  list(
#       color= "rgba(0,0,0,1)",
#       width= 1,
#       dash= "solid"
#     ),
#     yref="paper",
#     xref="paper",
#     x0=0,
#     x1=1,
#     y0=0,
#     y1= 1
#   )
# )





RCurl::getURL(initiateUrl, customrequest = "PUT", httpheader = c("Content-Type" = "application/json"), postfields = jsonlite::toJSON(initiateList, auto_unbox = TRUE, force = TRUE))


result = TRUE



# oldList[[plot_name]]$colorscale = "Viridis"
oldList[[new_plot_name]] = oldList[[plot_name]]
RCurl::getURL(oldUrl, customrequest = "PUT", httpheader = c("Content-Type" = "application/json"), postfields = jsonlite::toJSON(oldList, auto_unbox = TRUE, force = TRUE))


########## DELETE THE PREVIOUS DEFAULT ##########

# initiateUrl <- URLencode("http://metda.fiehnlab.ucdavis.edu/db/metda_userinfo/initiate")
# initiateList <- jsonlite::fromJSON(initiateUrl, simplifyVector = FALSE)
# RCurl::getURL(paste0("http://metda.fiehnlab.ucdavis.edu/db/metda_userinfo/initiate?rev=",initiateList$`_rev`), customrequest = "DELETE", httpheader = c("Content-Type" = "application/json"))




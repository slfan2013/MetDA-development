test = function(){
  library(magrittr)
  my_doc <- read_docx()
  styles_info(my_doc)

  src <- tempfile(fileext = ".png")
  png(filename = src, width = 5, height = 6, units = 'in', res = 300)
  barplot(1:10, col = 1:10)
  dev.off()

  my_doc <- my_doc %>%
    body_add_img(src = src, width = 5, height = 6, style = "centered") %>%
    body_add_par("Hello world!", style = "Normal") %>%
    body_add_par("", style = "Normal") %>% # blank paragraph
    body_add_table(iris, style = "table_template")

  return(my_doc)
}


oo = test()


oo <- my_doc %>%
  body_add_img(src = src, width = 5, height = 6, style = "centered") %>%
  body_add_par("Hello world!", style = "Normal") %>%
  body_add_par("", style = "Normal") %>% # blank paragraph
  body_add_table(iris, style = "table_template")



print(oo, target = tempfile(fileext = ".docx") )

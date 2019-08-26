# Convenience function to convert html codes
html2txt <- function(str) {
  xpathApply(htmlParse(str, asText=TRUE),
             "//body//text()",
             xmlValue)[[1]]
}

artical_limitation = 30

pacman::p_load(jsonlite, xml2, httr, XML, data.table, textreadr, gsubfn)



interested_term = " ssize "
interested_term_url = GET(URLencode(paste0('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pmc&term="',interested_term,'"&retmax=100')))$content
interested_term_obj = read_xml(interested_term_url)
# interested_term_text = xml_text(, trim= TRUE)

interested_term_list = as_list(interested_term_obj)

interested_term_id_list = unlist(interested_term_list $eSearchResult$IdList)
interested_term_id_list = interested_term_id_list[1:artical_limitation]


# # interested_term_id_list_power = interested_term_id_list
# # interested_term_id_list_metabolomics = interested_term_id_list
# # interested_term_id_list_FDR = interested_term_id_list
#
# intersect(intersect(interested_term_id_list_power, interested_term_id_list_metabolomics), interested_term_id_list_FDR)
#
#
# '5974217' %in% interested_term_id_list_power



# now we've found the id list. Now, let's go on to extract the text.
interested_term_string = gsub("[^a-zA-Z]", " ", interested_term)
paper_texts = list()
interested_term_id_list = interested_term_id_list[!is.na(interested_term_id_list)]
for(i in 1:length(interested_term_id_list)){
  current_id = interested_term_id_list[i]

  # current_id='6687334'

  paper_html = readLines(URLencode(paste0("https://www.ncbi.nlm.nih.gov/pmc/articles/PMC",current_id)))
  paper_html = paste0(paper_html,collapse = "")
  writeLines(substr(paper_html, 10, nchar(paper_html)),"paper_text.txt")
  paper_split_on_div = strsplit(paper_html, '<div id="')[[1]]
  paper_split_on_div_index = unname(sapply(paper_split_on_div, function(x){
    grepl(toupper(interested_term_string),gsub("[^a-zA-Z]", " ", toupper(gsub("<.*?>", "", x))))
  }))

  targeted_text = paper_split_on_div[paper_split_on_div_index]

  targeted_text = sapply(targeted_text, function(x){
    strsplit(x, "<p")[[1]]
  })

  targeted_text = unlist(targeted_text)

  targeted_text_index = unname(sapply(targeted_text, function(x){
    grepl(toupper(interested_term_string),gsub("[^a-zA-Z]", " ", toupper(gsub("<.*?>", "", x))))
  }))

  if(length(targeted_text_index)>0){
    targeted_text = unname(sapply(paste0("<p",targeted_text[targeted_text_index]), function(x){
      html2txt(gsub("<.*?>", "", x))
    }))


    paper_texts[[current_id]] = targeted_text
  }



  # paper_texts[[current_id]]
  # i = i + 1
  # text started with "(" should be dissmised.


}

pacman::p_load(officer, magrittr)
doc <- officer::read_docx()
for(i in 1:length(paper_texts)){
   doc = doc %>%
    body_add_par(value = names(paper_texts)[i], style = "heading 1")

   for(j in 1:length(paper_texts[[i]])){

     doc = doc %>%
       body_add_par(paper_texts[[i]][j], style = "Normal")


   }


}



print(doc, target = paste0("docs/",interested_term,".docx"))




























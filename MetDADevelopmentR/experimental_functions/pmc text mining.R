artical_limitation = 30

pacman::p_load(jsonlite, xml2, httr, XML)
interested_term = "t-test"
interested_term_url = GET(URLencode(paste0('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pmc&term=',interested_term)))$content
interested_term_obj = read_xml(interested_term_url)
# interested_term_text = xml_text(, trim= TRUE)

interested_term_list = as_list(interested_term_obj)

interested_term_id_list = unlist(interested_term_list $eSearchResult$IdList)

interested_term_id_list = interested_term_id_list[1:artical_limitation]

# now we've found the id list. Now, let's go on to extract the text.

# !!!! As mentioned in our Open Access Subset page, the majority of articles in PMC are subject to traditional copyright restrictions, and are not available for downloading in bulk.
interested_term_string = gsub("[^a-zA-Z]", " ", interested_term)

paper_texts = list()
for(i in 1:length(interested_term_id_list)){
  current_id = interested_term_id_list[i]
  paper_url <- rawToChar(GET(paste0("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pmc&id=",current_id))$content)
  paper_obj = read_xml(paper_url)
  paper_text = xml_text(paper_obj, trim= TRUE)
  paper_split = strsplit(paper_text," \\|")


  indexes = unname(sapply(paper_split[[1]], function(x){
    grepl(interested_term_string,gsub("[^a-zA-Z]", " ", x))
  }))

  paper_texts[[current_id]] = paper_split[[1]][indexes]


}

test = htmlToText("https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6686905/")





xml.url = rawToChar(GET(xml.url)$content)
xmlfile <- xmlTreeParse(xml.url)


xmltop = xmlRoot(xmlfile)

character = as.character(xmltop)



plantcat <- xmlSApply(xmltop, function(x) xmlSApply(x, xmlValue))


plantcat_df <- data.frame(t(plantcat),row.names=NULL)



xmllist = xmlToList(xml.url)


xmljson = toJSON(xmllist)




xmltext = xml_text(read_xml(xml.url), trim= TRUE)

tt = strsplit(xmltext," \\|")

repeated_anova_core = function(e,group_indexes,
                               id_index,
                               sphericity_correction = T,
                               post_hoc_test_type,type){

    # https://statistics.laerd.com/statistical-guides/repeated-measures-anova-statistical-guide-2.php
    # with group, and expression data (e), we can start calculating F scores.
    k = length(group_indexes)
    e_list = sapply(group_indexes, function(x) e[,x], simplify = F)
    n_list = sapply(group_indexes, sum)
    x_bar = rowMeans(e)
    x_i_bar = sapply(e_list, function(x) rowMeans(x), simplify = F)

    SSt = Reduce("+",mapply(function(n,x){n*(x-x_bar)^2},n=n_list, x=x_i_bar, SIMPLIFY = FALSE))

    # p$id = rep(1:6, 4)
    # p$id[25:nrow(p)] = p$id[25:nrow(p)]*100
    SSw = Reduce("+",mapply(function(x,x_i){rowSums((x-x_i)^2)},x=e_list, x_i = x_i_bar, SIMPLIFY = FALSE))


    x_i_bar_2 = sapply(unique(id_index), function(x) rowMeans(e[,id_index%in%x]), simplify = F)
    SSs = k * Reduce("+",sapply(x_i_bar_2, function(x) (x-x_bar)^2, simplify = F))


    SSe = SSw - SSs

    if(sphericity_correction){# http://www.utd.edu/~herve/abdi-GreenhouseGeisser2010-pretty.pdf

      # group_indexes = sapply(levels(group_index), function(x) id_index%in%x, simplify = FALSE)
      e_list_by_group = sapply(group_indexes, function(x) e[,x], simplify = F)
      x_bar_list_by_group = sapply(e_list_by_group, function(x) rowMeans(x), simplify = F)



      s_square_list = mapply(function(x,y){ rowSums((x - y)^2/(ncol(x)-1))}, x = e_list_by_group, y = x_bar_list_by_group, SIMPLIFY = F)



      ex = expand.grid(1:length(group_indexes),1:length(group_indexes))
      cov_square_list = mapply(function(x1,y1, x2, y2){ rowSums((x1 - y1)*(x2 - y2)/(ncol(x1)-1))}, x1 = e_list_by_group[ex[,1]], y1 = x_bar_list_by_group[ex[,1]],
                               x2 = e_list_by_group[ex[,2]], y2 = x_bar_list_by_group[ex[,2]],
                               SIMPLIFY = T)


      t_bar_a_dot_list = sapply(names(group_indexes), function(x){
        rowMeans(cov_square_list[,colnames(cov_square_list)%in%x])
      }, simplify = F)

      t_bar_a_dot_list_T = sapply(names(group_indexes), function(x){
        rowMeans(cov_square_list[,colnames(cov_square_list)%in%x])
      }, simplify = T)

      tt_bar_dot_dot = rowMeans(t_bar_a_dot_list_T)

      numerator = rowSums(mapply(function(s, t){s - 2 * t}, s = s_square_list, t = t_bar_a_dot_list) + tt_bar_dot_dot)^2


      A = length(unique(group_indexes))

      denominator = (A - 1) * rowSums(mapply(function(ind1, ind2){
        cov_square_list[,length(group_indexes)*(ind2-1)+ind1] - t_bar_a_dot_list_T[,ind1] - t_bar_a_dot_list_T[,ind2] + tt_bar_dot_dot
      }, ind1 = ex[,1], ind2 = ex[,2])^2)


      epsilon = numerator/denominator

      S = sum(unlist(n_list))
      epsilon = ((S * (A - 1) * epsilon) - 2)/((A-1) * (S - 1 - (A - 1) * epsilon)) # Huynh-Feldt


      # epsilon = 1/(k - 1)
    }else{
      epsilon = 1
    }

    dft = epsilon * (k-1)
    MSt = SSt/dft
    dfe = epsilon * (length(unique(id_index))-1)*(k-1)
    MSe = SSe/dfe

    f = MSt/MSe

    p = 1 - pf(f, dft, dfe)
    adjusted_p = p.adjust(p, 'fdr')



}

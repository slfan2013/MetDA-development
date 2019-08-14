# power analysis

# 1 https://www.bioconductor.org/packages/release/bioc/manuals/ssize/man/ssize.pdf
pacman::p_load(ssize)
library(gdata) # for nobs()
data(exp.sd)
# Histogram of the standard deviations
hist(exp.sd,n=20, col="cyan", border="blue", main="",
     xlab="Standard Deviation (for data on the log scale)")
dens <- density(exp.sd)
lines(dens$x, dens$y*par("usr")[4]/max(dens$y),col="red",lwd=2)
title("Histogram of Standard Deviations")
# 1) What is the power if using 6 patients 3 measurements assuming
# Delta=1.0, Alpha=0.05 and Observed SDs?
n=6; fold.change=2.0; power=0.8; sig.level=0.05;
#
all.power <- pow(sd=exp.sd, n=n, delta=log2(fold.change),
                 sig.level=sig.level)
power.plot(all.power, lwd=2, col="blue", ylab  = "Proportion of Compounds with Power >= x")
xmax <- par("usr")[2]-0.05; ymax <- par("usr")[4]-0.05
legend(x=xmax, y=ymax,
       legend= strsplit( paste("n=",n,",",
                               "fold change=",fold.change,",",
                               "alpha=", sig.level, ",",
                               "# compounds=", nobs(exp.sd), sep=''), "," )[[1]],
       xjust=1, yjust=1, cex=1.0)
title("Power to Detect 2-Size of Difference")


# 2) What is necessary sample size for 80% power using 3 measurements/patient
# assuming Delta=1.0, Alpha=0.05 and Observed SDs?
#

all.size <- ssize(sd=exp.sd, delta=log2(fold.change),
                  sig.level=sig.level, power=power)
ssize.plot(all.size, lwd=2, col="magenta", xlim=c(1,20), ylab = "Proportion of Compounds Needing Sample Size <= n")
xmax <- par("usr")[2]-1; ymin <- par("usr")[3] + 0.05
legend(x=xmax, y=ymin,
       legend= strsplit( paste("delta=",fold.change,",",
                               "alpha=", sig.level, ",",
                               "power=",power,",",
                               "# compounds=", nobs(exp.sd), sep=''), "," )[[1]],
       xjust=1, yjust=0, cex=1.0)
title("Sample Size to Detect 2-Size of Difference")


# 3) What is necessary fold change to achieve 80% power using 3
# measurements/patient assuming n=6, Delta=1.0, Alpha=0.05 and Observed
# SDs?
#
all.delta <- delta(sd=exp.sd, power=power, n=n,
                   sig.level=sig.level)
delta.plot(all.delta, lwd=2, col="magenta", xlim=c(1,10), ylab = "Proportion of Compounds with Power >= 80% at Size of Difference=delta")
xmax <- par("usr")[2]-1; ymin <- par("usr")[3] + 0.05
legend(x=xmax, y=ymin,
       legend= strsplit( paste("n=",n,",",
                               "alpha=", sig.level, ",",
                               "power=",power,",",
                               "# compounds=", nobs(exp.sd), sep=''), "," )[[1]],
       xjust=1, yjust=0, cex=1.0)
title("Size of Difference to Achieve 80% Power")







# 1 https://cran.r-project.org/web/packages/ssize.fdr/ssize.fdr.pdf
pacman::p_load(ssize.fdr)
# In words, (4.2) says the q-value is a measure of the strength of an observed
# statistic with respect to the pFDR; it is the minimum pFDR that can occur when
# rejecting a statistic with value t for the set of nested significance regions.

# adjusted p value most stringent. q value middle. p value most loose.


a<-0.05 ##false discovery rate to be controlled
pwr<-0.8 ##desired power
p0<-c(0.5,0.9,0.95) ##proportions of non-differentially expressed genes
N<-20; N1<-35 ##maximum sample size for calculations

##Example of function ssize.oneSamp
d<-1 ##effect size
s<-0.5 ##standard deviation
os<-ssize.oneSamp(delta=d,sigma=s,fdr=a,power=pwr,pi0=p0,maxN=N,side="two-sided")
os$ssize ##first sample sizes to reach desired power
os$power ##calculated power for each sample size
os$crit.vals ##calculated critical value for each sample size


##Example of function ssize.oneSampVary
dm<-2; ds<-1 ##the effect sizes of the genes follow a Normal(2,1) distribution
alph<-3; beta<-1 ##the variances of the genes follow an Inverse Gamma(3,1) distribution.
osv<-ssize.oneSampVary(deltaMean=dm,deltaSE=ds,a=alph,b=beta,fdr=a,power=pwr,pi0=p0,
                       maxN=N1,side="two-sided")
osv$ssize ##first sample sizes to reach desired power
osv$power ##calculated power for each sample size
osv$crit.vals ##calculated critical value for each sample size















##Example of function ssize.twoSamp
##Calculates sample sizes for two-sample microarray experiments
##See Figure 1.(a) of Liu & Hwang (2007)

d1<-1 ##difference in differentially expressed genes to be detected
s1<-0.5 ##standard deviation
ts<-ssize.twoSamp(delta=d1,sigma=s1,fdr=a,power=pwr,pi0=p0,maxN=N,side="two-sided")


ts$ssize ##first sample sizes to reach desired power
ts$power ##calculated power for each sample size
ts$crit.vals ##calculated critical value for each sample size



##Example of function ssize.F
##Sample size calculation for three-treatment loop design microarray experiment
##See Figure S2. of Liu & Hwang (2007)
des<-matrix(c(1,-1,0,0,1,-1),ncol=2,byrow=FALSE) ##design matrix of loop design experiment
b<-c(1,-0.5) ##difference between first two treatments is 1 and second and third
##treatments is -0.5
df<-function(n){3*n-2} ##degrees of freedom for this design is 3n-2
s<-1 ##standard deviation
p0.F<-c(0.5,0.9,0.95,0.995) ##proportions of non-differentially expressed genes
ft<-ssize.F(X=des,beta=b,dn=df,sigma=s,fdr=a,power=pwr,pi0=p0.F,maxN=N)
ft$ssize ##first sample sizes to reach desired power
ft$power ##calculated power for each sample size
ft$crit.vals ##calculated critical value for each sample sizeft$ssize


# 5737945


# MetSizeR

ssize = 10

data = matrix(rnorm(1000*ssize*2), nrow = 1000, ncol = ssize*2)
group = rep(c("A","B"),ssize)


data[1:50, group == "B"] = data[1:50, group == "B"]+1

ts = list()
m = 0.05
FDR=c()
for(t in 1:20){

   ts[[t]] = apply(data[sample(1:nrow(data)),], 1, function(x){
           t.test(x ~ group)$statistic
   })
   p0 = m * nrow(data)
   sample_index = sample(1:nrow(data), p0)


   y = as.numeric(factor(group))
   x = t(data)
   n11 = ssize-1
   n22 = ssize-1
   in1n2 = 1/ssize+1/ssize
   nn2 = ssize + ssize - 2
   cpcf = p0

           yperm<-sample(y, replace=FALSE)
           x1<-x[yperm==1,]
           x2<-x[yperm==2,]
           Sj<-sqrt(in1n2*(n11*diag(var(x1))+n22*diag(var(x2)))/nn2)  # FASTER!!!



   ts[[t]][sample_index] = ts[[t]][sample_index]+1/Sj[sample_index]

   p_th = sort(abs(ts[[t]]), decreasing = TRUE)[p0]

   FDR[t] = sum(abs(ts[[t]][c(1:nrow(data))[!c(1:nrow(data)) %in% sample_index]])>p_th)/sum(abs(ts[[t]]) > p_th)



}
mean(FDR)

p_vals = apply(data, 1, function(x){
        t.test(x ~ group)$p.value
})

sum(p_vals[51:nrow(data)]<0.05)/sum(p_vals<0.05)







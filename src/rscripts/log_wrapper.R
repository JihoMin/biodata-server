
print('hello')
args <- commandArgs(TRUE)
a <- as.array(args[1])
b <- as.array(args[2])

print(a);
print(b);

data1 <- read.csv(a, header=TRUE)
data2 <- read.csv(b, header=TRUE)
print(data1$BMI)
# print(data2[10])
# close(con)
# print(data)
# print(myarray)
# print(a[0], "dfsf")
# print(b)

# dir <- getwd()
# dir <- paste(dir,"/src/rscripts/log_a_b.R", sep="")
# source(dir)

# val <- log_a_b(a,b)
cat('묘묘묘묘묘')
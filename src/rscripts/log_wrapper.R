args <- commandArgs(TRUE)
a <- as.double(args[1])
b <- as.double(args[2])

print(a)
print(b)

# dir <- getwd()
# dir <- paste(dir,"/src/rscripts/log_a_b.R", sep="")
# source(dir)

# val <- log_a_b(a,b)
cat('ok')
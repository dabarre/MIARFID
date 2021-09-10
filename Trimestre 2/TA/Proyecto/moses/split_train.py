import pandas as pd


print("Procesando train ES")
train_en = open('data/dataset/tr.tgt', 'w')
dev_en = open('data/dataset/dev.tgt', 'w')

i = 0
with open("data/dataset/tr-full.tgt") as f:
    for line in f.readlines():
        if i<43000:
            train_en.write(line)
        else:
            dev_en.write(line)

        i += 1

train_en.close()
dev_en.close()


print("Procesando train EN")
dev_es = open('data/dataset/dev.src', 'w')
train_es = open('data/dataset/tr.src', 'w')
i=0
with open('data/dataset/tr-full.src') as f:
    for line in f.readlines():
        if i<43000:
            train_es.write(line)
        else:
            dev_es.write(line)
        i += 1

train_es.close()
dev_es.close()

# from random import sample, seed

# seed(17)

# with open("data/dataset/tr-full.tgt", "r") as f:
#     train_en = f.readlines()
# with open("data/dataset/tr-full.src", "r") as f:
#     train_es = f.readlines()

# train = set(zip(train_en, train_es))
# development = set(sample(train, int(len(train) * 0.05)))
# train -= development
# train_en, train_es = zip(*train)
# development_en, development_es = zip(*development)


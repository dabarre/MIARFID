
s = "El/DT perro/N come/V carne/N de/P la/DT carnicería/N  y/C de/P la/DT nevera/N y/C canta/V el/DT la/N la/N la/N ./Fp"

dcat = {}
dcatf = {}
dsim = {}

i = '<S>'

for word in s.split():
    
    word, cat = word.split("/")
    word = word.lower()

    # Frequency of categories
    dcat[cat] = dcat.get(cat, 0) + 1

    # Frequency of terms and count of each category
    # (count, [(a,b), (c,d)])
    if word not in dcatf:
        dcatf[word] = (1, {cat: 1})

    else:
        freq = dcatf[word][0] + 1

        cats = dcatf[word][1]
        cats[cat] = cats.get(cat, 0) + 1

        dcatf[word] = (freq, cats)

    # Frequency of pair simbol bigrams
    # i is instaciated before the loop
    key = (i, cat)
    dsim[key] = dsim.get(key, 0) + 1
    i = cat

# Last simbol bigram
j = '</S>'
key = (i, j)
dsim[key] = dsim.get(key, 0) + 1

for key in sorted(dcat.keys()):
    print(key, dcat[key])    
print()

for key in sorted(dcatf.keys()):
    categories = ""
    count = dcatf[key][0]
    for c in dcatf[key][1]:
        categories += "{} {} ".format(c, dcatf[key][1][c])
    print(key, count, categories)
print()

for key in sorted(dsim.keys()):
    print(key, dsim[key])
print()


# Escribir funcionar para devolver una probabilidad ...

def condProbW(word):
    if (not dcatf.get(word)):
        print(word + "is not in the vocabulary\n")
        return

    # Category frequency dict for word
    fword = dcatf[word][0]
    catsf = dcatf[word][1]
    
    for key, value in catsf.items():
        print("P( {} | {} ) = {:.6f}".format(key, word, value/fword))
    

    for key, value in catsf.items():
        print("P( {} | {} ) = {:.6f}".format(word, key, value/dcat[key]))

condProbW("la")
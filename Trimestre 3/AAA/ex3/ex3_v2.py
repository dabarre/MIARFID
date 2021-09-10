from math import log

def print_table(table):
    for i in range(len(table)):
        print(table[i])

word = "aaba"

# PFA
init = 0
final = 4
transitions = {
    0: {
        "a": {0: 0.0, 1: 0.2, 2: 0.8, 3: 0.0, 4: 0.0},
        "b": {0: 0.0, 1: 0.0, 2: 0.0, 3: 0.0, 4: 0.0}
    },
    1: {
        "a": {0: 0.0, 1: 0.3, 2: 0.0, 3: 0.3, 4: 0.0},
        "b": {0: 0.0, 1: 0.0, 2: 0.4, 3: 0.0, 4: 0.0}
    },
    2: {
        "a": {0: 0.0, 1: 0.0, 2: 0.3, 3: 0.0, 4: 0.2},
        "b": {0: 0.0, 1: 0.0, 2: 0.0, 3: 0.5, 4: 0.0}
    },
    3: {
        "a": {0: 0.0, 1: 0.0, 2: 0.6, 3: 0.0, 4: 0.2},
        "b": {0: 0.0, 1: 0.0, 2: 0.0, 3: 0.2, 4: 0.0}
    },
    4: {
        "a": {0: 0.0, 1: 0.0, 2: 0.0, 3: 0.0, 4: 0.0},
        "b": {0: 0.0, 1: 0.0, 2: 0.0, 3: 0.0, 4: 0.0}
    }
}

# Initialization
# [states][time] = (H, c)
x = [[(0.0,0.0) for _ in range(len(word)+1)] for _ in range(len(transitions))]
x[0][0] = (0.0, 1.0)


# Recursion
for j in range(len(transitions)-1):
    for t in range(1, len(word)):
        #try:
        c1 = 0.0
        for i in range(len(transitions)-1):
            c1 += x[i][t-1][1]*transitions[i][word[t-1]][j]

        c2 = 0.0
        for k in range(len(transitions)-1):
            for i in range(len(transitions)-1):
                c2 += x[i][t-1][1]*transitions[i][word[t-1]][k]
                
        if c2 == 0:
            ctj = 0.0
        else:
            ctj = c1/c2


        htj = 0.0
        for i in range(len(transitions)-1):
            d = 0.0
            for k in range(len(transitions)-1):
                d += x[i][t-1][1]*transitions[i][word[t-1]][k]
            
            if d == 0: continue
            
            term1 = x[i][t-1][0] * (x[i][t-1][1] / d)
            term2 = (x[i][t-1][1] / d) * log((x[i][t-1][1] / d))

            htj += term1 - term2

        x[j][t] = (round(htj, 3), round(ctj, 3))

# Termination
T = len(word)
for j in range(len(transitions)):
    cTj = 0.0
    if j == len(transitions)-1: cTj = 1.0

    hTj = 0.0
    for i in range(len(transitions)-1):
        d = 0.0
        for k in range(len(transitions)-1):
            d += x[i][T-1][1]*transitions[i][word[T-1]][k]
        
        if d == 0: continue
        
        term1 = x[i][T-1][0] * (x[i][T-1][1] / d)
        term2 = (x[i][T-1][1] / d) * log((x[i][T-1][1] / d))

        hTj += term1 - term2

    x[j][T] = (round(hTj, 3), round(cTj, 3))

# Print results
print_table(x)
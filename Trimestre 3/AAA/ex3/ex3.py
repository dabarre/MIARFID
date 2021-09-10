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
        c1 = sum([x[i][t-1][1]*transitions[i][word[t-1]][j] for i in range(len(transitions)-1)])
        c2 = sum([sum([x[i][t-1][1]*transitions[i][word[t-1]][k] for i in range(len(transitions)-1)]) for k in range(len(transitions)-1)])
        if c2 != 0:
            ctj = c1 / c2
        else:
            ctj = 0.0

        try:
            p1 = sum([x[i][t-1][0] * (x[i][t-1][1] / sum([x[i][t-1][1]*transitions[i][word[t-1]][k] for k in range(len(transitions)-1)])) for i in range(len(transitions)-1)]) 
        except ZeroDivisionError:
            p1 = 0.0
        try:
            p2 = sum([(x[i][t-1][1] / sum([x[i][t-1][1]*transitions[i][word[t-1]][k] for k in range(len(transitions)-1)])) \
                * log(x[i][t-1][1] / sum([x[i][t-1][1]*transitions[i][word[t-1]][k] for k in range(len(transitions)-1)])) for i in range(len(transitions)-1)])
        except ZeroDivisionError:
            p2 = 0.0
        htj = p1 - p2

        x[j][t] = (htj, ctj)
        #except ZeroDivisionError:
        #    x[j][t] = (0.0, 0.0)
        #    continue

# Termination
T = len(word)
for j in range(len(transitions)):
    cTj = 0.0
    if j == len(transitions)-1: cTj = 1.0

    try:
        p1 = sum([x[i][T-1][0] * (x[i][T-1][1] / sum([x[i][T-1][1]*transitions[i][word[T-1]][k] for k in range(len(transitions)-1)])) for i in range(len(transitions))]) 
        p2 = sum([(x[i][T-1][1] / sum([x[i][T-1][1]*transitions[i][word[T-1]][k] for k in range(len(transitions))])) \
                * log(x[i][T-1][1] / sum([x[i][T-1][1]*transitions[i][word[T-1]][k] for k in range(len(transitions)-1)])) for i in range(len(transitions))])
        hTj = p1 - p2

        x[j][T] = (hTj, cTj)

    except ZeroDivisionError:
            x[j][T] = (0.0, cTj)
            continue

# Print results
print_table(x)
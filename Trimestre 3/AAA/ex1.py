
import numpy as np
import math


def distancef(p, q):
    r = 0
    for u in range(len(p)):
        r += p[u] * math.log(p[u] / q[u])

    return r


if __name__ == "__main__":
    p = [1 / 4, 1 / 2, 1 / 4]
    q = [3 / 5, 1 / 5, 1 / 5]

    print(distancef(p, q) != distancef(q, p))

    # Find u that breaks triangle
    for _ in range(1000):
        r = [np.random.random() for i in range(3)]
        s = sum(r)
        u = [i / s for i in r]
        if (
            not (distancef(p, q) <= distancef(p, u) + distancef(u, q))
            and distancef(p, u) > 0
            and distancef(u, q) > 0
        ):
            print(u)
            print(distancef(p, q), distancef(p, u), distancef(u, q))
            break

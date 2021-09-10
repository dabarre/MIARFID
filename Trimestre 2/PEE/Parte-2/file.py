import subprocess
import numpy as np
import math
import pandas as pd


if __name__ == '__main__':
    results = {}
    modelos = {"G1": ["G1-EQ", "G1-IS", "G1-SC"], "G2": ["G2-EQ", "G2-IS", "G2-SC"], "G3": ["G3-EQ", "G3-IS", "G3-SC"]}
    testSets = ["TS-EQ", "TS-IS", "TS-SC"]

    N = [5, 10, 15, 20]
    K = [1, 2, 3, 4]

    for n in N:
        for k in K:
            

    for modelo in modelos.keys():
        for submodelo in modelos[modelo]:
            for testSet in testSets:
                result = subprocess.check_output(
                    ["./scfg-toolkit/scfg_prob", "-g", "models/%s" % submodelo, "-m", "corpus/%s" % testSet])
                if results.get(submodelo) is None:
                    results[submodelo] = {testSet: np.array(result.decode('ascii').split("\n")[0:-1], dtype=np.float32)}
                else:
                    results[submodelo][testSet] = np.array(result.decode('ascii').split("\n")[0:-1], dtype=np.float32)

    maxProb = {}
    for modelo in modelos.keys():
        for testSet in testSets:
            i = 0
            probs = np.zeros((3, 1000))
            for submodelo in modelos[modelo]:
                probs[i] = results[submodelo][testSet]
                i += 1
                argMax = np.argmax(probs, axis=0)
                max = np.max(probs, axis=0)
                if maxProb.get(modelo) is None:
                    maxProb[modelo] = {testSet: list(zip(max, argMax))}
                else:
                    maxProb[modelo][testSet] = list(zip(max, argMax))
    calculaPerplejidad(results)
    for modelo in maxProb.keys():
        createConfusFile(maxProb[modelo], ["EQ", "IS", "SC"], modelo + ".out")
    print("Ficheros para la matriz de confusión generados")


#!/bin/bash
for i in {1..4}
do
	
	scfg-toolkit/scfg_cgr -g MODELS/G-triangle-n -f MODELS/Gt-k

	scfg-toolkit/scfg_learn -g MODELS/Gt-k -f MODELS/Gmk-new-700 -i 700 -m DATA/SampleTriangle-10K

	scfg-toolkit/scfg gstr -g MODELS/Gmk-new-700 -c 1000 > tri-test-k

	awk -f scfg-toolkit/checkTriangle tri-test | grep Y | wc -l
done



n = 5 10 15 20
k = 1 2 3 4

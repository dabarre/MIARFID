import subprocess
from math import log
import numpy as np

test_set = ["TS-EQ", "TS-IS", "TS-SC"]
models = ["G1", "G2", "G3"]
shapes = ["EQ", "IS", "SC"]

'''
def perplexity(probs):
    aux = 0
    for p in probs:
        aux += log(p, 2) if p>0 else 1
    
    return 
'''

for m in models:
    print("Model & Test Set & Perplexity \\\\ \\hline")
    for s in shapes:
        model_name = m + "-" + s
        for t in test_set:
            cmd = "scfg-toolkit/scfg_prob -g models/{}-{} -m corpus/{}".format(m, s, t)
            
            output = np.array(subprocess.check_output(cmd.split()).decode('utf-8').split('\n')[:-1], dtype=np.float32)
            perplexity = 2**(-np.sum(np.log2(output))/len(output))
            print("{} & {} & {:.2f} \\\\".format(model_name, t, perplexity))
    print()
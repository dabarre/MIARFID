#!/bin/bash
for ratio in "0.01" "0.05" "0.1" "0.2" "0.3"
  do
    echo "Evaluating negative ratio $ratio" >> train_extended_results.txt

    # train models
    scfg-toolkit/scfg_learn_mmi -g MODELS/G-1 -f MODELS/right-0.10 -p DATA/tr-right-extended -n DATA/Tr-right-neg -H $ratio -i 1 > /dev/null 2>&1
    scfg-toolkit/scfg_learn_mmi -g MODELS/G-1 -f MODELS/equil-0.10 -p DATA/tr-equil-extended -n DATA/Tr-equil-neg -H $ratio -i 1 > /dev/null 2>&1
    scfg-toolkit/scfg_learn_mmi -g MODELS/G-1 -f MODELS/isosc-0.10 -p DATA/tr-isosc-extended -n DATA/Tr-isosc-neg -H $ratio -i 1 > /dev/null 2>&1
    
	# classify with the trained models and get results
    scfg-toolkit/scfg_prob -g MODELS/right-0.10 -m DATA/Ts-right > tmp/r
    scfg-toolkit/scfg_prob -g MODELS/equil-0.10 -m DATA/Ts-right > tmp/e
    scfg-toolkit/scfg_prob -g MODELS/isosc-0.10 -m DATA/Ts-right > tmp/i
    paste tmp/r tmp/e tmp/i | awk '{ m=$1;argm="right"; if ($2>m) { m=$2; argm="equil"; } if ($3>m) {m=$3;argm="isosc"; } printf("right %s\n",argm); }' > results

    scfg-toolkit/scfg_prob -g MODELS/right-0.10 -m DATA/Ts-equil > tmp/r
    scfg-toolkit/scfg_prob -g MODELS/equil-0.10 -m DATA/Ts-equil > tmp/e
    scfg-toolkit/scfg_prob -g MODELS/isosc-0.10 -m DATA/Ts-equil > tmp/i
    paste tmp/r tmp/e tmp/i | awk '{ m=$2;argm="equil"; if ($1>m) { m=$1;argm="right"; } if ($3>m) {m=$3; argm="isosc"; } printf("equil %s\n",argm); }' >> results

    scfg-toolkit/scfg_prob -g MODELS/right-0.10 -m DATA/Ts-isosc > tmp/r
    scfg-toolkit/scfg_prob -g MODELS/equil-0.10 -m DATA/Ts-isosc > tmp/e
    scfg-toolkit/scfg_prob -g MODELS/isosc-0.10 -m DATA/Ts-isosc > tmp/i
    paste tmp/r tmp/e tmp/i | awk '{ m=$3;argm="isosc"; if ($1>m) { m=$1;argm="right";} if ($2>m) { m=$2; argm="equil"; } printf("isosc %s\n",argm); }' >> results

    cat results | scfg-toolkit/confus >> train_extended_results.txt
	echo "Evaluating negative ratio $ratio completed" 
  done

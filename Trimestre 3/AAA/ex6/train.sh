# train models
scfg-toolkit/scfg_learn_mmi -g MODELS/G-1 -f MODELS/right-0.10 -p DATA/Tr-right -n DATA/tr-right-neg  -H 0.1 -i 1
scfg-toolkit/scfg_learn_mmi -g MODELS/G-1 -f MODELS/equil-0.10 -p DATA/Tr-equil -n DATA/tr-equil-neg  -H 0.1 -i 1
scfg-toolkit/scfg_learn_mmi -g MODELS/G-1 -f MODELS/isosc-0.10 -p DATA/Tr-isosc -n DATA/tr-isosc-neg  -H 0.1 -i 1

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

cat results | scfg-toolkit/confus
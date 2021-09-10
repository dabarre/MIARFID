echo "Loading env variables"
source ../exports.txt

"Downloading data and extracting"
wget http://www.prhlt.upv.es/~fcn/Students/ta/Corpus.tgz --no-check-certificate

tar zxvf Corpus.tgz

echo "Cleaning corpus"


export LANGUAGE=C 
export LC_ALL=C 

cd Corpus
cp europarl-v7.es-en-train-red.en train_tmp.en
cp europarl-v7.es-en-train-red.es train_tmp.es
cp europarl-v7.es-en-test.en test_tmp.en
cp europarl-v7.es-en-test.es test_tmp.es
for DATA in train_tmp test_tmp
do
    for LANG in en es
        do
            $MOSES/scripts/tokenizer/tokenizer.perl -l $LANG < "$DATA.$LANG" > $DATA.tk.$LANG
            $MOSES/scripts/tokenizer/lowercase.perl < $DATA.tk.$LANG > $DATA.tk.lc.$LANG
        done
        clean-corpus-n.perl $DATA.tk.lc es en ${DATA%_*}.clean 1 60
done

rm *_tmp*


mv train.clean.es ../data/dataset/tr-full.tgt
mv train.clean.en ../data/dataset/tr-full.src

mv test.clean.es ../data/dataset/test.tgt
mv test.clean.en ../data/dataset/test.src
exit
cd ..
echo "Removing duplicate lines and dividing train data in train/development sets..."
python3 split_train.py


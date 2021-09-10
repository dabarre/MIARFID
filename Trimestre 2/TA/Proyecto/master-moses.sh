cd moses

# ALREDY DONE

#if [ ! -f "Corpus.tgz" ]; then
#    echo "Preparing data"
#   sh prepare_data.sh > moses.output 2>&1
#fi


#export NGRAMS= 3, 4, 5
#export WEIGTHS_ADJ= "" --batch-mira
#export DISCOUNT= -kndiscount -wbdiscount -GoodTuring

#echo "Experimentos NGRAMS"
#export DISCOUNT=-kndiscount
#export ITERATIONS=5
#export WEIGTHS_ADJ=""
#for NGRAMS in 3 4 5; do
#for NGRAMS in 5; do
#    export NGRAMS=$NGRAMS
#    echo "Preparing data NGRAMS" "$NGRAMS" "ITERATIONS" "$ITERATIONS" "DISCOUNT" "$DISCOUNT" "WEIGTHS_ADJ" "MERT"

#    echo "Training LM"
#    sh train_lm.sh > moses.output 2>&1

#    echo "Training basic model"
#    sh train_model_basic.sh > moses.output 2>&1

#    echo "Adjusting weights"
#    sh train_weights.sh > moses.output 2>&1

#    echo "Predict"
#    sh generate_predictions.sh > moses.output 2>&1

#    echo "Evaluate"
#    echo "Experiment NGRAMS" "$NGRAMS" "ITERATIONS" "$ITERATIONS" "DISCOUNT" "$DISCOUNT" "WEIGTHS_ADJ" "MERT" >> resultados.txt
#    sh evaluate.sh >> resultados.txt
#done

echo "Experimentos Discount"
export ITERATIONS=5
export NGRAMS=5
export WEIGTHS_ADJ=""
for DISCOUNT in -kndiscount -wbdiscount -GoodTuring; do
    export DISCOUNT=$DISCOUNT
    echo "Preparing data NGRAMS" "$NGRAMS" "ITERATIONS" "$ITERATIONS" "DISCOUNT" "$DISCOUNT" "WEIGTHS_ADJ" "MERT"

    echo "Training LM"
    sh train_lm.sh > moses.output 2>&1

    echo "Training basic model"
    sh train_model_basic.sh > moses.output 2>&1

    #echo "Adjusting weights"
    #sh train_weights.sh > moses.output 2>&1

    #echo "Predict"
    #sh generate_predictions.sh > moses.output 2>&1

    #echo "Evaluate"
    #echo "Experiment NGRAMS" "$NGRAMS" "ITERATIONS" "$ITERATIONS" "DISCOUNT" "$DISCOUNT" "WEIGTHS_ADJ" "MERT" >> resultados.txt
    #sh evaluate.sh >> resultados.txt
done

echo "Experimentos WEIGHTS_ADJ"
export DISCOUNT="-kndiscount"
export ITERATIONS=5
export NGRAMS=5
export WEIGHTS_ADJ="--batch-mira"
echo "Preparing data NGRAMS" "$NGRAMS" "ITERATIONS" "$ITERATIONS" "DISCOUNT" "$DISCOUNT" "WEIGTHS_ADJ" "$WEIGTHS_ADJ"

echo "Training LM"
sh train_lm.sh > moses.output 2>&1

echo "Training basic model"
sh train_model_basic.sh > moses.output 2>&1

#echo "Adjusting weights"
#sh train_weights.sh > moses.output 2>&1

#echo "Predict"
#sh generate_predictions.sh > moses.output 2>&1

#echo "Evaluate"
#echo "Experiment NGRAMS" "$NGRAMS" "ITERATIONS" "$ITERATIONS" "DISCOUNT" "$DISCOUNT" "WEIGTHS_ADJ" "$WEIGTHS_ADJ" >> resultados.txt
#sh evaluate.sh >> resultados.txt

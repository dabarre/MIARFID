cd open-nmt

# REDUCIR BATCH_SIZE
for CONFIG in "config_emb512_encDec128"; do
	python3 free_memory.py
	echo "Training" $CONFIG
	docker container run -it --rm --gpus all \
		-v ${PWD}/Data:/opt/nmt-keras/Data \
	    -v ${PWD}/$CONFIG.py:/opt/nmt-keras/config.py \
	    -v ${PWD}/datasets:/opt/nmt-keras/datasets \
	    -v ${PWD}/trained_models:/opt/nmt-keras/trained_models \
	    nmt-keras
	
	#echo "Generating predictions"
	###sh generate_predictions.sh

	#DELETED
	#echo "Evaluating predictions"
	##sh evaluate.sh >> resultados.txt
done

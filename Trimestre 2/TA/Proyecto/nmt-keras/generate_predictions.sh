# TEST

# Init docker
docker container run -it --rm --gpus all \
	-v ${PWD}/Data:/opt/nmt-keras/Data \
	-v ${PWD}/datasets:/opt/nmt-keras/datasets \
	-v ${PWD}/trained_models:/opt/nmt-keras/trained_models \
	-v ${PWD}/multi-bleu.perl:/opt/nmt-keras/multi-bleu.perl \
	-v ${PWD}/evaluate.sh:/opt/nmt-keras/evaluate.sh \
	-v ${PWD}/resultados.txt:/opt/nmt-keras/resultados.txt \
	    nmt-keras /bin/bash

echo "Evaluation Completed!"







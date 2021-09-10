cp ../moses/data/dataset/* Data/Europarl/

cd Data/Europarl
for file in *.src; do
    mv "$file" "$(basename "$file" .src).en"
done

for file in *.tgt; do
    mv "$file" "$(basename "$file" .tgt).es"
done

cd ../..
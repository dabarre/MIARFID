package capasAislantes;

import java.util.Collections;
import org.opt4j.core.genotype.PermutationGenotype;
import org.opt4j.core.problem.Creator;

public class ProyectoCreator implements Creator<PermutationGenotype<Integer>> {

	@Override
	public PermutationGenotype<Integer> create() {

		PermutationGenotype<Integer> genotipo = new PermutationGenotype<Integer>();
		for (int i = 0; i < Datos.NUM_CAPAS_3; i++) {
			genotipo.add(i);
		}
		
		Collections.shuffle(genotipo);
		return genotipo;		
	}
}

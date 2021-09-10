package capasAislantes;

import java.util.ArrayList;
import org.opt4j.core.problem.Evaluator;
import org.opt4j.core.Objectives;
import org.opt4j.core.Objective.Sign;

public class ProyectoEvaluator implements Evaluator<ArrayList<Integer>>
{
	@Override
	public Objectives evaluate(ArrayList<Integer> fenotipo) {
		int aislamiento = 0;
		
		// CALCULAR SOLUCION
		// ACUMULAR AISLAMIENTO
		for (int id = 1; id < fenotipo.size(); id++) {
			aislamiento += Datos.matrizAislamiento_3[fenotipo.get(id-1)][fenotipo.get(id)];
		}
		
		Objectives objectives = new Objectives();
		// MAXIMIZAR AISLAMIENTO
		objectives.add("MAX Aislamiento", Sign.MAX, aislamiento);
		
		return objectives;
	}
}

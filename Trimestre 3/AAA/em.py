
import matplotlib.pyplot as plt
import numpy as np
from sklearn import mixture
from tqdm import tqdm
import seaborn as sns

np.random.seed(21)

mixtura_original = mixture.GaussianMixture(
    n_components=2,
    covariance_type="spherical",
    weights_init=np.array([0.4, 0.6]),
    means_init=np.array([[-6], [2]]),
    precisions_init=np.array([0.25, 0.25]),  # 1/4 inverse of covariance
    random_state=21,
)
mixtura_original.covariances_ = np.array([4, 4])
mixtura_original.means_ = np.array([[-6], [2]])
mixtura_original.weights_ = np.array([0.4, 0.6])
mixtura_original.precisions_ = np.array([0.25, 0.25])
mixtura_original.fit_ = True

estim = mixture.GaussianMixture(
    n_components=3,
    covariance_type="spherical",
    weights_init=np.array([0.7, 0.1, 0.2]),
    means_init=np.array([[-6], [2], [0]]),
    precisions_init=np.array([0.25, 0.25, 0.25]),  # 1/4 inverse of covariance
    random_state=21,
)


def experiment(samples, regul_param):

    estim.covariances_ = np.array([4, 4, 4])
    estim.means_ = np.array([[-6], [2], [0]])
    estim.weights_ = np.array([0.7, 0.1, 0.2])
    estim.precisions_cholesky_ = np.array([0.5, 0.5, 0.5])
    estim.fit_ = True

    avg_log_likelihood_prev = -10e9

    # 1000 iteraciones máximo
    for i in range(1, 1000):
        probs_act = estim.predict_proba(samples)
        numerador_1 = 0
        numerador_2 = 0
        numerador_3 = 0
        for p in probs_act:  # sum over M, number of samples
            numerador_1 += p[0] * (1 + regul_param * p[0])
            numerador_2 += p[1] * (1 + regul_param * p[1])
            numerador_3 += p[2] * (1 + regul_param * p[2])
        pi_1 = numerador_1 / (numerador_1 + numerador_2 + numerador_3)

        pi_2 = numerador_2 / (numerador_1 + numerador_2 + numerador_3)

        pi_3 = numerador_3 / (numerador_1 + numerador_2 + numerador_3)

        estim.weights_ = [pi_1, pi_2, pi_3]

        avg_log_likelihood_act = estim.score(samples)
        if avg_log_likelihood_act < avg_log_likelihood_prev:
            break
        avg_log_likelihood_prev = avg_log_likelihood_act

    return (
        abs(estim.weights_[0] - 0.4) + abs(estim.weights_[1] - 0.6) + estim.weights_[2]
    )


def plot(regul_param, output_name):
    #regul_param = 0.2
    sampled_50 = []
    sampled_1000 = []
    for n_samples in [50, 1000]:
        samples, _ = mixtura_original.sample(n_samples)

        estim.covariances_ = np.array([4, 4, 4])
        estim.means_ = np.array([[-6], [2], [0]])
        estim.weights_ = np.array([0.7, 0.1, 0.2])
        estim.precisions_cholesky_ = np.array([0.5, 0.5, 0.5])
        estim.fit_ = True

        avg_log_likelihood_prev = -10e9

        # 1000 iteraciones máximo
        for i in range(1, 1000):
            probs_act = estim.predict_proba(samples)
            numerador_1 = 0
            numerador_2 = 0
            numerador_3 = 0
            for p in probs_act:  # sum over M, number of samples
                numerador_1 += p[0] * (1 + regul_param * p[0])
                numerador_2 += p[1] * (1 + regul_param * p[1])
                numerador_3 += p[2] * (1 + regul_param * p[2])
            pi_1 = numerador_1 / (numerador_1 + numerador_2 + numerador_3)

            pi_2 = numerador_2 / (numerador_1 + numerador_2 + numerador_3)

            pi_3 = numerador_3 / (numerador_1 + numerador_2 + numerador_3)

            estim.weights_ = [pi_1, pi_2, pi_3]

            avg_log_likelihood_act = estim.score(samples)
            if avg_log_likelihood_act < avg_log_likelihood_prev:
                break
            avg_log_likelihood_prev = avg_log_likelihood_act

            if n_samples == 50:
                sampled_50, _ = estim.sample(10000)
            else:
                sampled_1000, _ = estim.sample(10000)
        print(f"For sample{n_samples} pi {estim.weights_}")

    sampled_original, _ = mixtura_original.sample(10000)
    sns.distplot(
        sampled_50,
        rug_kws={"color": "g"},
        hist=False,
        label="50 samples",
        kde_kws={"linestyle": "--"},
    )
    sns.distplot(
        sampled_1000,
        rug_kws={"color": "b"},
        hist=False,
        label="1000 samples",
        kde_kws={"linestyle": ":"},
    )
    sns.distplot(
        sampled_original,
        rug_kws={"color": "r"},
        hist=False,
        label="Original mixture",
        kde_kws={"linestyle": "dashdot"},
    )
    plt.legend()
    plt.savefig(output_name)


if __name__ == "__main__":
    #plot(regul_param=0.0, output_name='reg0.png')
    #plot(regul_param=0.1, output_name='reg1.png')

    #plot(regul_param=0.0, output_name='regulazation_0.png')
    # For sample50 pi [0.28918425494099637, 0.7108157450586914, 3.121825945105453e-13]
    # For sample1000 pi [0.390902224297791, 0.5838822453363601, 0.025215530365848927]
    
    plot(regul_param=0.1, output_name='regulazation_1.png')
    # For sample50 pi [0.2887078818529011, 0.7112921181470321, 6.679278741160488e-14]
    # For sample1000 pi [0.3921550348845665, 0.5856399979547517, 0.022204967160681852]


    '''

    n_experiments = 100
    samples, _ = mixtura_original.sample(1000)

    r_1000_sinregu = (
        sum([experiment(samples, 0) for u in tqdm(range(n_experiments))])
        / n_experiments
    )
    r_100_regu = (
        sum([experiment(samples, 0.1) for u in tqdm(range(n_experiments))])
        / n_experiments
    )
    r_100_regu_2 = (
        sum([experiment(samples, 0.2) for u in tqdm(range(n_experiments))])
        / n_experiments
    )

    samples, _ = mixtura_original.sample(50)
    r_50_sinregu = (
        sum([experiment(samples, 0) for u in tqdm(range(n_experiments))])
        / n_experiments
    )
    r_50_regu = (
        sum([experiment(samples, 0.1) for u in tqdm(range(n_experiments))])
        / n_experiments
    )
    r_50_regu_2 = (
        sum([experiment(samples, 0.2) for u in tqdm(range(n_experiments))])
        / n_experiments
    )

    print(f"50 Samples without regularization {r_50_sinregu:.4f}")
    print(f"50 Samples with regularization 0.1{r_50_regu:.4f}")
    print(f"50 Samples with regularization 0.2{r_50_regu_2:.4f}")
    print(f"1000 Samples without regularization {r_1000_sinregu:.4f}")
    print(f"1000 Samples with regularization 0.1{r_100_regu:.4f}")
    print(f"1000 Samples with regularization 0.2{r_100_regu_2:.4f}")
    '''
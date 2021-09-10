import numpy as np
from tqdm import tqdm
import subprocess

# Equil
raw_equil = open("DATA/Tr-equil").readlines()
raw_isosc = open("DATA/Tr-isosc").readlines()
raw_right = open("DATA/Tr-right").readlines()

N = 1000  # number of extra samples
MIN_LEN = 1
MAX_LEN = 20
SEED = 1


def triangle_side(lenght, letter):
    aux = [letter for _ in range(lenght)]
    return " ".join(aux)


def check_triangle(a, b, c):
    if a + b >= c and b + c >= a and c + a >= b:
        return True
    else:
        return False


print(f"Equil data has {len(raw_equil)} samples")
aux_triangles = (
    subprocess.check_output(
        [
            "scfg-toolkit/genFig",
            "-F",
            "1",
            "-s",
            str(SEED),
            "-c",
            str(N),
            "-l",
            str(MIN_LEN),
            "-L",
            str(MAX_LEN),
        ]
    )
    .decode("utf-8")
    .split("\n")
)
aux_triangles.pop()  # Remove last empty triangle

raw_equil = raw_equil + aux_triangles
with open("DATA/tr-equil-extended", "w+") as f:
    for element in raw_equil:
        f.write(element.replace("\n", "") + "\n")
print(f"Equil data has {len(raw_equil)} samples now")


print(f"Isosc data has {len(raw_isosc)} samples")
# Isosceles
aux_triangles = (
    subprocess.check_output(
        [
            "scfg-toolkit/genFig",
            "-F",
            "2",
            "-s",
            str(SEED),
            "-c",
            str(N),
            "-l",
            str(MIN_LEN),
            "-L",
            str(MAX_LEN),
        ]
    )
    .decode("utf-8")
    .split("\n")
)
aux_triangles.pop()  # Remove last empty triangle
raw_isosc = raw_isosc + aux_triangles
with open("DATA/tr-isosc-extended", "w+") as f:
    for element in raw_isosc:
        f.write(element.replace("\n", "") + "\n")
print(f"Isosc data has {len(raw_isosc)} samples now")

# RIGHT
print(f"Isosc data has {len(raw_right)} samples")
# Isosceles
aux_triangles = (
    subprocess.check_output(
        [
            "scfg-toolkit/genFig",
            "-F",
            "0",
            "-s",
            str(SEED),
            "-c",
            str(N),
            "-l",
            str(MIN_LEN),
            "-L",
            str(MAX_LEN),
        ]
    )
    .decode("utf-8")
    .split("\n")
)
aux_triangles.pop()  # Remove last empty triangle

raw_right = raw_right + aux_triangles
with open("DATA/tr-right-extended", "w+") as f:
    for element in raw_right:

        f.write(element.replace("\n", "") + "\n")
print(f"Isosc data has {len(raw_right)} samples now")

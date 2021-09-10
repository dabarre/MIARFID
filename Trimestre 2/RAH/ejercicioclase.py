# -*- coding: utf-8 -*-

import numpy as np
from sys import *
from distances import get_distance_matrix
import matplotlib as plt
import matplotlib.pyplot as plt
import math

def lee_fichero(fichero):
    matriz = []
    fichero = open(fichero,"r")
    lineas = fichero.readlines()
    matriz = [linea.split() for linea in lineas] 
    fichero.close()
    return np.array(matriz).astype(np.float)

#Implementar a partir de aqui

# Count number of appearences for each word
def top_segements():
    fichero = open("seg-queries-2500.txt", "r")
    lineas = fichero.readlines()
    fichero.close()

    dic = {}
    for l in lineas:
        k = l[-5:-1]
        dic[k] = dic.get(k, 0) + 1

    seg_sorted = [(v,k) for k,v in dic.items()]
    seg_sorted.sort(reverse=True)

    for v, k in seg_sorted:
        print("%s: %d" % (k, v))

def sdtw(path_query, path_audio, distance):
    # Audio corto
    query = lee_fichero(path_query)
    # Audio largo
    audio = lee_fichero(path_audio)

    # correspondencias.txt que palabra corresponde cada uno de los 100 ficheros que hay
    
    # seg-queries-2500.txt posiciones dentro del audio largo de las diferentes palabras 
    # que se pueden buscar, siendo este fichero el que puedes usar para comprobar si has 
    # encontrado al menos una ocurrencia de la palabra

    # Distances
    d = get_distance_matrix(query, audio, distance=distance)
    # MatrixDataVector: Cost, Length, Previous, Normalization=Cost/Length
    m = np.zeros(shape=(len(query), len(audio), 4))

    # SDTW
    for j in range(len(audio)):
        m[0][j] = d[0][j], 1.0, j, d[0][j]
    for i in range(1, len(query)-1):
        m[i][0] = d[i][0] + m[i-1][0][0], i, 0.0, m[i][0][0]/m[i][0][1]

    for j in range(1, len(audio)):
        for i in range(1, len(query)):
            triple = ((m[i-1][j][0]+d[i][j])/(m[i-1][j][1]+1), (m[i][j-1][0]+d[i][j])/(m[i][j-1][1]+1), (m[i-1][j-1][0]+d[i][j])/(m[i-1][j-1][1]+1))

            if min(triple) == triple[0]:
                m[i][j][0] = d[i][j] + m[i-1][j][0]
                m[i][j][2] = m[i-1][j][2]
            elif min(triple) == triple[1]:
                m[i][j][0] = d[i][j] + m[i][j-1][0]
                m[i][j][2] = m[i][j-1][2]
            elif min(triple) == triple[2]:
                m[i][j][0] = d[i][j] + m[i-1][j-1][0]
                m[i][j][2] = m[i-1][j-1][2]

            m[i][j][1] = i
            m[i][j][3] = m[i][j][0] / m[i][j][1]

    results = [m[len(query)-1][j][3] for j in range(1, len(audio))]
    
    # Get minimum
    #minimum = min(result)
    #index = result.index(minimum)
    #i, j = len(query)-1, index

    #while i > 0:
    #    j = int(m[i][j][2])
    #    i -= 1
    
    segments_info = []
    for minimum in results:
        index = results.index(minimum)
        i, j = len(query)-1, index
        while i > 0:
            j = int(m[i][j][2])
            i -= 1
        #print("Segment:\t(%f, %f)\nCost:\t%.5f" % (j/100, index/100, minimum))
        segments_info.append((j/100, index/100, minimum))
    
    return segments_info

if __name__ == "__main__":
    #top_segements()

    # Words to search 13 30 65 67
    query = 67
    path_query = 'mfc_queries/SEG-00{}.mfc.raw'.format(query)
    path_audio = 'largo250000.mfc.raw'
    distance = 'cos'

    # List all appearences
    fichero = open("seg-queries-2500.txt", "r")
    lineas = fichero.readlines()
    fichero.close()

    appearences = []

    for l in lineas[2:]:
        v = l.split()
        i = int(v[2][-2:])
        if i == query:
            appearences.append((v[0], v[1]))

    # Calculate appearences
    print("--------------{}---------------".format(query))
    segments_info = sdtw(path_query, path_audio, distance)
    
    # Calculate minimum per window
    min_cost_appearences = []
    i = 0
    len_audio_rounded = len(segments_info)
    window = int(len_audio_rounded/100)
    j = window
    
    while i < len_audio_rounded:
        minimun_cost = math.inf
        index = None
        for k in range(i, j):
            if segments_info[k][2] < minimun_cost:
                minimun_cost = segments_info[k][2]
                index = k
        min_cost_appearences.append(index)
        i = j
        j = min(len(segments_info), j+window)

    min_cost_appearences = sorted(min_cost_appearences, key=lambda x: segments_info[x][2])
    print("----Calculated appearences:----")
    print("Origin\t\tEnd\t\tCost")
    for i in min_cost_appearences[:6]:
        
        print("{}\t\t{}\t\t{:.6f}".format(segments_info[i][0], segments_info[i][1], segments_info[i][2]))

    # Actual appearences
    print("------Actual appearences:------")
    print("Origin\t\tEnd")
    for start, end in appearences:
        print("{}\t\t{}".format(start, end))
    print("-------------------------------\n")

    # Plot start-cost graph
    x = [start for start, end, cost in segments_info]
    y = [cost for start, end, cost in segments_info]
    plt.plot(x, y)
    plt.show() 
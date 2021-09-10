#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Apr  4 11:39:04 2018

@author: fpla

ENTRADA: dos fitxers text amb format: id \t etiqueta
EIXIDA: les mesures de P,R,F1 amb macro i micro

"""

import sys
from sklearn.metrics import classification_report
from sklearn.metrics import accuracy_score
from sklearn.metrics import precision_recall_fscore_support


def read_file(filename):
    dic = {}
    for id, tag in [line.strip().split('\t') for line in open(filename)]:
        dic[id] = tag
    return (dic)

def usage():
    print("Ús:")
    print("python %s <ref_file> <out_file>" % sys.argv[0])

if __name__ == '__main__':

    if len(sys.argv) < 3:
        usage()
        sys.exit(1)
        
    ref_file = sys.argv[1]
    out_file = sys.argv[2]
    dic_ref=read_file(ref_file)
    dic_out=read_file(out_file)
    l_ref=sorted(dic_ref)
    l_out=sorted(dic_out)
    
    if l_ref != l_out:
        print ("** ERROR-1: id's dels tuits no coincideixen ** ")
        print (l_ref)
        print (l_out)
        sys.exit(1)
    else:
        ref=[] 
        out=[]
        for id in sorted(dic_ref):
            ref.append(dic_ref[id])
            out.append(dic_out[id])
        ref_label=set(ref)
        out_label=set(out)
        if ref_label != out_label:
            print ("** ERROR-2: conjunt d'etiquetes no coincideix ** ")
            print (sorted(ref_label))
            print (sorted(out_label))
            sys.exit(1)

    print(classification_report(ref, out))
    print("accuracy= ",accuracy_score(ref, out))
    print("macro= ", precision_recall_fscore_support(ref, out, average='macro'))
    print("micro= ", precision_recall_fscore_support(ref, out, average='micro'))
    
    
    
    
    
    
        
    

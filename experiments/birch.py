from sklearn.cluster import Birch
from sklearn.preprocessing import scale
import json
import itertools
import random
import numpy as np

train_data = json.loads(open('train_data.json', 'r').read())
predict_data = json.loads(open('predict_data.json', 'r').read())

brc = Birch(branching_factor=50, n_clusters=len(predict_data), threshold=0.5, compute_labels=True)
labels = brc.fit_predict(scale(np.array(train_data)))

n_clusters = len(set(labels)) - (1 if -1 in labels else 0)

groups = itertools.groupby(sorted(zip(labels, train_data), key=lambda l: l[0]), lambda l: l[0])
for g in groups:
    c = g[0]
    gl = list(g[1])
    print c, len(gl), random.sample(gl, min(3, len(gl)))

max_group = max(
    map(
        lambda x: (x[0], list(x[1])),
        itertools.groupby(
            sorted(zip(labels, train_data), key=lambda l: l[0]),
            lambda l: l[0]
        )
    ),
    key=lambda x: len(list(x[1]))
)

print len(max_group[1]) / float(len(train_data)) * 100

print 'num clusters: ', n_clusters

predicted = brc.predict(predict_data)
pos_clusters = set(predicted)
neg_clusters = set(labels) - pos_clusters

print pos_clusters
print neg_clusters

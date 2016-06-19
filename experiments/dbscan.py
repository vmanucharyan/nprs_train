import numpy as np

from sklearn.cluster import DBSCAN
from sklearn import metrics
from sklearn.datasets.samples_generator import make_blobs
from sklearn.preprocessing import StandardScaler

import json
import itertools
import random


##############################################################################
# Generate sample data

train_data = json.loads(open('train_data.json', 'rb').read())
predict_data = json.loads(open('predict_data.json', 'rb').read())

centers = np.array(train_data + predict_data)

# print centers

X = StandardScaler().fit_transform(centers)

##############################################################################
# Compute DBSCAN
db = DBSCAN(eps=0.3, min_samples=5).fit(X)
core_samples_mask = np.zeros_like(db.labels_, dtype=bool)
core_samples_mask[db.core_sample_indices_] = True
labels = db.labels_

# Number of clusters in labels, ignoring noise if present.
n_clusters_ = len(set(labels)) - (1 if -1 in labels else 0)

groups = itertools.groupby(sorted(zip(labels, centers), key=lambda l: l[0]), lambda l: l[0])
for g in groups:
    c = g[0]
    gl = list(g[1])
    print c, len(gl), random.sample(gl, min(3, len(gl)))

print('Estimated number of clusters: %d' % n_clusters_)
print(labels[-len(predict_data):])
groups = itertools.groupby(sorted(zip(labels, centers), key=lambda l: l[0]), lambda l: l[0])
for g in groups:
    print g[0], sum(1 for i in g[1])

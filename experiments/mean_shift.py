import numpy as np
import itertools

from sklearn.cluster import MeanShift, estimate_bandwidth
from sklearn import metrics
from sklearn.datasets.samples_generator import make_blobs

import json


##############################################################################
# Generate sample data

train_data = json.loads(open('train_data.json', 'rb').read())
predict_data = json.loads(open('predict_data.json', 'rb').read())

centers = train_data + predict_data

# print centers

X = np.array(centers)
bandwidth = estimate_bandwidth(X, quantile=0.5, n_samples=500)


##############################################################################
# Compute mean shift
ms = MeanShift(bandwidth=bandwidth, bin_seeding=True)
ms.fit(X)
labels = ms.labels_

groups = itertools.groupby(sorted(zip(labels, centers), key=lambda l: l[0]), lambda l: l[0])
for g in groups:
    print g[0], sum(1 for i in g[1])

# Number of clusters in labels, ignoring noise if present.
n_clusters_ = len(set(labels)) - (1 if -1 in labels else 0)

print('Estimated number of clusters: %d' % n_clusters_)
print(labels[-len(predict_data):])

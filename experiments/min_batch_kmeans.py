from sklearn.cluster import MiniBatchKMeans
from sklearn.preprocessing import scale
from sklearn.decomposition import PCA
import json
import itertools
import random
import numpy as np

train_data = json.loads(open('train_data.json', 'r').read())
predict_data = json.loads(open('predict_data.json', 'r').read())

print len(train_data)

brc = MiniBatchKMeans(n_clusters=4)
labels = brc.fit_predict(scale(np.array(train_data)))

print brc.cluster_centers_

n_clusters = len(set(labels)) - (1 if -1 in labels else 0)

groups = itertools.groupby(sorted(zip(labels, train_data), key=lambda l: l[0]), lambda l: l[0])
for g in groups:
    c = g[0]
    gl = list(g[1])
    print c, len(gl), random.sample(gl, min(3, len(gl)))

print 'num clusters: ', n_clusters
print brc.predict(predict_data)
print brc.predict([
    [0.5,2.1489362716674814,4.0,1.0],
    [0.5,2.22857141494751,2.0,1.0],
    [0.615384638309479,1.9574468135833738,40.0,15000.0],
    [0.6923077106475831,2.189189195632935,2.0,1100.0],
    [0.615384638309479,2.305555582046509,2.0,5.0]
])

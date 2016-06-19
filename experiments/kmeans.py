from sklearn.cluster import KMeans
import json
import itertools
import random

train_data = json.loads(open('train_data_2.json', 'r').read())
predict_data = json.loads(open('predict_data.json', 'r').read())

brc = KMeans(n_clusters=4)
labels = brc.fit_predict(train_data)

n_clusters = len(set(labels)) - (1 if -1 in labels else 0)

groups = itertools.groupby(sorted(zip(labels, train_data), key=lambda l: l[0]), lambda l: l[0])
for g in groups:
    c = g[0]
    gl = list(g[1])
    print c, len(gl), random.sample(gl, min(3, len(gl)))

print 'num clusters: ', n_clusters
print brc.predict(predict_data)

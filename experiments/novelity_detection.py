from sklearn import svm
import numpy as np
import json
import random

train_data = json.loads(open('positives_input.json', 'r').read())
clf = svm.OneClassSVM(nu=0.1, kernel="rbf", gamma=0.1)
clf.fit(train_data)

predict_data = json.loads(open('predict_data.json', 'r').read())
print clf.predict(predict_data)

image_data = json.loads(open('train_data_2.json', 'r').read())
labels = clf.predict(image_data)

outliers = filter(lambda x: x[0] == -1., zip(labels, image_data))
normals = filter(lambda x: x[0] == 1., zip(labels, image_data))

print 'normals %: ', len(normals) / float(len(image_data)) * 100, len(normals)
print 'outliers %: ', len(outliers) / float(len(image_data)) * 100, len(outliers)

print random.sample(outliers, 3)

print clf.predict([[0.7692307829856873, 2.04395604133606, 4.0, 3.0]])

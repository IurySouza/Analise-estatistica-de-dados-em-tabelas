import sys
import json

class Data:
    media = 0
    mediana = 0
    moda = 0

d = Data()

file = open('uploads\\data.json', 'r')
obj = json.loads(file.read())

for aux in obj['keys']:
    if aux['allNums']:
        media = aux['sum']/aux['nelems']
        d.media = media
        aux['media'] = media

sys.stdout.flush()
import sys
import json

file = open('uploads\\data.json', 'r')
obj = json.loads(file.read())
#print(obj)

sys.stdout.flush()
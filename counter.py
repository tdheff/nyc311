import csv
import collections
import json

zipcodes = collections.Counter()
complaints = collections.Counter()
zips = []

with open('311calls.csv') as input_file:
    for row in csv.reader(input_file, delimiter=','):
        zipcodes[row[2]+" "+row[1]] += 1
        complaints[row[1]] += 1
        if row[2] not in zips:
            zips.append(row[2]);
        
#print complaints.most_common()

print json.dumps(zips)
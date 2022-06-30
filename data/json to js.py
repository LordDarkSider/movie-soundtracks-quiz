import json

with open('soundtracks.json', encoding="utf-8") as sdtks_data_file:
    sdtks_data = json.load(sdtks_data_file)

js = 'let data = new Map(['


for num,track in sdtks_data.items():

    js += '\n    ["'+num+'", new Map(['

    for info,value in track.items():

        if info == 'titles':
            js += ' ["'+info+'", new Map(['
            for lang,title in value.items():
                js += '["'+lang+'","'+title+'"],'
            js += ']) ],'

        else:
            js += ' ["'+info+'","'+value+'"],'

    js += ' ])],'


js += '\n]);'

print(js)
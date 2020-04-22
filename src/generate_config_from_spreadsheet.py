import pandas as pd
import json

data = pd.read_csv("spreadsheet.csv")
data = data[data["Expert Mode \nChart Display"] > 0]
data["category"] = data["Category"].str.startswith("Primary").map({True:"primary", False:"patient"})
data["show_simple"] = data["Simple Mode \nChart Display"] > 0
data["Unit"] = data["Unit"].fillna("unitless")
data.loc[data["Unit"] == "unitless", "Unit"] = None
data = data.set_index("Variable")


# updates config.json with new information from spreadsheet
with open('config.json', 'r') as f:
    config = json.load(f)


outputFormat = {}

for category in ["primary", "patient"]:
    variables = { v["key"]: v for v in config["variables"][category]}

    to_process = data[data["category"] == category]
    for key, row in to_process.iterrows():
        datum = variables.get(key, {})

        datum["key"] = key
        datum["label"] = row["Display Name"]
        datum["desc"] = row["description"]
        datum["unit"] = row["Unit"]

        # don't update: default value, interval, range. need to manually
        # enter that

        variables[key] = datum

    config["variables"][category] = list(variables.values())

    to_process = to_process[to_process["show_simple"]]
    outputFormat[category] = list(map(lambda a: [a[0].replace(' #', ''), a[1].index.tolist()], to_process.groupby("Output Chart Group")))

config["outputFormat"] = outputFormat


output = json.dumps(config, indent=True)

with open("config.json", "w") as f:
    f.write(output)
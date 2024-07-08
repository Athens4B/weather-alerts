import xml.etree.ElementTree as ET

# Example XML data (in practice, you would load this from a file)
xml_data = '''<nhc:Cyclone xmlns:nhc="http://www.nhc.noaa.gov">
<nhc:center>21.7, -95.6</nhc:center>
<nhc:type>Tropical Storm</nhc:type>
<nhc:name>Alberto</nhc:name>
<nhc:wallet>AT1</nhc:wallet>
<nhc:atcf>AL012024</nhc:atcf>
<nhc:datetime>7:00 PM CDT Wed Jun 19</nhc:datetime>
<nhc:movement>WSW at 9 mph</nhc:movement>
<nhc:pressure>995 mb</nhc:pressure>
<nhc:wind>40 mph</nhc:wind>
<nhc:headline> ...HEAVY RAINS, COASTAL FLOODING, AND GUSTY WINDS FORECAST TO CONTINUE ALONG THE COASTS OF TEXAS AND NORTHEASTERN MEXICO THROUGH THURSDAY...</nhc:headline>
</nhc:Cyclone>'''

# Parse the XML data
root = ET.fromstring(xml_data)

# Define namespaces
namespaces = {'nhc': 'http://www.nhc.noaa.gov'}

# Extract the cyclone element
cyclone = root.find('.//nhc:Cyclone', namespaces=namespaces)

# Extract the data
center = cyclone.find('nhc:center', namespaces=namespaces).text
type_ = cyclone.find('nhc:type', namespaces=namespaces).text
name = cyclone.find('nhc:name', namespaces=namespaces).text
datetime = cyclone.find('nhc:datetime', namespaces=namespaces).text
movement = cyclone.find('nhc:movement', namespaces=namespaces).text
pressure = cyclone.find('nhc:pressure', namespaces=namespaces).text
wind = cyclone.find('nhc:wind', namespaces=namespaces).text
headline = cyclone.find('nhc:headline', namespaces=namespaces).text

# Format the data for OBS
output = f"""Cyclone Name: {name}
Type: {type_}
Center: {center}
Date/Time: {datetime}
Movement: {movement}
Pressure: {pressure}
Wind: {wind}
Headline: {headline}
"""

# Write the data to a text file for OBS to read
with open('cyclone_info.txt', 'w') as file:
    file.write(output)

print("Cyclone information extracted and written to 'cyclone_info.txt'")

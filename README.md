# Collect Wikipedia historical timline data for different countries

Historical timelines are availble in wikipedia - https://en.wikipedia.org/wiki/Category:Timelines_by_country

This project scraps the timeline pages of different countries and creates year-wise json file for indivudual country. It takes help of my previous project - https://github.com/kausgang/wiki_timeline-array

This project dynamically generate nodejs script to scrap the wiki timeline page for each country. The newly generated scripts are put inside SCRIPT folder. It also generates an execute.bat file inside the main project folder to call the scripts and automate the download process. 

Run the execute.bat file to get the Historical data from wikipedia in json format. The json files will be downloaded inside DOWNLOADED_FOLDER



### Setup Instruction
Edit SOURCE/source_code.txt and enter country & wikipedia url in JSON format. It will generate a execute.bat (for windows OS). 
Run this bat file to download data.

```
git clone https://github.com/kausgang/collect_wiki_timline_data.git
cd collect_wiki_timline_data
node app.js
execute.bat
```

### More info
See https://github.com/kausgang/wiki_timeline-array for more information on downloading wikipedia historical timeline data

See https://github.com/kausgang/collate_wiki_timeline to collate the individual country's data and make a master record.



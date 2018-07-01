/* objective : dynamically generate nodejs code to automate wikipedia historical data download process 
            Refer : https://github.com/kausgang/wiki_timeline-array

Source : https://en.wikipedia.org/wiki/Category:Timelines_by_country

input : 
    1. wikipedia URL
    2. country name
output :
    1. Create SCRIPT directory. Inside it create <country>.js File for all the inputs country
    2. every js file should have proper code to download the section number 
    3. create a bat/sh file to run node process with <country>.js as input
    4. Running the execute.bat file will download the data from wikipedia
 */

//input data in this format in input.json
    //{
    //     "india" : "https://en.wikipedia.org/wiki/Timeline_of_Indian_history",
    //     "USA" : "https://en.wikipedia.org/wiki/Timeline_of_United_States_history"
    // }

var replace = require("replace");
var path = require('path');
var fs = require('fs');

var SCRIPT_DIR = 'SCRIPT';
var SOURCE_DIR = 'SOURCE';

// CHECK IF SCRIPT DIR EXISTS..IF NO THEN CREATE IT
var exists = fs.existsSync(SCRIPT_DIR)
if(!exists)
    fs.mkdirSync(SCRIPT_DIR);


// SOURCE THE INPUT FILE
var input_stream = fs.readFileSync('input.json');
var input = JSON.parse(input_stream);

// console.log(input);

var country = [], url = [];

// https://stackoverflow.com/questions/31285360/how-to-parse-json-in-javascript-having-dynamic-key-value-pair/31285404?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
Object.keys(input).forEach(function(key){
    var value = input[key];
    // console.log(key + ':####' + value);

    country.push(key);
    url.push(value);

});


// console.log(country);
// console.log(url);

// extract page title
var page_title = [];
url.forEach(page_url=>{

    //EXTRACT TITLE
        //get the last position of /
        var start = page_url.lastIndexOf('/');
        //get title
        var end = page_url.length;
        var title = page_url.slice(start+1,end);
        page_title.push(title);

});

// console.log(page_title);


//copy package.json
fs.copyFileSync(SOURCE_DIR+path.sep+'package.json',SCRIPT_DIR+path.sep+'package.json');
//copy run file
// fs.copyFileSync(SOURCE_DIR+path.sep+'execute.txt','execute.bat');
fs.copyFileSync(SOURCE_DIR+path.sep+'execute','execute.bat');

//enter initial new line after npm install
fs.appendFileSync('execute.bat','\n');


// //read the source code
for(var i=0;i<country.length;i++){

    console.log(country[i]);
    var current_country = country[i];

    // fs.copyFileSync(SOURCE_DIR+path.sep+'source_code.txt',SCRIPT_DIR+path.sep+current_country+'.js')
    fs.copyFileSync(SOURCE_DIR+path.sep+'source_code',SCRIPT_DIR+path.sep+current_country+'.js')
    
    // https://stackoverflow.com/questions/14177087/replace-a-string-in-a-file-with-nodejs?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
        replace({ //replace all the country title.
        regex: "INSERT_COUNTRY_HERE",
        replacement: current_country,
        paths: [SCRIPT_DIR+path.sep+current_country+'.js'],
        recursive: true,
        silent: true,
    });
    replace({ //replace the page title.
        regex: "INSERT_PAGE_TITLE",
        replacement: page_title[i],
        paths: [SCRIPT_DIR+path.sep+current_country+'.js'],
        recursive: true,
        silent: true,
    });

    
    fs.appendFileSync('execute.bat','call node ..'+path.sep+SCRIPT_DIR+path.sep+current_country+'.js'+'\n');    
}












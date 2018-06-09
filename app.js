/* objective : dynamically generate nodejs code to automate wikipedia historical data download process 
            Refer : https://github.com/kausgang/wiki_timeline-array

aource : https://en.wikipedia.org/wiki/Category:Timelines_by_country

input : 
    1. wikipedia URL
    2. country name
output :
    1. in the same working directory, create <country>.js File for all the inputs country
    2. every js file should have proper code to download the section number (the highest section number) and country
    3. create a bat/sh file to change the section number (bring it to 0) and run node process with <country>.js as input
 */

//input data in this format in input.json
    //{
    //     "india" : "https://en.wikipedia.org/wiki/Timeline_of_Indian_history",
    //     "USA" : "https://en.wikipedia.org/wiki/Timeline_of_United_States_history"
    // }

var fs = require('fs');
var replace = require("replace");
var path = require('path');


var SCRIPT_DIR = 'SCRIPT';
var SOURCE_DIR = 'SOURCE';


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

console.log(country);
console.log(url);

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

console.log(page_title);



// //read the source code
for(var i=0;i<country.length;i++){

    console.log(country[i]);
    var current_country = country[i];

    fs.copyFileSync(SOURCE_DIR+path.sep+'source_code.txt',SCRIPT_DIR+path.sep+current_country+'.txt')
    
    // https://stackoverflow.com/questions/14177087/replace-a-string-in-a-file-with-nodejs?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
        replace({ //replace all the country title.
        regex: "INSERT_COUNTRY_HERE",
        replacement: current_country,
        paths: [SCRIPT_DIR+path.sep+current_country+'.txt'],
        recursive: true,
        silent: true,
    });
    replace({ //replace the page title.
        regex: "INSERT_PAGE_TITLE",
        replacement: page_title[i],
        paths: [SCRIPT_DIR+path.sep+current_country+'.txt'],
        recursive: true,
        silent: true,
    });

    


    //get section
    replace_section(page_title[i],SCRIPT_DIR+path.sep+current_country+'.txt') //send the page title & copied js file

    
    
}


//copy package.json
fs.copyFileSync(SOURCE_DIR+path.sep+'package.json',SCRIPT_DIR+path.sep+'package.json');
//copy run file
fs.copyFileSync(SOURCE_DIR+path.sep+'execute.txt','execute.bat');


function replace_section(page,file){

    var request = require('request');

    var url = 'https://en.wikipedia.org/w/api.php?&action=parse&format=json&page='+page;

    request.get(url, function(err,resp_code,data) {
    
        data = JSON.parse(data);
        // console.log(data);
        var number_of_sections = data.parse.sections.length;
        console.log(number_of_sections);

        //enter initial new line after npm install
        fs.appendFileSync('execute.bat','\n');
        
        //create all js files by changing section number
        for(var i=number_of_sections;i>=1;i--){

            
            fs.copyFileSync(file,file+'_'+i+'.js'); //make a copy of the file
            replace({ //replace the section_number.
                regex: "INSERT_SECTION_NUMBER",
                replacement: i,
                paths: [file+'_'+i+'.js'],
                recursive: true,
                silent: true,
            });

            fs.appendFileSync('execute.bat','call node ..'+path.sep+file+'_'+i+'.js'+'\n');

           
        }
    });

    
    
}






var fs = require('fs');
function getJSON()
{
    var obiectJSON=fs.readFileSync("C:/Users/User/Desktop/tema-de-casa-ana0998/public/resurse/date.json",'utf8');
    var date= JSON.parse(obiectJSON);
    return date;
}

module.exports = getJSON();
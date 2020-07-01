const axios = require('axios');
const cheerio = require('cheerio');

const URL = 'http://www.banjaluka.rs.ba/iz-maticnih-knjiga-arhiva-2019-godina/?sr_pismo=lat'

var result = [];
var imena = {};
axios.get(URL).then(function(response) {
    const $ = cheerio.load(response.data);
    $('.lx-box-birth-report').each(function() {
        const title = $(this).find('.icon_box_heading').text();
        $(this).find('.icon_box_text strong').remove();
        const temp = $(this).find('.icon_box_text').text().split(':');
        if (temp.length > 1) {
            const rodjeni = temp[1].split(';');
            result[title] = rodjeni.map(function(x) {
                var s = x.split(',');
                if (s.length > 1) {
                    var ime = s[0].trim();
                    var roditelji = s[1].trim();
                    var samo_ime = ime.split(' ')[0].trim();
                    
                    if ( typeof(imena[samo_ime]) != 'undefined' ) imena[samo_ime] += 1;
                    else imena[samo_ime] = 1;
                    
                    return {
                        ime: samo_ime,
                        ime_prezime: ime,
                        roditelji: roditelji
                    };
                } else return false;
            });
        } else return false;
        
    });
    var sortable = [];
    for (ime in imena) sortable.push({ime: ime, broj: imena[ime]});
    sortable.sort(function (a, b) {
        return b.broj - a.broj;
    });
    console.log(JSON.stringify(sortable));
})

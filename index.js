var request = require('request');

/**
 * Retrieve stats for all heroes.
 *
 * @param {Function} callback - Callback function(err, data)
 */
exports.getHeroes = function(callback) {
    if (typeof callback !== 'function') {
        throw new Error('No callback supplied');
    }

    var result =[];

    request({
        uri: '/Default',
        baseUrl: 'http://www.hotslogs.com/',
    }, function(err, response, body) {
        if (!err && response.statusCode === 200) {

            //Init
            var tab = response.body.split('<table>');
            var tab1 = tab[1].split('tbody');
            
            // Image
            var tab_prep_img = tab1[1].split('//');
            for(var i = 1; i<tab_prep_img.length; i++){
                var tab_test_img = tab_prep_img[i].split('" height');
                //console.log(tab_test_img[0]);
                var item = {
                    img: "",
                    name: "",
                    games_played: "",
                    games_banned: "",
                    popularity: "",
                    victory: "",
                    progress: "",
                    type1: "",
                    type2: ""
                };
                item.img = "http://"+tab_test_img[0];
                result.push(item);
            }

            //Name
            var tab_prep_name = tab1[1].split('Hero=');
            for(var i = 1;i<tab_prep_name.length; i++){
                var tab_test_name = tab_prep_name[i].split('">');
                result[i-1].name = tab_test_name[0];
            }

            //Games_played, Games_banned, Popularity, Victory
            var tab_prep_games_played = tab1[1].split('<td>');
            var actual_item = 0;
            var counter = 0;
            for (var i = 2; i<tab_prep_games_played.length-1; i++) {
                if(tab_prep_games_played[i].indexOf('<a')<0&&tab_prep_games_played[i].indexOf('<font')<0&&actual_item<tab_prep_name.length-1){
                    var tab_test_infos = tab_prep_games_played[i].split('</td>');
                    switch(counter){
                        case 0: result[actual_item].games_played = tab_test_infos[0];
                                break;
                        case 1: result[actual_item].games_banned = tab_test_infos[0];
                                break;
                        case 2: result[actual_item].popularity = tab_test_infos[0];
                                break;
                        case 3: result[actual_item].victory = tab_test_infos[0];
                                break;
                    }
                    counter++;
                }
                else{
                    if(counter==4){
                        actual_item++;
                        counter=0;
                        //console.log("counter reset");
                    }
                }
            }

            //Types
            var tab_prep_type1 = tab1[1].split('display:none;">');
            actual_item=0;
            counter=0;
            for(var i = 1;i<tab_prep_type1.length;i++){
                var tab_test_type1 = tab_prep_type1[i].split('<');
                switch(counter){
                    case 0: result[actual_item].type1 = tab_test_type1[0];
                            break;
                    case 1: result[actual_item].type2 = tab_test_type1[0];
                            break;
                }
                if(counter==1){
                    actual_item++;
                    counter=0;
                }
                else{
                    counter++;
                }
            }

            //Progress
            actual_item=0;
            for(var i = 0;i<tab_prep_type1.length;i=i+2){
                if(tab_prep_type1[i].indexOf('<font')>=0){
                    var tab_prep1_progress = tab_prep_type1[i].split('<font color');
                    var tab_prep2_progress = tab_prep1_progress[1].split('</font>');
                    var tab_prep3_progress= tab_prep2_progress[0].split('>');
                    result[actual_item].progress=tab_prep3_progress[1];
                    actual_item++;
                }
            }
            
            callback(null, result);
        } else {
            callback(err);
        }
    });
};

exports.getMaps = function(callback){
    if (typeof callback !== 'function') {
        throw new Error('No callback supplied');
    }

    var maps = [];

    request({
        uri: '/Default',
        baseUrl: 'http://www.hotslogs.com/',
    }, function(err, response, body) {
        if (!err && response.statusCode === 200) {

            //Init
            var tab = response.body.split('<table class="rgMasterTable"');
            var tab2 = tab[2].split('<tbody>');
            var tab3 = tab2[1].split('</tbody');
            var allMaps = tab3[0].split('<tr ');
            for(var i = 1; i<allMaps.length; i++){

                var item = {
                    name: "",
                    img: "",
                    games_played: "",
                    average_time: ""
                };

                //Name
                var tab_prep_name = allMaps[i].split('<a title="');
                var tab_test_name = tab_prep_name[1].split('"');
                item.name = tab_test_name[0];

                //Image
                var tab_prep_img = allMaps[i].split('//');
                var tab_test_img = tab_prep_img[1].split('" ');
                item.img = "http://"+tab_test_img[0];

                //Average time && Games played
                var tab_prep = allMaps[i].split('</td>');
                var tab_test_games_played = tab_prep[3].split('<td>');
                item.games_played = tab_test_games_played[1];
                var tab_test_average_time = tab_prep[4].split('<td>');
                item.average_time = tab_test_average_time[1];

                maps.push(item);
            }
            //console.log(maps);
            callback(null, maps);
        }
        else{
            callback(err);
        }
    });
};


/**
 * Retrieve builds for a hero.
 *
 * @param {Object} name - Hero name
 * @param {Function} callback - Callback function(err, data)
 */
exports.getBuildsHero = function(name, callback) {
    if (typeof callback !== 'function') {
        throw new Error('No callback supplied');
    }
    
    if (typeof name !== 'object') {
        if (typeof name !== 'string') {
            throw new Error('Non-object supplied');
        }
        else{
            if(name.indexOf('&#39;')>=0){
                name = name.replace('&#39;', '%27');
            }
        }
    }



    var result = {
        level1: [],
        level4: [],
        level7: [],
        level10: [],
        level13: [],
        level16: [],
        level20: [],
        errors: []
    };

        request({
            uri: '/Sitewide/HeroDetails?Hero='+name,
            baseUrl: 'http://www.hotslogs.com/',
            json: true
        }, function(err, response, body) {
            if (!err && response.statusCode === 200) {
                
                //Init
                var tab = response.body.split('<table>');
                var tab1 = tab[1].split('tbody');
                var tab_levels = tab1[1].split('Level');

                //console.log(tab_levels[1]);

                //Each levels(1, 4, 7, 10, 13, 16, 20)
                for(var actual_level = 1;actual_level<tab_levels.length;actual_level++){
                    var counter=0;
                    //Img
                    var tab_prep_img = tab_levels[actual_level].split('//');
                    for(var i = 1;i<tab_prep_img.length;i++){
                        var tab_test_img = tab_prep_img[i].split('" height');
                        var item = {
                            img: "",
                            name: "",
                            description: "",
                            games_played: "",
                            popularity: "",
                            victory: ""
                        };
                        item.img = "http://"+tab_test_img[0];
                        switch(actual_level){
                            case 1: result.level1.push(item);
                                    break;
                            case 2: result.level4.push(item);
                                    break;
                            case 3: result.level7.push(item);
                                    break;
                            case 4: result.level10.push(item);
                                    break;
                            case 5: result.level13.push(item);
                                    break;
                            case 6: result.level16.push(item);
                                    break;
                            case 7: result.level20.push(item);
                                    break;
                        }
                    }
                    //console.log(result.level4);
                    //
                    var tab_prep_infos = tab_levels[actual_level].split('class="rgGroupHeader"');
                    //console.log(tab_prep_infos);
                    var tab_prep_infos2 = tab_prep_infos[0].split('</td>');
                    //console.log(tab_prep_infos2);
                    var actual_build=0;
                    counter=0;
                    for(var i = 1;i<tab_prep_infos2.length-1;i++){
                        //console.log(tab_prep_infos2[i]);
                        if(tab_prep_infos2[i].indexOf('<tr title')<0&&tab_prep_infos2[i].indexOf('display:none')<0&&tab_prep_infos2[i].indexOf('align')<0&&tab_prep_infos2[i].indexOf('rgGroupHeader')<0){
                            var tab_test_infos = tab_prep_infos2[i].split('<td>');
                            //console.log(tab_test_infos[1]);
                            switch(actual_level){
                                case 1: switch(counter){
                                            case 0: result.level1[actual_build].name = tab_test_infos[1];
                                                    break;
                                            case 1: result.level1[actual_build].games_played = tab_test_infos[1];
                                                    break;
                                            case 2: result.level1[actual_build].popularity = tab_test_infos[1];
                                                    break;
                                            case 3: result.level1[actual_build].victory = tab_test_infos[1];
                                                    break;
                                        }
                                        break;
                                case 2: switch(counter){
                                            case 0: result.level4[actual_build].name = tab_test_infos[1];
                                                    break;
                                            case 1: result.level4[actual_build].games_played = tab_test_infos[1];
                                                    break;
                                            case 2: result.level4[actual_build].popularity = tab_test_infos[1];
                                                    break;
                                            case 3: result.level4[actual_build].victory = tab_test_infos[1];
                                                    break;
                                        }
                                        break;
                                case 3: switch(counter){
                                            case 0: result.level7[actual_build].name = tab_test_infos[1];
                                                    break;
                                            case 1: result.level7[actual_build].games_played = tab_test_infos[1];
                                                    break;
                                            case 2: result.level7[actual_build].popularity = tab_test_infos[1];
                                                    break;
                                            case 3: result.level7[actual_build].victory = tab_test_infos[1];
                                                    break;
                                        }
                                        break;
                                case 4: switch(counter){
                                            case 0: result.level10[actual_build].name = tab_test_infos[1];
                                                    break;
                                            case 1: result.level10[actual_build].games_played = tab_test_infos[1];
                                                    break;
                                            case 2: result.level10[actual_build].popularity = tab_test_infos[1];
                                                    break;
                                            case 3: result.level10[actual_build].victory = tab_test_infos[1];
                                                    break;
                                        }
                                        break;
                                case 5: switch(counter){
                                            case 0: result.level13[actual_build].name = tab_test_infos[1];
                                                    break;
                                            case 1: result.level13[actual_build].games_played = tab_test_infos[1];
                                                    break;
                                            case 2: result.level13[actual_build].popularity = tab_test_infos[1];
                                                    break;
                                            case 3: result.level13[actual_build].victory = tab_test_infos[1];
                                                    break;
                                        }
                                        break;
                                case 6: switch(counter){
                                            case 0: result.level16[actual_build].name = tab_test_infos[1];
                                                    break;
                                            case 1: result.level16[actual_build].games_played = tab_test_infos[1];
                                                    break;
                                            case 2: result.level16[actual_build].popularity = tab_test_infos[1];
                                                    break;
                                            case 3: result.level16[actual_build].victory = tab_test_infos[1];
                                                    break;
                                        }
                                        break;
                                case 7: switch(counter){
                                            case 0: result.level20[actual_build].name = tab_test_infos[1];
                                                    break;
                                            case 1: result.level20[actual_build].games_played = tab_test_infos[1];
                                                    break;
                                            case 2: result.level20[actual_build].popularity = tab_test_infos[1];
                                                    break;
                                            case 3: result.level20[actual_build].victory = tab_test_infos[1];
                                                    break;
                                        }
                                        break;
                            }
                            counter++;
                        }
                        else if(tab_prep_infos2[i].indexOf('<tr title')>=0){
                            var tab_prep_infos3 = tab_prep_infos2[i].split('<tr title="');
                            var tab_prep_infos4 = tab_prep_infos3[1].split('"');
                            //console.log(tab_prep_infos4[0]);
                            switch(actual_level){
                                case 1: switch(counter){
                                            case 0: result.level1[actual_build].description = tab_prep_infos4[0];
                                                    break;
                                        }
                                        break;
                                case 2: switch(counter){
                                            case 0: result.level4[actual_build].description = tab_prep_infos4[0];
                                                    break;
                                        }
                                        break;
                                case 3: switch(counter){
                                            case 0: result.level7[actual_build].description = tab_prep_infos4[0];
                                                    break;
                                        }
                                        break;
                                case 4: switch(counter){
                                            case 0: result.level10[actual_build].description = tab_prep_infos4[0];
                                                    break;
                                        }
                                        break;
                                case 5: switch(counter){
                                            case 0: result.level13[actual_build].description = tab_prep_infos4[0];
                                                    break;
                                        }
                                        break;
                                case 6: switch(counter){
                                            case 0: result.level16[actual_build].description = tab_prep_infos4[0];
                                                    break;
                                        }
                                        break;
                                case 7: switch(counter){
                                            case 0: result.level20[actual_build].description = tab_prep_infos4[0];
                                                    break;
                                        }
                                        break;
                            }
                        }
                        if(counter==4){
                            //console.log('push');
                            counter=0;
                            actual_build++;
                        }

                    }
                    //console.log(result.level7);
                    //console.log(result.level4);
                }
                //console.log(result);
            } else {
                result.errors.push({'success': false});
            }
            callback(null, result);
        });
};
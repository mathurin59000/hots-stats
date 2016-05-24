# Heroes of the storm stats checker for Node.js

## Installation

Install using:
```js
npm install hots-stats
```

## Usage

### Get all heros data
**Input:**
```js
var hots = require('hots-stats');

hots.getHeroes(function(err, data) {
    if(!err) {
        console.log(data);
    }
});
```

**Output:**
```
[ { img: 'http://d1i1jxrdh2kvwy.cloudfront.net/Images/Heroes/Portraits/TheLostVikings.png',
    name: 'The Lost Vikings',
    games_played: '4286',
    games_banned: '1986',
    popularity: '4.5 %',
    victory: '57.3 %',
    progress: '2.1 %',
    type1: 'Specialist',
    type2: 'Utility' },
  { img: 'http://d1i1jxrdh2kvwy.cloudfront.net/Images/Heroes/Portraits/Rexxar.png',
    name: 'Rexxar',
    games_played: '4818',
    games_banned: '183',
    popularity: '3.6 %',
    victory: '55.6 %',
    progress: '3.3 %',
    type1: 'Warrior',
    type2: 'Tank' },
  { ... },
  ... ]
```

### Get all maps data
**Input:**
```js
var hots = require('hots-stats');

hots.getMaps(function(err, maps) {
    if(!err) {
        console.log(maps);
    }
});
```

**Output:**
```
[ { name: 'Battlefield of Eternity',
    img: 'http://d1i1jxrdh2kvwy.cloudfront.net/Images/Maps/BattlefieldofEternity.png',
    games_played: '15558',
    average_time: '00:20:13' },
  { name: 'Blackheart&#39;s Bay',
    img: 'http://d1i1jxrdh2kvwy.cloudfront.net/Images/Maps/BlackheartsBay.png',
    games_played: '15249',
    average_time: '00:21:10' },
  { ... },
  ... ]
```


### Get single hero data
**Input:**
```js
var hots = require('hots-stats');

hots.getBuildsHero("Greymane", function(data) {
    console.log(data);
});

hots.getHeroes(function(err, data){
	hots.getBuildsHero(heroes[4].name, function(data){
		console.log(data)
	});
});
```

**Output:**
```
{ level1:
   [ { img: 'http://d1i1jxrdh2kvwy.cloudfront.net/Images/Talents/ExtendedSpikes.png',
       name: 'Extended Spikes',
       description: 'Increases the max range of Impale by 25%.',
       games_played: '1985',
       popularity: '12.8 %',
       victory: '47.7 %' },
      { ... } ],
   level4: [ ... ],
   level7: [ ... ],
   level10:[ ... ],
   level13:[ ... ],
   level16:[ ... ],
   level20:[ ... ] }
```


```

## License
MIT


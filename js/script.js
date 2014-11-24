"use strict";

var tileBank = [];
var idx;
var timer;
var startTime;
var seconds;

//Creates tiles and adds them to the tiles array
for (idx = 1; idx <= 32; idx++) {
    tileBank.push({
        num: idx,
        src: "img/tile" + idx + ".jpg",
        matched: false,
        clicked: false
    });
}

$(document).ready(function() {
    $('#start').click(function() {
        //Set up for stats
        seconds = 0;
        var attempts = 0;
        var matches = 0;
        var remaining = 8;
        
        $('#game-board').css('display', 'none');
        $('#game-board').empty();
        $('#game-board').css('display', 'inline');
        $('#win').css('display', 'none');
        
        $('#found').text('Pairs found: ');
        $('#remain').text('Pairs left: ');
        $('#attempts').text('Number of turns: ');

        
        startTime = _.now();
        timer = window.setInterval(onTimer, 1000);
        
        //Select tiles from tileBank
        var gameTiles = [];
        tileBank = _.shuffle(tileBank);
        
        gameTiles = tileBank.slice(0, 8);
        
        _.forEach(gameTiles, function(tile) {
            tile.clicked = false;
            tile.matched = false;
            gameTiles.push(_.clone(tile));
        });
        
        gameTiles = _.shuffle(gameTiles);
        
        //Set up the tiles in 4 x 4
        var gameBoard = $('#game-board');
        var row = $(document.createElement('div'));
        var img;

        _.forEach(gameTiles, function(tile, elemIndex) {
            if (elemIndex > 0 && elemIndex % 4 == 0) {
                gameBoard.append(row);
                row = $(document.createElement('div'));
            }
            var img = $(document.createElement('img'));
            img.attr('src', 'img/tile-back.png'); //swap to 'img/tile-back.png' for start
            img.attr('alt', 'tile ' + tile.num);
            img.attr('width', '250px');
            
            img.data('tile', tile);
            
            row.append(img);
        });
        gameBoard.append(row);
        
        //tracking clicks
        var tile1;
        var tile2;
        var clicks = 0;
        var timeout = null;
        $('#game-board img').click(function() {
            if(timeout != null) {
                if(!tile1.clicked) {
                    window.setTimeout(function() {
                        clearTimeout(timeout);    
                        timeout = null;
                    }, 1000);
                }
                return;
            }
            if($(this).data('tile').clicked) {
                return;
            }
            clicks++;
            if (clicks % 2 != 0) {
                tile1 = $(this);
                flipTile(tile1.data('tile'), tile1);
            }
            if (clicks % 2 == 0) {
                tile2 = $(this);
                flipTile(tile2.data('tile'), tile2);
                if (tile1.data('tile').num == tile2.data('tile').num) {
                    matches++;
                    remaining--;
                    $('#found').text('Pairs found: ' + matches);
                    $('#remain').text('Pairs left: ' + remaining);
                    tile1.matched = true;
                    tile2.matched = true;
                } else {
                    timeout = window.setTimeout(function() {
                        attempts++;
                        flipTile(tile1.data('tile'), tile1);
                        flipTile(tile2.data('tile'), tile2);
                        $('#attempts').text('Number of turns: ' + attempts);
                        timeout = null;
                    }, 1000);

                }   
            }
            
            if (matches == 8) {
                stopTimer();
                $('#game-board').text('You win!');
                $('#win').css('display', 'block');
            }
        }); //img click
        
    }); //start click
}); //document ready

function flipTile(tile, img) {
    img.fadeOut(100, function() {
        if (tile.clicked) {
            img.attr('src', 'img/tile-back.png');
        } else {
            img.attr('src', tile.src)
        }
        tile.clicked = !tile.clicked;
        img.fadeIn(100);
    });
};

function onTimer() {
    seconds = Math.floor((_.now() - startTime) / 1000);
    $('#time').text("You've been playing for " + seconds + " seconds!");
} //onTimer()

function stopTimer() {
    window.clearInterval(timer);
} //stopTimer()
/*
File: script.js
GUI Assignment: HW5 Scrabble Row
Timothy Retelle, UMass Lowell Computer Science, timothy_retelle@student.uml.edu
Copyright (c) 2022 by Timothy Retelle. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author. This is a small site to generate multiplication tables.
updated on June 29th, 2022
*/
const allTiles = ['A','A','A','A','A','A','A','A','A','B','B','C','C','D','D','D','D','E','E','E','E','E','E','E','E','E','E','E','E','F','F','G','G','G','H','H','I','I','I','I','I','I','I','I','I','J','K','L','L','L','L','M','M','N','N','N','N','N','N','O','O','O','O','O','O','O','O','P','P','Q','R','R','R','R','R','R','S','S','S','S','T','T','T','T','T','T','U','U','U','U','V','V','W','W','X','Y','Y','Z','_','_'];
const tiles = new Array(7);
let pickTile = 0;
let max = 100;
/*  File:  /~heines/91.461/91.461-2015-16f/461-assn/Scrabble_Pieces_AssociativeArray_Jesse.js
 *  Jesse M. Heines, UMass Lowell Computer Science, heines@cs.uml.edu
 *  Copyright (c) 2015 by Jesse M. Heines.  All rights reserved.  May be freely 
 *    copied or excerpted for educational purposes with credit to the author.
 *  updated by JMH on November 21, 2015 at 10:27 AM
 *  updated by JMH on November 25, 2015 at 10:58 AM to add the blank tile
 *  updated by JMH on November 27, 2015 at 10:22 AM to add original-distribution
 */
var ScrabbleTiles = [] ;
ScrabbleTiles["A"] = { "value" : 1 } ;
ScrabbleTiles["B"] = { "value" : 3 } ;
ScrabbleTiles["C"] = { "value" : 3 } ;
ScrabbleTiles["D"] = { "value" : 2 } ;
ScrabbleTiles["E"] = { "value" : 1 } ;
ScrabbleTiles["F"] = { "value" : 4 } ;
ScrabbleTiles["G"] = { "value" : 2 } ;
ScrabbleTiles["H"] = { "value" : 4 } ;
ScrabbleTiles["I"] = { "value" : 1 } ;
ScrabbleTiles["J"] = { "value" : 8 } ;
ScrabbleTiles["K"] = { "value" : 5 } ;
ScrabbleTiles["L"] = { "value" : 1 } ;
ScrabbleTiles["M"] = { "value" : 3 } ;
ScrabbleTiles["N"] = { "value" : 1 } ;
ScrabbleTiles["O"] = { "value" : 1 } ;
ScrabbleTiles["P"] = { "value" : 3 } ;
ScrabbleTiles["Q"] = { "value" : 1 } ;
ScrabbleTiles["R"] = { "value" : 1 } ;
ScrabbleTiles["S"] = { "value" : 1 } ;
ScrabbleTiles["T"] = { "value" : 1 } ;
ScrabbleTiles["U"] = { "value" : 1 } ;
ScrabbleTiles["V"] = { "value" : 4 } ;
ScrabbleTiles["W"] = { "value" : 4 } ;
ScrabbleTiles["X"] = { "value" : 8 } ;
ScrabbleTiles["Y"] = { "value" : 4 } ;
ScrabbleTiles["Z"] = { "value" : 1 } ;
ScrabbleTiles["_"] = { "value" : 0 } ;
makeLetters();
function makeLetters(){
	for(let i=0; i<7; i++){
		$('#tile' + i).remove();//remove letters if they're already there
		pickTile = Math.floor(Math.random()*max);
		tiles[i]=allTiles[pickTile];
		allTiles.splice(pickTile,1);//remove the chosen tile
		max--;//now that there are fewer tiles remaining, make sure we dont pick out of bounds
		$('#tilerack').append(//insert the images
			'<img class="tile" id="tile' + i + '" src="graphics_data/Scrabble_Tiles/Scrabble_Tile_' + tiles[i] + '.jpg" style="width:70px; height: 70px; margin-left: 5px"/>');
	}
	$(".tile").draggable({//make the tiles draggable
		containment: '#board',
		grid: [75, 80]//constrain to board squares
	});
}

function wordSubmit(){
	var err = false;
	var doubleWord = false;
	const positions = [
		{
			id: "#tile0",
			pos: 0,
		},
		{
			id: "#tile1",
			pos: 0,
		},
		{
			id: "#tile2",
			pos: 0,
		},
		{
			id: "#tile3",
			pos: 0,
		},
		{
			id: "#tile4",
			pos: 0,
		},
		{
			id: "#tile5",
			pos: 0,
		},
		{
			id: "#tile6",
			pos: 0,
		}];
	for(let i=0; i<7; i++){
		var elem = document.getElementById("tile" + i);
		var positionBox = elem.getBoundingClientRect();//used to get positions
		if(positionBox.top == 12)//only use a tile if its on the board
			positions[i].pos = positionBox.left;//get x coordinates for all tiles
	}
	positions.sort((a, b) => a.pos - b.pos);//sort the array by position, putting the letters in the order they're used for the word
	var word = "";
	var score = 0;
	for(let i=0; i<7; i++){
		var prev = 0;
		if(positions[i].pos!=0){
			if(i!=0){
				prev = positions[i-1].pos;
			}
			if(positions[i].pos == prev){//no overlapping tiles
				err = true;
			}
			if(positions[i].pos - 76 >= prev && prev != 0){//no gaps between tiles
				err = true;
			}
			var image = $(positions[i].id).attr('src').split('/');
			var filename = image[image.length -1];//get the letter
			word += filename.substring(14,15);
			score+=ScrabbleTiles[filename.substring(14,15)].value;
			if(positions[i].pos == 463 || positions[i].pos == 613)//if its on a double letter, add the value again
				score+=ScrabbleTiles[filename.substring(14,15)].value;
			if(!doubleWord)
				doubleWord = (positions[i].pos == 163 || positions[i].pos == 913)//double word flag
		}
	}
	if(doubleWord)
		score*=2;
	if(err){
		$('#result').text("Error: Overlapping tiles or gaps");
	}
	else{
		$('#result').text("The word " + word + " is worth " + score + " points!");
	}
	makeLetters();//call makeLetters for the next batch after the word is played
}
	
	
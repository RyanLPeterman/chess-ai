var init = function() {

	var board,
	  game = new Chess();

	// do not pick up pieces if the game is over
	// only pick up pieces for White
	var onDragStart = function(source, piece, position, orientation) {
	  if (game.in_checkmate() === true || game.in_draw() === true ||
	    piece.search(/^b/) !== -1) {
	    return false;
	  }

	};
	var getScore= function(player) { //white true black false
		console.log(game.board());

		var currentBoard=game.board();
		var whiteScore=0;
		var blackScore=0;

		for(var i=0; i<currentBoard.length; i++){
			var row = currentBoard[i];

			for(var j=0; j<row.length; j++){
				var square = row[j];

				console.log(square);
			}
		}
		return 0;
	// whiteScore-blackScore
	};

	var onDrop = function(source, target) {
	  // see if the move is legal
	  var move = game.move({
	    from: source,
	    to: target,
	    promotion: 'q' // NOTE: always promote to a queen for example simplicity
	  });

	  // illegal move
	  if (move === null) return 'snapback';

	  // make random legal move for black
	  window.setTimeout(makeMove, 100);
	};

	// update the board position after the piece snap
	// for castling, en passant, pawn promotion
	var onSnapEnd = function() {
	  board.position(game.fen());
	};

	var makeMove = function() {
	  var possibleMoves = game.moves({ verbose: true });
	  	console.log("getScore returned ",getScore(true));

	  // game over
	  if (possibleMoves.length === 0) {
	  	alert("The Game is Over");
	  	// TODO: reset the board here
	  	return;
	  }

	  for (var i = 0; i<possibleMoves.length; i++) {


	  	// thisMove contains for example { color: 'w', from: 'a2', to: 'a3', flags: 'n', piece: 'p', san 'a3' }
		var thisMove=possibleMoves[i];
		//console.log(thisMove);

		// thisMove is a capturing move
		if(thisMove.flags.indexOf("c")> -1)
		{
			game.move(thisMove.san);
		}
	  }

	  // pick a random index
	  	var randomIndex = Math.floor(Math.random() * possibleMoves.length);
	  game.move(possibleMoves[randomIndex]);
	  board.position(game.fen());
	};

	var cfg = {
	  draggable: true,
	  position: 'start',
	  onDragStart: onDragStart,
	  onDrop: onDrop,
	  onSnapEnd: onSnapEnd
	};

	board = ChessBoard('board', cfg);
}

$(document).ready(init);
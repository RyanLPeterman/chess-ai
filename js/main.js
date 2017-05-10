var init = function() {

	var board,
	  game = new Chess();

	var removeGreySquares = function() {
	  $('#board .square-55d63').css('background', '');
	};

	var greySquare = function(square) {
	  var squareEl = $('#board .square-' + square);

	  var background = '#a9a9a9';
	  if (squareEl.hasClass('black-3c85d') === true) {
		background = '#696969';
	  }

	  squareEl.css('background', background);
	};

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
	  removeGreySquares();
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

	var onMouseoverSquare = function(square, piece) {
	  // get list of possible moves for this square
	  var moves = game.moves({
		square: square,
		verbose: true
	  });

	  // exit if there are no moves available for this square
	  if (moves.length === 0) return;

	  // highlight the square they moused over
	  greySquare(square);

	  // highlight the possible squares for this piece
	  for (var i = 0; i < moves.length; i++) {
		greySquare(moves[i].to);
	  }
	};

	var onMouseoutSquare = function(square, piece) {
	  removeGreySquares();
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
	  onMouseoutSquare: onMouseoutSquare,
      onMouseoverSquare: onMouseoverSquare,
	  onSnapEnd: onSnapEnd
	};

	board = ChessBoard('board', cfg);
}

$(document).ready(init);
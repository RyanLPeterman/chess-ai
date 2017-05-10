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

	// if player == true, then its from whites perspective
	var getScore = function(board) { //white true black false
		var score = 0;

		for(var i = 0; i < board.length; i++){
			var row = board[i];

			for(var j=0; j<row.length; j++){
				var square = row[j];

				var pieceVal = 0;
				// if we have a piece
				if (square !== null) {
					switch(square.type) {
						case 'p': // pawn
							pieceVal = 10;
							break;
						case 'r': // rook
							pieceVal = 50;
							break;
						case 'n': // knight
							pieceVal = 30;
							break;
						case 'b': // bishop
							pieceVal = 30;
							break;
						case 'q': // queen
							pieceVal = 90;
							break;
						case 'k': // king
							pieceVal = 900;
							break;
						default:
							console.log("Piece not recognized");
							break;
					}

					// we are evaluating from black's perspective
					if(square.color === 'w') {
						pieceVal *= -1;
					}

					score += pieceVal;
				}
			}
		}
		return score;
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

	// finds the best move for current player, returns obj for the
	// sake of outer function
	var minimax = function(depth, game, isMaximizingPlayer) {
		// if done recursing
		if (depth === 0) {
			// return the score of the other player
			return {score: getScore(game.board()), move: null};
		}

		var moves = game.ugly_moves();
		var bestMove;
		var bestVal;

		if (isMaximizingPlayer) {
			bestVal = -99999;

			// for all possible moves
			for(var i = 0; i < moves.length; i++) {
				// make a move
				game.ugly_move(moves[i]);

				// get the value of a move based on trying a few moves via minimax
				var currVal = minimax(depth - 1, game, !isMaximizingPlayer).score;

				// if minimax move is better than value we've seen so far save it
				if(bestVal < currVal) {
					bestMove = moves[i];
					bestVal = currVal;
				}

				// undo move
				game.undo();
			}
		}
		// minimizing player
		else {
			bestVal = 99999;

			// for all possible moves
			for(var i = 0; i < moves.length; i++) {
				// make a move
				game.ugly_move(moves[i]);

				// get the value of a move based on trying a few moves via minimax
				var currVal = minimax(depth - 1, game, !isMaximizingPlayer).score;

				// if minimax move is better than value we've seen so far save it
				if(bestVal > currVal) {
					bestMove = moves[i];
					bestVal = currVal;
				}

				// undo move
				game.undo();
			}
		}

		return {score: bestVal, move: bestMove};
	}

	var makeMove = function() {
		var possibleMoves = game.moves();

		// find bestMove as maximizing player
		var bestMove = minimax(1, game, true).move;
		game.ugly_move(bestMove);
		board.position(game.fen());
	};

	var makeRandomMove = function() {

		var possibleMoves = game.moves();
		// exit if the game is over
		if (game.game_over() === true ||
		    game.in_draw() === true ||
		    possibleMoves.length === 0) return;

		var randomIndex = Math.floor(Math.random() * possibleMoves.length);
		game.move(possibleMoves[randomIndex]);
		board.position(game.fen());

		window.setTimeout(makeMove, 500);
	}

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

	// window.setTimeout(makeRandomMove, 500);
}

$(document).ready(init);
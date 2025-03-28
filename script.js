class ChessGame {
    constructor() {
        this.board = [];
        this.currentTurn = 'white';
        this.selectedPiece = null;
        this.moveHistory = [];
        this.initializeBoard();
        this.setupEventListeners();
    }

    initializeBoard() {
        const initialPosition = [
            ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
            ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
            ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
        ];

        const chessboard = document.querySelector('.chessboard');
        chessboard.innerHTML = '';

        for (let row = 0; row < 8; row++) {
            this.board[row] = [];
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'white' : 'black'}`;
                square.dataset.row = row;
                square.dataset.col = col;
                
                if (initialPosition[row][col]) {
                    const piece = document.createElement('div');
                    piece.className = 'piece';
                    piece.textContent = initialPosition[row][col];
                    piece.dataset.color = row < 2 ? 'black' : 'white';
                    square.appendChild(piece);
                }
                
                this.board[row][col] = square;
                chessboard.appendChild(square);
            }
        }
    }

    setupEventListeners() {
        const chessboard = document.querySelector('.chessboard');
        const resetButton = document.getElementById('resetGame');
        const undoButton = document.getElementById('undoMove');

        chessboard.addEventListener('click', (e) => {
            const square = e.target.closest('.square');
            if (!square) return;

            const row = parseInt(square.dataset.row);
            const col = parseInt(square.dataset.col);
            this.handleSquareClick(row, col);
        });

        resetButton.addEventListener('click', () => {
            this.resetGame();
        });

        undoButton.addEventListener('click', () => {
            this.undoMove();
        });
    }

    handleSquareClick(row, col) {
        const square = this.board[row][col];
        const piece = square.querySelector('.piece');

        if (this.selectedPiece) {
            if (this.isValidMove(this.selectedPiece, row, col)) {
                this.movePiece(this.selectedPiece, row, col);
            }
            this.clearHighlights();
            this.selectedPiece = null;
            return;
        }

        if (piece && piece.dataset.color === this.currentTurn) {
            this.selectedPiece = piece;
            this.highlightValidMoves(row, col);
        }
    }

    isValidMove(piece, targetRow, targetCol) {
        const currentSquare = piece.parentElement;
        const currentRow = parseInt(currentSquare.dataset.row);
        const currentCol = parseInt(currentSquare.dataset.col);
        const pieceType = piece.textContent;
        const pieceColor = piece.dataset.color;

        // Basic validation: can't capture own pieces
        const targetSquare = this.board[targetRow][targetCol];
        const targetPiece = targetSquare.querySelector('.piece');
        if (targetPiece && targetPiece.dataset.color === pieceColor) {
            return false;
        }

        // Implement piece-specific movement rules here
        // This is a simplified version - you'll want to add proper chess rules
        return true;
    }

    movePiece(piece, targetRow, targetCol) {
        const currentSquare = piece.parentElement;
        const currentRow = parseInt(currentSquare.dataset.row);
        const currentCol = parseInt(currentSquare.dataset.col);

        // Store move in history
        this.moveHistory.push({
            piece: piece.cloneNode(true),
            from: { row: currentRow, col: currentCol },
            to: { row: targetRow, col: targetCol },
            captured: this.board[targetRow][targetCol].querySelector('.piece')
        });

        // Move the piece
        const targetSquare = this.board[targetRow][targetCol];
        targetSquare.innerHTML = '';
        targetSquare.appendChild(piece);

        // Update turn
        this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';
        document.querySelector('.player-turn').textContent = `Current Turn: ${this.currentTurn}`;
    }

    highlightValidMoves(row, col) {
        this.clearHighlights();
        this.board[row][col].classList.add('selected');

        // Highlight potential moves (simplified)
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.isValidMove(this.selectedPiece, i, j)) {
                    this.board[i][j].classList.add('highlighted');
                }
            }
        }
    }

    clearHighlights() {
        document.querySelectorAll('.square').forEach(square => {
            square.classList.remove('highlighted', 'selected');
        });
    }

    resetGame() {
        this.currentTurn = 'white';
        this.selectedPiece = null;
        this.moveHistory = [];
        document.querySelector('.player-turn').textContent = 'Current Turn: White';
        this.initializeBoard();
    }

    undoMove() {
        if (this.moveHistory.length === 0) return;

        const lastMove = this.moveHistory.pop();
        const fromSquare = this.board[lastMove.from.row][lastMove.from.col];
        const toSquare = this.board[lastMove.to.row][lastMove.to.col];

        // Restore the piece to its original position
        toSquare.innerHTML = '';
        fromSquare.innerHTML = '';
        fromSquare.appendChild(lastMove.piece);

        // Restore captured piece if any
        if (lastMove.captured) {
            toSquare.appendChild(lastMove.captured);
        }

        // Update turn
        this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';
        document.querySelector('.player-turn').textContent = `Current Turn: ${this.currentTurn}`;
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ChessGame();
}); 
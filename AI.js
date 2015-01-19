//-----------------------------------------------------------
//  AI instance
//-----------------------------------------------------------
var AI = (function(_) {
    const AI_DEPTH = 6;

    var myTurn = DISK.WHITE,
        oppTurn = DISK.BLACK,
        node;

    prop(_, "turn", null, function() {
        return myTurn
    });

    prop(_, "node", null, function() {
        return node
    });

    _.initialize = function() {
        Game.bind("turnchange", function(turn) {
            if (turn === myTurn) {
                setTimeout(function() {
                    _.decide()
                }, 10);
            }
        });
    };

    _.decide = function() {
        var n = 0,
            evaluateFn = _.eval1,
            depth = AI_DEPTH,
            res;

        //ノードの更新
        node = Game.node.copy();

        if (myTurn == DISK.BLACK) depth = 0;
        res = minimax(node, depth);

        Game.put(res.x, res.y);

        function minimax(node, depth) {
            var bestScore = -99999,
                puttable = node.puttable,
                children = [],
                child, startTime, endTime, putPos;

            alphabeta.count = 0;
            startTime = +(new Date());

            for (var x = 1; x <= 8; x++) {
                for (var y = 1; y <= 8; y++) {
                    if (puttable[x][y]) {
                        child = node.copy();
                        child.putAndReverse(x, y);
                        child.putPos = {
                            x: x,
                            y: y
                        }
                        children.push(child);
                    }
                }
            }
            for (var i = 0, max = children.length; i < max; i++) {
                var child = children[i],
                    score = alphabeta(child, depth - 1, -99999, 99999);

                if (bestScore < score) {

                    bestScore = score;
                    putPos = child.putPos;

                } else if (bestScore == score) {
                    if (Math.random() * 2 > 1) putPos = child.putPos;
                }
            }

            endTime = +(new Date());

            Node.showInfo();
            console.log("====================================");
            console.log("AI Information");
            console.log("  Time(ms)           : " + (endTime - startTime));
            console.log("  Calc Time          : " + alphabeta.count);
            console.log("  bestScore          : " + bestScore);

            return putPos;
        }

        function alphabeta(node, depth, alpha, beta) {
            var children = [],
                puttable = node.puttable,
                child;

            alphabeta.count++;
            if (depth <= 0 || node.turn === DISK.EMPTY) {
                return _.eval1(node);
            }

            //子ノード作成
            for (var x = 1; x <= 8; x++) {
                for (var y = 1; y <= 8; y++) {
                    if (puttable[x][y]) {
                        child = node.copy();
                        child.putAndReverse(x, y);
                        children.push(child);
                    }
                }
            }

            if (node.turn == myTurn) {
                for (var i = 0, max = children.length; i < max; i++) {
                    child = children[i];
                    alpha = Math.max(alpha, alphabeta(child, depth - 1, alpha, beta));
                    if (alpha >= beta) {
                        return beta
                    }
                }
                return alpha
            } else {
                for (var i = 0, max = children.length; i < max; i++) {
                    child = children[i];
                    beta = Math.min(beta, alphabeta(child, depth - 1, alpha, beta));
                    if (beta <= alpha) {
                        return alpha
                    }
                }
                return beta
            }
        }
    };

    //ボードの状態を指定すると評価を返す
    _.eval1 = function(node) {
        var score = 0,
            board = node.board,
            turn = node.turn,
            count = node.count,
            oppTurn = 3 - myTurn,
            puttable = node.puttable;

        if (turn == DISK.EMPTY) {
            if (count[oppTurn] < count[myTurn]) {
                return 99990
            } else {
                return -99990
            }
        }

        score += turn == myTurn ? puttable.length * 30 : 0 - puttable.length * 30;
        score += count[myTurn] - count[oppTurn];

        if (board[1][1] === myTurn) score += 640;
        if (board[1][8] === myTurn) score += 640;
        if (board[8][1] === myTurn) score += 640;
        if (board[8][8] === myTurn) score += 640;
        if (board[1][1] === oppTurn) score -= 1920;
        if (board[1][8] === oppTurn) score -= 1920;
        if (board[8][1] === oppTurn) score -= 1920;
        if (board[8][8] === oppTurn) score -= 1920;
        return score
    }

    return _
}({}));

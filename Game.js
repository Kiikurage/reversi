//-----------------------------------------------------------
//  Game Logic
//-----------------------------------------------------------
var Game = (function(_) {
    var eventList = {},
        turn, node, canvas;

    prop(_, "node", null, function() {
        return node
    });

    //初期化
    _.initialize = function() {
        node = new Node({
            turn: DISK.BLACK
        });
        canvas = document.getElementById("Gameboard");

        node.bind("turnchange", function(turn) {
            console.log("====================================");
            console.log((node.turn == DISK.BLACK ? "Black" : "White") + "'s' Turn")
            document.title = (node.turn == DISK.BLACK ? "Black" : "White") + "'s' Turn";
            _.fire("turnchange", turn);
        }, this);

        node.bind("Gameover", function(turn) {
            var countBlack = node.count[DISK.BLACK],
                countWhite = node.count[DISK.WHITE];
            console.log("====================================");
            console.log("Game Over");
            console.log("  Black              : " + countBlack);
            console.log("  White              : " + countWhite);
            console.log("  Empty              : " + node.count[DISK.EMPTY]);
            if (countBlack > countWhite) {
                console.log("    Black Win");
            } else if (countBlack < countWhite) {
                console.log("    White Win");
            } else {
                console.log("    Draw");
            }
            console.log("  Score              : " + AI.eval1(node));
        }, this);

        node.bind("update", _.update, this);

        canvas.addEventListener("click", function(ev) {
            if (turn !== AI.turn) _.click(ev);
        });
    };

    //ゲーム開始
    _.start = function(startTurn) {
        _.update();
        _.fire("turnchange", node.turn);
    }

    //ディスクを置く
    _.put = function(x, y) {
        node.putAndReverse(x, y);
    };

    //画面の更新
    _.update = function() {
        _.drawBoard();
        _.drawDisk();
        _.drawPuttable();
    };

    //盤面の更新
    _.drawBoard = function() {
        var ctx = canvas.getContext("2d");

        ctx.fillStyle = "#080"
        ctx.fillRect(0, 0, 400, 400);

        for (var i = 0; i <= 8; i++) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#000";

            ctx.beginPath();
            ctx.moveTo(i * 50, 0);
            ctx.lineTo(i * 50, 400);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, i * 50);
            ctx.lineTo(400, i * 50);
            ctx.stroke();
        }
    };

    //ディスクの更新
    _.drawDisk = function() {
        var ctx = canvas.getContext("2d"),
            board = node.board;

        ctx.lineWidth = 2;
        ctx.strokeStyle = "#000";
        for (var x = 1; x <= 8; x++) {
            for (var y = 1; y <= 8; y++) {
                if (board[x][y] !== DISK.EMPTY) {
                    if (board[x][y] == DISK.WHITE) ctx.fillStyle = "#FFFFFF";
                    if (board[x][y] == DISK.BLACK) ctx.fillStyle = "#000000";

                    ctx.beginPath();
                    ctx.arc(x * 50 - 25, y * 50 - 25, 20, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                }
            }
        }
    };

    //置ける場所の更新
    _.drawPuttable = function() {
        var puttable = node.puttable,
            ctx = canvas.getContext("2d"),
            x, y;

        // ctx.strokeStyle = "#F80";
        // ctx.fillStyle = "#F80";
        if (node.turn == DISK.WHITE) ctx.strokeStyle = "#FFFFFF";
        if (node.turn == DISK.BLACK) ctx.strokeStyle = "#000000";

        ctx.lineWidth = 2;

        for (var x = 1; x <= 8; x++) {
            for (var y = 1; y <= 8; y++) {
                if (puttable[x][y]) {
                    ctx.beginPath();
                    ctx.arc(x * 50 - 25, y * 50 - 25, 10, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }
        }
    };

    //クリックされた
    _.click = function(ev) {
        var x = parseInt(ev.offsetX / 50) + 1,
            y = parseInt(ev.offsetY / 50) + 1;
        if (node.turn === AI.turn) return;
        Game.put(x, y);
    };

    return _
}(new PubSub()));

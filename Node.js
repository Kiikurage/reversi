/*-----------------------------------------------------------
 *  ゲーム状態構造体
 *
 *  node = {
 *      board: [ 10 * 10 の配列],
 *      turn: 現在のターン
 *      puttable: [ 現在のプレイヤーが置ける位置の配列 ],
 *      count: [EMPTYの数, BLACKの数, WHITEの数]
 *   }
 *---------------------------------------------------------*/
var Node = (function(_super) {
    var $ = Node.prototype = new _super(),
        info = {
            constructor: 0,
            putAndReverse: 0,
            updatePuttable: 0,
            updateCount: 0,
            check: {
                total: 0,
                withCache: 0
            }
        };

    function Node(param) {
        _super.call(this);
        param = param || {};

        this.board = copy(param.board || $.board);

        this.turn = param.turn || DISK.EMPTY;
        if (param.puttable) {
            this.puttable = copy(param.puttable);
        } else {
            updatePuttable.call(this);
        }
        updateCount.call(this);
        info.constructor++;
    }

    Node.showInfo = function() {
        console.log("====================================");
        console.log("Node Infomation")
        console.log("  constructor        : " + info.constructor);
        console.log("  updatePuttable     : " + info.updatePuttable);
        console.log("  updateCount        : " + info.updateCount);
        console.log("  putAndReverse      : " + info.putAndReverse);
        console.log("  check              : " + info.check.total);
        console.log("    with cache       : " + info.check.withCache);
        info = {
            constructor: 0,
            putAndReverse: 0,
            updatePuttable: 0,
            updateCount: 0,
            check: {
                total: 0,
                withCache: 0
            }
        };
    }

    //ディスクを置いて、裏返す
    $.putAndReverse = function(x, y) {
        var board = this.board,
            count = this.count,
            turn = this.turn,
            oppTurn = 3 - turn,
            puttable = this.puttable,
            flag = check.call(this, x, y),
            px, py;

        if (!flag) {
            console.log("====================================");
            console.log("You Can't put at (" + x + ", " + y + ") ");
            return
        }

        this.board[x][y] = turn;

        count[DISK.EMPTY]--;
        count[turn]++;

        for (var i = 0, max = DIR.length; i < max; i++) {
            if (flag & 1 << i) {
                px = x + DIR[i].x;
                py = y + DIR[i].y;

                while (this.board[px][py] === oppTurn) {
                    this.board[px][py] = turn;
                    count[oppTurn]--;
                    count[turn]++;
                    px += DIR[i].x;
                    py += DIR[i].y;
                }
            }
        }

        turnChange.call(this);
        this.fire("update");

        info.putAndReverse++;

        return this;
    };

    //ノードを複製する
    $.copy = function() {
        return new Node({
            board: this.board,
            puttable: this.puttable,
            turn: this.turn
        })
    };

    //置ける場所に関する情報を更新する

    function updatePuttable() {
        var res = [],
            flag = 0;
        puttable = makeArray(10, 10, false);

        if (this.turn !== DISK.EMPTY) {
            for (var x = 1; x <= 8; x++) {
                for (var y = 1; y <= 8; y++) {
                    flag = check.call(this, x, y);
                    if (flag) {
                        puttable[x][y] = true;
                    }
                }
            }
        }

        info.updatePuttable++;

        this.puttable = puttable;
        return this;
    };

    //ディスクの枚数を更新する

    function updateCount() {
        var type = 0;
        this.count = [0, 0, 0];
        for (var x = 1; x <= 8; x++) {
            for (var y = 1; y <= 8; y++) {
                type = this.board[x][y];
                this.count[type]++;
            }
        }

        info.updateCount++;

        return this;
    }

    //ターンを変更する

    function turnChange() {
        var len = 0,
            puttable;
        this.turn = 3 - this.turn;

        updatePuttable.call(this);
        puttable = this.puttable;

        for (var x = 1; x <= 8; x++) {
            for (var y = 1; y <= 8; y++) {
                if (puttable[x][y]) {
                    turnChange.pass = false;
                    this.fire("turnchange", this.turn);
                    return
                }
            }
        }

        if (turnChange.pass) {
            turnChange.pass = false;
            this.turn = DISK.EMPTY
            this.fire("Gameover");
        } else {
            turnChange.pass = true;
            turnChange.call(this);
        }

        return this;
    };

    //指定位置がどっちの向きへ裏返せるのかを検索する
    //置ける方向はbitフラグで返される

    function check(x, y) {
        var res = 0,
            turn = this.turn,
            board = this.board,
            oppTurn = 3 - turn,
            px, py;

        if (this.board[x][y] === DISK.EMPTY) {
            for (var i = 0, max = DIR.length; i < max; i++) {
                px = x + DIR[i].x;
                py = y + DIR[i].y;
                if (board[px][py] == oppTurn) {
                    while (this.board[px][py] == oppTurn) {
                        px += DIR[i].x;
                        py += DIR[i].y;
                    }
                    if (board[px][py] == turn) res = res | 1 << i;
                }
            }
        }

        info.check.total++;
        return res
    };

    //プロトタイプの初期化
    $.board = [];
    for (var x = 0; x < 10; x++) {
        $.board[x] = [];
        for (var y = 0; y < 10; y++) {
            $.board[x][y] = DISK.EMPTY;
        }
    }
    $.board[4][4] = $.board[5][5] = DISK.WHITE;
    $.board[4][5] = $.board[5][4] = DISK.BLACK;

    return Node
}(PubSub));

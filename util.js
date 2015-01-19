var APPNAME = "Reversi",
    DIR = [{
        x: 0,
        y: -1
    }, {
        x: 1,
        y: -1
    }, {
        x: 1,
        y: 0
    }, {
        x: 1,
        y: 1
    }, {
        x: 0,
        y: 1
    }, {
        x: -1,
        y: 1
    }, {
        x: -1,
        y: 0
    }, {
        x: -1,
        y: -1
    }],
    DISK = {
        EMPTY: 0,
        BLACK: 1,
        WHITE: 2
    };

function copy(target) {
    return JSON.parse(JSON.stringify(target))
}

function map(a, b) {
    for (c in b) {
        if (b.hasOwnProperty(c)) a[c] = b[c];
    }
}

function prop(targ, name, setter, getter) {
    if (setter) targ.__defineSetter__(name, setter);
    targ.__defineGetter__(name, getter);
}

window.onload = function() {
    Game.initialize();
    AI.initialize();
    Game.start(DISK.BLACK);
}

function makeArray(x, y, value) {
    var res = [];
    for (var i = 0; i < x; i++) {
        res.push([]);
        for (var j = 0; j < y; j++) {
            res[i].push(value);
        }
    }
    return res
}

//-----------------------------------------------------------
//  PubSubシステム
//-----------------------------------------------------------
var PubSub = (function() {
    var $ = PubSub.prototype;

    function PubSub() {
        this.eventList = {};
    }

    //イベントのバインド
    $.bind = function(name, fn, context) {
        var eventList = this.eventList;

        if (!eventList[name]) eventList[name] = [];
        eventList[name].push({
            fn: fn,
            context: context
        });
    };

    //イベントの発火
    $.fire = function(name) {
        var eventList = this.eventList,
            args, list;
        if (!eventList[name]) return

        args = [];
        Array.prototype.push.apply(args, arguments);
        args.splice(0, 1);
        list = eventList[name];
        for (var i = 0, max = list.length; i < max; i++) {
            list[i].fn.apply(list[i].context || this, args);
        }
    };

    return PubSub;
}());

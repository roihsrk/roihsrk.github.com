var alertFallback = true;
if (typeof console === "undefined" || typeof console.log === "undefined") {
    if (typeof console === "undefined") console = {};
    if (alertFallback) {
        console.log = function(msg) {
            alert(msg);
        };
    } else {
        console.log = function() {};
    }
}
if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun /*, thisp*/) {
        var len = this.length >>> 0;
        if (typeof fun != "function")
            throw new TypeError();

        var res = [];
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this) {
                var val = this[i]; // in case fun mutates this
                if (fun.call(thisp, val, i, this))
                    res.push(val);
            }
        }
        return res;
    };
}
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(elt /*, from*/) {
        var len = this.length >>> 0;

        var from = Number(arguments[1]) || 0;
        from = (from < 0)
        ? Math.ceil(from)
        : Math.floor(from);
        if (from < 0)
            from += len;

        for (; from < len; from++) {
            if (from in this &&
                this[from] === elt)
                return from;
        }
        return -1;
    };
}

function Event(title, datetime, url) {
    var self = this;
    self.title = title;
    self.datetime = datetime;
    self.url = url;
    self.year = ko.computed(function() {
        return self.datetime.getYear();
    });
    self.months = [
        'tammi',
        'helmi',
        'maalis',
        'huhti',
        'touko',
        'kesä',
        'heinä',
        'elo',
        'syys',
        'loka',
        'marras',
        'joulu'
    ];
    self.monthname = ko.computed(function() {
        var month = self.datetime.getMonth();
        return self.months[month];
    })
    self.month = ko.computed(function() {
        return self.datetime.getMonth() + 1;
    });
    self.monthWithLeadingZero = ko.computed(function() {
        var value = self.month();
        return value < 10 ? '0' + value : value;
    });
    self.date = ko.computed(function() {
        return self.datetime.getDate();
    });
    self.dateWithLeadingZero = ko.computed(function() {
        var value = self.date();
        return value < 10 ? '0' + value : value;
    })
    self.weekdates = ['su', 'ma', 'ti', 'ke', 'to', 'pe', 'la'];
    self.weekdate = ko.computed(function() {
        return self.weekdates[self.datetime.getDay()];
    });
    self.hour = ko.computed(function() {
        var value = self.datetime.getHours();
        return value < 10 ? '0' + value : value;
    });
    self.minute = ko.computed(function() {
        var value = self.datetime.getMinutes();
        return value < 10 ? '0' + value : value;
    });
}

function AppViewModel() {
    var self = this;
    self.events = ko.observableArray();
}

var viewModel = new AppViewModel();
ko.applyBindings(viewModel);

var build_calendar = function(data) {
    var events_count = 0;
    var needs_n_events = 5;
    var filtered = null;
    var d = new Date(); d.setHours(0); d.setMinutes(0); d.setSeconds(0);
    var d1 = null;
    var datetime = null;
    var time = null;
    var except_date = null;
    var started = new Date();
    var protect = 0;
    while (events_count < needs_n_events && protect < 1000) {
        protect += 1;
        d1 = ( new Date(d) ).setDate(d.getDate() + 1);
        filtered = data.filter(function(x) {
            if (x.except) {
                for (var i = 0; i < x.except.length; i++) {
                    except_date = new Date(x.except);
                    if (d < except_date && except_date < d1) return false;
                }
            }
            if (x.date) x.date = new Date(x.date);
            return (x.date && d < x.date && x.date < d1)
                || (x.hasOwnProperty('repeat') && x.repeat === d.getDay());
        });
        for (var i = 0; i < filtered.length; i++) {
            datetime = new Date(d);
            time = filtered[i].time.split(".");
            datetime.setHours(0);
            datetime.setMinutes(0);
            datetime.setSeconds(0);
            datetime.setMilliseconds(0);
            if (time.length >= 2) {
                datetime.setHours(time[0]);
                datetime.setMinutes(time[1]);
            }
            viewModel.events.push(new Event(
                filtered[i].title,
                datetime,
                filtered[i].url
            ));
            events_count += 1;
        }
        d.setDate(d.getDate() + 1);
    }

    viewModel.events.sort(function(l, r) {
        return l.datetime == r.datetime ?
            0 :
            (l.datetime < r.datetime ?
             -1 :
             1
            );
    });

    console.log("Building events took " + ( new Date() - started ) +
                " milliseconds.");
};
build_calendar(calendar_items);

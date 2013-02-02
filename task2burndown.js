/*
  Task2Burndown
  http://github.com/p0wl/task2burndown

  Copyright (c) 2013 Paul Mölders
  Licensed under the MIT @license.
*/

(function (root, _, moment) {

  "use strict";

  var t2b = root.t2b = {
    VERSION: "0.0.1",
    config: {
      /* 
      * WEEKENDS
      * true: weekends will be included in the time line
      * false: only mon-fri
      */
      weekends: true,
      /* 
      * maxBorders
      * true: First day will have max effort and Last Day will have effort of zero
      * false: First day will ahve max effort - effort of this day and Last Day will have the effort of the last task
      */
      maxBorders: true
    }
  };

  /**
  * t2b.transform()
  * Do the magic
  */
  t2b.transform = function(data) {
    // 
    var results = {};
    var db = data;

    // Order DB by date
    db = _.sortBy(db, function (x) { return moment(x.date); });
    var total     = _.reduce(db,function (m, x) { return m+x.effort; },0);
    var remaining = _.reduce(db,function (m, x) { return m+x.remaining; },0);
    // Step 1: Create empty timeline array
    var tl =  []; //_init(db);

    // Step 2: Sum per Date
    tl = _sum(db, tl, total);

    // Step 3: Extend based on config
    tl = _init(tl, total);

    // Step 4: Handle borders if configured
    tl = _updateBorders(tl, total);

    return tl;
  };

  /**
  * _init()
  * Private Init of the timeline to create array with each key
  */
  var _init = function (data) {
    var t = data;
    var keys =  _.chain(data).keys().sortBy(function (x) { return moment(x); }).value();
    var min = moment(_.first(keys));
    var max = moment(_.last(keys));

    if (min >= max) { return t; }
    var curr = min;
    var last = 0;
    while (curr < max)
    {
      // Do not add weekends if not enabled
      if (!t2b.config.weekends || (curr.day() !== 0 && curr.day() !== 6))
      {
        var k = curr.format('YYYY-MM-DD');
        if (_.has(t,k)) {
          last = t[k];
        }
        t[k] = last;
      }
      curr = curr.add('d',1);
    }
    return t;
  };

  /**
  * _sum()
  * Sum Up per Date
  */
  var _sum = function (d, tl, total) {
    var lastval = total;
    var lastdate = null;

    _.each(d, function (x) {
      lastval = lastval-x.effort;
      if (lastdate != x.date)
      {
        tl[x.date] = lastval;
        lastdate = x.date;
      }
    });
    return tl;
  };


  var _updateBorders = function (data, total) {
    if (t2b.config.maxBorders)
    {
      // Bugfix, sort keys again to avoid that  
      var keys =  _.chain(data).keys().sortBy(function (x) { return moment(x); }).value();
      var max =   _.last(keys);
      var min =   _.first(keys);
      data[max] = 0;
      data[min] = total;
    }
    return data;

  };

  // Return Module
  //module.exports = t2b;
  return t2b;

}(window, _, moment));
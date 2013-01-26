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
      * true: weekends will be included in the time line
      * false: only mon-fri
      */
      weekends: false
    }
  };


  /**
  * t2b.db
  * local db cache
  */
  t2b.db = {};

  /**
  * t2b.setData
  * Save data to local cache
  *
  * data format (only required fields):
  *
  var data = [{
    date: 'YYYY-MM-DD',
    effort:  number,
    remaining: number
  }];
  */
  t2b.setData = function(data) {
    t2b.db = data;
    return this;
  };

  /**
  * t2b.getData
  * Get data from local cache
  */
  t2b.getData = function() {
    return t2b.db;
  };

  /**
  * t2b.transform()
  * Do the magic
  */
  t2b.transform = function() {
    // 
    var results = {};

    // Order DB by date
    t2b.db = _.sortBy(t2b.db, function (x) { return moment(x.date); });
    var total     = _.reduce(t2b.db,function (m, x) { return m+x.effort},0);
    var remaining = _.reduce(t2b.db,function (m, x) { return m+x.remaining},0);
    
    // Step 1: Create timeline array
    var tl = []; //_init(t2b.db);

    // Step 2: Sum per Date
    return _sum(t2b.db, tl, total);
  };

  /**
  * _init()
  * Private Init of the timeline to create array with each key
  */
  var _init = function (data) {
    var t = [];
    var min = moment(_.first(data).date);
    var max = moment(_.last(data).date);

    if (min >= max) { return t; };
    var curr = min;
    while (curr <= max)
    {
      // Do not add weekends if not enabled
      if (!t2b.config.weekends || (curr.day() !== 0 && curr.day() !== 6))
      {
        var k = curr.format('YYYY-MM-DD');
        if (!t[k]) {
          t[k] = 0;
        }
      }
      curr = curr.add('d',1);
    }
    return t;
  }

  /**
  * _sum()
  * Sum Up per Date
  */
  var _sum = function (d, tl, total) {
    var lastval = total;
    var lastdate = null;

    _.each(d, function (x) {
      if (lastdate != x.date)
      {
        tl[x.date] = Number(lastval);
        lastdate = x.date;
      }
      lastval = lastval-x.effort;
    })

    return tl;
  }

  // Return Module
  //module.exports = t2b;
  return t2b;

}(window, _, moment));
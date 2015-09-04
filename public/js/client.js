(function() {
  "use strict";
  (function($) {
    return $(function() {
      var dr, r;
      r = $('.top-content');
      dr = new DrawTop(r);
      return dr.startTimer(30 * 1000);
    });
  })(jQuery);

}).call(this);

(function() {
  "use strict";
  var DrawTop;

  DrawTop = (function() {
    DrawTop.topUrl = '/top';

    DrawTop.timer;

    function DrawTop(root) {
      this.root = root;
      this.pendingUpdate = false;
    }

    DrawTop.prototype.updateRootTop = function() {
      if (!this.pendingUpdate && (this.root != null)) {
        this.pendingUpdate = true;
        return $.ajax({
          url: DrawTop.topUrl,
          success: (function(_this) {
            return function(data) {
              _this.root.html(data);
              _this.pendingUpdate = false;
              _this.startTimer();
            };
          })(this),
          error: function(xhr, opts, e) {
            console.log(e);
          }
        });
      } else {
        console.log("pendingUpdate is true");
        this.stopTimer();
        return this.startTimer();
      }
    };

    DrawTop.prototype.startTimer = function(time) {
      if (time != null) {
        this.time = time;
      }
      return this.timer = setTimeout(this.updateRootTop(), this.time != null ? this.time : 10 * 1000);
    };

    DrawTop.prototype.stopTimer = function() {
      if (this.timer != null) {
        return clearTimeout(this.timer);
      }
    };

    window.DrawTop = DrawTop;

    return DrawTop;

  })();

}).call(this);

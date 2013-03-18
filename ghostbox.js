;(function($){
    var defaults = {
        onCollision: $.noop,
        collisionsDetected: function (ghostElement){
            return [];
        },
        onThreshold:$.noop,
        onCreateGhost:$.noop
    },
    WIDTH_TO_LOCK = 50,
    HEIGHT_TO_LOCK = 50;

    var Ghostbox = function (element, options) {
        this.ghostContainer = element;
        this.options = $.extend({}, defaults, options);
        this.ghost = $('<div class="ghost" />');
        this.left = 0;
        this.top = 0;
        this.init();
    };

    Ghostbox.prototype.init = function (){
        var $container = $(this.ghostContainer),
            container = $container[0],
            self = this;

        container
            .bind('mousedown', function (e){
                self.createGhost(e);
            })
            .bind('mouseup', function (e) {
                self.removeGhost();
            });

        container.addEventListener('touchstart', this.onTouchStart);
        container.addEventListener('touchend', this.removeGhost);
    };

    Ghostbox.prototype.onTouchStart = function (e) {
        e.preventDefault();
        this.createGhost(e);
    };

    Ghostbox.prototype.createGhost = function (e){
        var cursor = e,
            self = this;

        if ($(e.srcElement).is(this.ghostContainer)){
            if (e.type.substring(0, 5) === 'touch'){
                cursor = e.targetTouches[0];
            }
            this.options.onCreateGhost();
            this.removeGhost();

            var ghost = this.ghost.appendTo('body');
            this.left = cursor.pageX;
            this.top = cursor.pageY;

            ghost.css({
                'left': this.left,
                'top': this.top,
                'width': '1px',
                'height': '1px'
            });

            $(this.ghostContainer)
                .bind('mousemove', function (e){
                    self.resizeGhost(e);
                })
                .bind('mouseup', function (e){
                    self.removeGhost();
                })
                .bind('mouseout', function (e){
                    self.onMouseOut(e);
                });

            this.touchMoveHandler = this.addEventListener('touchmove', function (e){
                self.touchResize(e);
            });
            this.addEventListener('touchend', function (e){
            self.removeGhost();
        });
        }
        return false;
    };

    Ghostbox.prototype.onMouseOut = function (e) {
        if (!$(e.relatedTarget).is('.desk-item') && !$(e.relatedTarget).is('#container')){
            this.removeGhost();
        }
    };

    Ghostbox.prototype.touchResize = function (e) {
        e.preventDefault();
        this.resizeGhost(e);
    };

    Ghostbox.prototype.resizeGhost = function (e) {
        var cursor = e.type.substring(0, 5) === 'touch' ? e.targetTouches[0] : e,
            width = cursor.pageX - this.left,
            height = cursor.pageY - this.top,
            newLeft = this.left,
            newTop = this.top;

        if (width < 0){
            newLeft = cursor.pageX;
        }

        if (height < 0){
            newTop = cursor.pageY;
        }

        this.ghost.css({
            'left': newLeft,
            'top': newTop,
            'width': Math.abs(width),
            'height': Math.abs(height)
        });
        return false;
    };

    Ghostbox.prototype.removeGhost = function() {
        var collisions = this.options.collisionsDetected(this.ghost);

        if (collisions.length > 0){
            this.options.onCollision(collisions);
        }
        else if (this.ghost.width() > WIDTH_TO_LOCK && this.ghost.height() > HEIGHT_TO_LOCK) {
            var ghostOffset = this.ghost.offset();
            this.options.onThreshold({
                left: ghostOffset.left,
                top: ghostOffset.top,
                width: this.ghost.width(),
                height: this.ghost.height()
            });
        }
        $(this.ghostContainer).unbind('mousemove mouseout mouseup');
        this.removeEventListener("touchmove", this.touchMoveHandler);
        this.ghost.remove();
    };

    $.fn.ghostbox = function(options) {
        return this.each(function () {
            new Ghostbox(this, options);
        });
    }
})(jQuery);
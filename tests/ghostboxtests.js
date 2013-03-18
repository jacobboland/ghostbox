(function(){
    module('selectall', {
        setup: function (){
            $('#ghostContainer').add('.ghost').remove();
            $('<div id="ghostContainer" />').appendTo('body');
        }
    });

    test('should create / destroy ghostbox', function (){
        ok(!$('.ghost').is(':visible'));

        var ghostContainer = $('#ghostContainer');
        ghostContainer.ghostbox();
        ghostContainer.trigger('mousedown');
        ok($('.ghost').is(':visible'));
        ghostContainer.trigger('mouseup');
        ok(!$('.ghost').is(':visible'));
    });

    test('should destroy ghostbox on mouseout', function (){
        ok(!$('.ghost').is(':visible'));

        var ghostContainer = $('#ghostContainer');
        ghostContainer.ghostbox();
        ghostContainer.trigger('mousedown');
        ok($('.ghost').is(':visible'));
        ghostContainer.trigger('mouseout');
        ok(!$('.ghost').is(':visible'));
    });

    test('should resize ghostbox on mousemove', function (){
        ok(!$('.ghost').is(':visible'));

        var ghostContainer = $('#ghostContainer');
        ghostContainer.ghostbox();
        ghostContainer.trigger('mousedown');
        ok($('.ghost').is(':visible'));
        ghostContainer.trigger('mouseout');
        ok(!$('.ghost').is(':visible'));
    });
}());
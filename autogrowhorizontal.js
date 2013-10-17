/*
 * Adapted from: https://gist.github.com/thomseddon/4703968
 *
 * Usage: <textarea auto-grow-diagonal></textarea>
 */

app.directive('autoGrowDiagonal', function() {
    return {
        restrict: 'A',
        link: function(scope , element , attributes) {

            var content = scope.$eval(attributes.autoGrowHorizontal);

            var threshold    = 0,
                minHeight    = element[0].offsetHeight,
                minWidth     = element[0].offsetWidth,
                paddingLeft  = element.css('paddingLeft'),
                paddingRight = element.css('paddingRight');

            var $shadow = angular.element('<div></div>').css({
                position:   'absolute',
                top:        -10000,
                left:       -10000,
                fontSize:   element.css('fontSize'),
                fontFamily: element.css('fontFamily'),
                lineHeight: element.css('lineHeight'),
                resize:     'none'
            });

            angular.element(document.body).append($shadow);

            var update = function() {
                var times = function(string, number) {
                    for (var i = 0, r = ''; i < number; i++) {
                        r += string;
                    }
                    return r;
                }

                var val = element.val().replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/&/g, '&amp;')
                    .replace(/\n$/, '<br/>&nbsp;')
                    .replace(/\n/g, '<br/>')
                    .replace(/\s{2,}/g, function( space ) {
                        return times('&nbsp;', space.length - 1) + ' ';
                    });

                $shadow.html( val );

                var maxH = Math.max($shadow[0].offsetHeight + threshold , minHeight);
                var maxW = Math.max($shadow[0].offsetWidth + threshold, minWidth);

                element.css('height', maxH).css('width', maxW);
            }

            scope.$on('$destroy', function() {
                $shadow.remove();
            });

            scope.$watch('content', function() {
                update();
            });

            element.bind( 'keyup keydown keypress change' , update );
            update();
        }
    }
});

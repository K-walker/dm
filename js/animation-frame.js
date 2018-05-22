/**
 * Created by 004928 on 2017/7/17.
 */
(function(window){

    window.MyRequestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame ;

    window.MyCancelRequestAnimationFrame = window.cancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFrame ;

})(window)
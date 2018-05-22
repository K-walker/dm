/**
 * 弹幕
 */
$(function () {

    function BarrageManager (options) {

        this.opts = {
            url       : './res/danmu.json',
            loadDelay : 5000 ,  // 轮询时间间隔
        }
        
        $.extend( this.opts , options);
        this.bc = new BarrageCollection();
    }
    
    BarrageManager.prototype.load = function () {
        var self = this ;
		$.getJSON(self.opts.url , function (data) {
			if(data.data.length > 0) {
				for(var i = 0 ; i < data.data.length ; i++) {
					var item = data.data[i] ;
					self.bc.add(new Barrage({
						id:item.id,
						name:item.fromUserName,
						text:item.content,
						icon:item.fromUserIcon ? item.fromUserIcon : './images/head-icon.png'
					}));
				}
				self.loop();
            }
		});
    }
    
    BarrageManager.prototype.loop = function () {
        var len = this.bc.mq.length , self = this  ;
        while (len--) {
            this.bc.mq[len].start(this.bc , len);
        }   

        setTimeout(function () {
            self.load();
        } , this.opts.loadDelay);

    }

    function BarrageCollection () {
        this.mq = [] ;
    }
	
    BarrageCollection.prototype.add = function (barrage) {
        this.mq.push(barrage);
    }
	
    BarrageCollection.prototype.remove = function (barrage) {
        var index = this.mq.findIndex(function (item) {
            return barrage.opts.id == item.opts.id ;
        });
        if(index != -1) {
            this.mq.splice(index , 1);
        }
        barrage.opts.$el.remove();
    }

    function Barrage (options) {
        this.opts = {
            $el         : null ,
            left        : 0 ,
            bgColor     : [Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255)] ,
            offset      : 50 ,      // 使弹幕完全移出屏幕外
            duration    : 10000 ,   // 弹幕从右往左移动的时间 
            delayTime   : 1000 ,    // 弹幕延迟移动时间
        };
        $.extend( this.opts , options);
        this.init();
    }
	
    Barrage.prototype.init = function () {
        
        this.opts.$el = $("<span><img src="+this.opts.icon+"><em>"+this.opts.name+":</em>"+this.opts.text+"</span>");
		
        var top = Math.ceil(Math.random() * 10 );
        this.opts.$el.css({
            top:top * 40 +'px',
            backgroundColor:"rgb("+this.opts.bgColor.join(",")+")"
        });
        
        var delay = Math.ceil(Math.random()*10);
        this.opts.delayTime *= Math.abs(delay - 5);

        var dur = Math.ceil(Math.random() * 10);
        this.opts.duration += dur * 1000 ; 

        $('#barrage-wrapper').append(this.opts.$el);
        this.opts.left = -this.opts.$el.width() - this.opts.offset ;
    }
    
    Barrage.prototype.start = function (bc , index) {
        var self = this ;
        bc.mq.splice(index , 1);
        setTimeout(function () {
            self.move(bc);
        }, this.opts.delayTime);
    }
    
    Barrage.prototype.move = function (bc) {
        var self = this ;
        this.opts.$el.animate({
            left:this.opts.left+'px'
        } , this.opts.duration ,"linear" ,  function () {
            bc.remove(self);  
        });
    }
    
    new BarrageManager().load();
});
 
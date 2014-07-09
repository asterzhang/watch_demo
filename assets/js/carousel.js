  function Carousel(element,className,className_son)
    {
        var self = this;
        element = $(element);

        var container = $(className,element);
        var panes = $(className_son,element);

        var pane_width = 0;
        var pane_height=0;
        var pane_count = panes.length;
        var current_pane = 0;
        var _xPercent=0;
        var _yPercent=0;
        var canSwipeUpOrDown = true;
        var canSwipeLeftOrRight = true;
        
        //默认一进来可以上下滑动，不可以左右，只有进入了当个app后才可以左右滑动

        

        this.active = false;

        /**
         * initial
         */
        this.init = function() {
            setPaneDimensions();
            //set_animation();
            $(window).on("load resize orientationchange", function() {
                setPaneDimensions();
            })
        };

        /**
         * show pane by index
         */
        this.showPane = function(index, animate) {
            // between the bounds
            index = Math.max(0, Math.min(index, pane_count-1));
            current_pane = index;

            var offset = -((100/pane_count)*current_pane);
             
            setContainerOffset(0,offset, animate);

        };
        
        this.next = function() {
            return this.showPane(current_pane+1, true);
        };
        this.prev = function() { 
            return this.showPane(current_pane-1, true);
        };



        /**
         * set the pane dimensions and scale the container
         */
        function setPaneDimensions() {
            pane_width = element.width();
            pane_height = element.height();
            panes.each(function() {
                $(this).width(pane_height);
            });
            container.height(pane_height*pane_count);
        };

        this.removeCurrentPane = function (argument) {
            canSwipeUpOrDown = true;
            removePane(current_pane,true);
            //alert(current_pane);
        };
         /**
         * //delete one card
         */
        function removePane(index,force) {
            if(panes.eq(current_pane).children("dt").hasClass("db") || force){
                panes.eq(current_pane).children("dt").children(".msg_box").addClass("slideOutRight move");
                //setTimeout(function(){
                     panes.eq(current_pane).fadeOut("slow").remove();
                     panes.splice(current_pane, 1);
                     $(".JS_navList li").eq(current_pane).remove();
                //},250 );
                pane_count--;   
                setPaneDimensions();            
                index = Math.max(0, Math.min(index, pane_count-1));
                current_pane = index;
                self.showPane(current_pane, true);
            }
            else{
                returnToCard();
                canSwipeUpOrDown = true;
            }
            if($(".JS_card").length==0){
               // console.log("no JS_card");
                $(".JS_animate_box_vertical_sub").html("<h1>First home page</h1>");
                self.active = false;
                var carousel_wrp = new Carousel_Wrapper("#carousel",".JS_animate_box_vertical",".JS_pane");
                carousel_wrp.init();
                $(".nav2").removeClass("none").addClass("db");

            }
             
        };
        this.returnToCard = returnToCard;
        
        function showDetail(){
            panes.eq(current_pane).children("dt").removeClass("db").fadeOut("fast", function() {
            panes.eq(current_pane).children("dd").fadeIn("fast").addClass("animate_fadeInRight");
            });
        }
        function returnToCard(){
            panes.eq(current_pane).children("dt").addClass("db animate_fadeInLeft").fadeIn("fast", function() {
            panes.eq(current_pane).children("dd").fadeOut("fast");            
            panes.eq(current_pane).children("dd").children("ul").children("li").fadeOut("fast")
            panes.eq(current_pane).children("dd").children("ul").children(".cardOpr_page").fadeIn("fast")
            });
            canSwipeUpOrDown = true;
        }

        function setContainerOffset(xPercent,yPercent,animate) {
            
            container.removeClass("animate");

            if(!canSwipeUpOrDown){
                yPercent = _yPercent;
            }

            if(!canSwipeLeftOrRight){
                xPercent = _xPercent;
            }

            if(animate) {
                container.addClass("animate");
                $(".msg_mount").addClass("animate_fadeInUp");
                showNav(current_pane);
            }

            if(Modernizr.csstransforms3d) {
                container.css("transform", "translate3d("+xPercent+"%,"+ yPercent +"%,0) scale3d(1,1,1)");
                
            }
            else if(Modernizr.csstransforms) {
                container.css("transform", "translate("+xPercent+"%,"+ yPercent +"%)");              
            }
            else {
                var ypx = ((pane_height*pane_count) / 100) * yPercent,
                    xpx = ((pane_width) / 100) * xPercent;

                container.css("top", ypx+"px");
                container.css("left", xpx+"px");
            }
            _xPercent=xPercent;
            _yPercent=yPercent;
        }
        
        
         function set_animation(){
            var animatedDiv = document.querySelectorAll("div.animated");
                for (var i = 0, len = animatedDiv.length; i < len; ++i){ animatedDiv[i].setAttribute("animateclass", animatedDiv[i].className); }
        }
        
        function showNav(current_pane){
            for(var i=0;i<pane_count;i++){
                if(i==current_pane){
                    $(".JS_navList li").eq(i).addClass("current");
                }
                else
                    $(".JS_navList li").eq(i).removeClass("current");
            }
        }
        
  
        //this.delete=function(){

       // }

        function handleHammer(ev) {
            if(!self.active) return;
            // disable browser scrolling
            ev.gesture.preventDefault();

            switch(ev.type) {
                case 'dragdown':
                case 'dragup':
                    // stick to the finger
                    var pane_offset = -(100/pane_count)*current_pane;
                    var drag_offset = 100*ev.gesture.deltaY/ (pane_count*pane_height);

                    // slow down at the first and last pane
                    if((current_pane == 0 && ev.gesture.direction == "down") ||
                        (current_pane == pane_count-1 && ev.gesture.direction == "up")) {
                        drag_offset *= .4;
                    }
                    setContainerOffset(_xPercent,drag_offset + pane_offset);
                    break;
                case 'dragleft':
                case 'dragright':
                    // stick to the finger
                    var drag_offset = ev.gesture.deltaX/pane_width *100*0.6;
                    setContainerOffset(drag_offset,_yPercent);

                    //document.title = drag_offset+'_'+new Date().getTime();
                    break;
                case 'swipeup':
                  //console.log("swipeup")
                    self.next();
                    ev.gesture.stopDetect();
                    break;

                case 'swipedown':
                   // console.log("swipedown")
                    self.prev();
                    ev.gesture.stopDetect();
                    break;

                case 'swipeleft':
                    console.log("swipe left");
                    showDetail();
                    canSwipeUpOrDown = false;
                    //ev.gesture.stopDetect();
                    break;

                case 'swiperight':

                    removePane(current_pane);
                    //ev.gesture.stopDetect();
                    break;


                case 'release':
                    // more then 50% moved, navigate
                    if((Math.abs(ev.gesture.deltaY) > pane_height/2) || ev.gesture.velocityY >1.5 ){
                        if(ev.gesture.direction == 'down') {
                            self.prev();
                        } else {
                            self.next();
                        }
                    }
                    else {
                        self.showPane(current_pane, true);
                        document.title = "release"+ ~new Date()
                    }
                    break;
            }
        }
        new Hammer(element[0], { dragLockToAxis: true }).on("release dragup dragdown drag dragstart dragend dragleft dragright swipeup swipedown swiperight swipeleft", handleHammer);
    }

    
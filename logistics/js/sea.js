// $(function () {
//             var nav = $("#nav");
//             var mainPage = $(".mainPage");
//             var mainTopArr = new Array();
//             for(var i=0;i<mainPage.length;i++){
//                 var top = mainPage.eq(i).offset().top;
//                 mainTopArr.push(top);
//             }
//             $(window).scroll(function(){
//                 var scrollTop = $(this).scrollTop();
//                 var k;
//                 for(var i=0;i<mainTopArr.length;i++){
//                     if(scrollTop>=mainTopArr[i]){
//                         k=i;
//                     }
//                 }
//                 nav.find("#nav > li >a").eq(k).addClass("active").siblings().removeClass("active");
//             });
//             nav.find("a[href^='#']").click(function(e){
//                 e.preventDefault();
//                 $('html, body').animate({scrollTop: $(this.hash).offset().top}, 400);
//             });
//         });
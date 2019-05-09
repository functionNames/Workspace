

$(function(){
    $(".ce > li > a").click(function(){     //点击空运时
	     $(this).addClass("xz").parents().siblings().find("a").removeClass("xz");
		 $(this).parents().siblings().find(".er").hide(300);  //找到下边的ul  .er
		 $(this).siblings(".er").toggle(300);  //遍历ul .er
		 $(this).parents().siblings().find(".er > li > .thr").hide().parents().siblings().find(".thr_nr").hide();
	})
	$(".er > li > a").click(function(){     //点击国内空运时
        $(this).addClass("sen_x").parents().siblings().find("a").removeClass("sen_x");  //添加
        $(this).parents().siblings().find(".thr").hide(300); 	//找到下边的ul .thr
	    $(this).siblings(".thr").toggle(300);	//遍历ul  .thr
	})



	
	

})


 





























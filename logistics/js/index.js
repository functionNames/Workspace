			var radio_Boolean = false;
			var sname_Boolean = false;
			var phone_Boolean = false;
			var email_Boolean = false;
			var logistics_Boolean = false;
			var questiondescription_Boolean = false;
			// radio
			
			$('.reg_user').focus(function(){
			  if ($(":radio:checked").length == 0){
			  	$('.radio_hint').html("×").css("color","red");
				radio_Boolean = false;
			  }else{
			  	$('.radio_hint').html("✔").css("color","green");
				radio_Boolean = true;
			  }
			});	
			
			// sname
			$('.reg_user').blur(function(){
			  if ((/^[\u4e00-\u9fa5]{2,6}$/).test($(".reg_user").val())){
				$('.user_hint').html("✔").css("color","green");
				sname_Boolean = true;
			  }else {
				$('.user_hint').html("×").css("color","red");
				sname_Boolean = false;
			  }
			});
			
			// Mobile
			$('.reg_mobile').blur(function(){
			  if ((/^1[34578]\d{9}$/).test($(".reg_mobile").val())){
				$('.phone_hint').html("✔").css("color","green");
				phone_Boolean = true;
			  }else {
				$('.phone_hint').html("×").css("color","red");
				phone_Boolean = false;
			  }
			});
			
			// Email
			$('.reg_email').blur(function(){
			  if ((/^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/).test($(".reg_email").val())){
				$('.email_hint').html("✔").css("color","green");
				emaile_Boolean = true;
			  }else {
				$('.email_hint').html("×").css("color","red");
				emaile_Boolean = false;
			  }
			});
			
			// logistics
			$('.reg_logistics').blur(function(){
			  if ((/^\d{5,20}$/).test($(".reg_logistics").val())){
				$('.logistics_hint').html("✔").css("color","green");
				logistics_Boolean = true;
			  }else {
				$('.logistics_hint').html("×").css("color","red");
				logistics_Boolean = false;
			  }
			});
			
			// questiondescription
			
			$('.reg_questiondescription').blur(function(){
			  if ((/^[a-zA-Z0-9]{6,300}$/).test($(".reg_questiondescription").val())){
				$('.questiondescription_hint').html("✔").css("color","green");
				questiondescription_Boolean = true;
			  }else {
				$('.questiondescription_hint').html("×").css("color","red");
				questiondescription_Boolean = false;
			  }
			});
			
			// click
			$('#btn').click(function(e){
				e.preventDefault();
			  if(radio_Boolean && sname_Boolean && phone_Boolean && emaile_Boolean && logistics_Boolean && 
			  questiondescription_Boolean == true){
				var obj = document.getElementsByName("questiontype");
				var aaa;
				var item;
				for (var i = 0; i < obj.length; i++) { //遍历Radio 
					if (obj[i].checked) {
						item = obj[i].value;
						console.log(item);
					}
				}
				
			    var that = this;
			    // var state = $("#state").val();
			    var questionType = $("#reg_radio").val();
			    var sname = $(".reg_user").val();
			    var phone = $(".reg_mobile").val();
			    var email = $(".reg_email").val();
			    var logisticsNumber = $(".reg_logistics").val();
			    var questionDescription = $(".reg_questiondescription").val();
			    var memo ="";
			    var url = '';
			    
				var data = {
					questionType: item,
				    sname: sname,
				    phone: phone,
				    email: email,
				    logisticsNumber: logisticsNumber,
				    questionDescription:questionDescription,
					memo: memo
				}
				$.ajax({
					beforeSend:function(request){
						request.setRequestHeader("x-user-id", -5);
					},
					type:"post",
					url:'http://129.211.15.29:8001/admin/logistics/add',
					dataType: "json",
					contentType: "application/json;charset=UTF-8",
					data:JSON.stringify(data),
					// 异步
					async:true,
					success:function(res){
						console.log(1)
					},
					error:function(err){
						console.log(err)
					}
					})
				$('.subsuccess').html("✔提交成功").css("color","green");
				// alert('提交')
			  }else {
				$('.subsuccess').html("×请完善信息").css("color","red");
			  }
			});
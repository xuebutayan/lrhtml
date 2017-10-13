
define(function(require, exports, module) {

	var GV = {ACTION_NAME:"show",ROOT:""};
        GV.COMMENT = {
           ALLOW: "1",
           MID:"10",
           AID:"1",
           URL_ADD: "/Comment/insert.html",
           URL_GET:"/Comment/ajaxGet/mid/10/aid/1/size/15.html",
           URL_REPLY_LOAD: "",
        };

	module.exports = {

		init: function(){
			COMMENT = {
				TOTAL: 0
			};
			if(typeof(GV.COMMENT) !== 'undefined' && typeof(GV.COMMENT.ALLOW) !== 'undefined' && parseInt(GV.COMMENT.ALLOW) === 1){
				firstLoad = true; //设置参数为第一次加载
				this.getComments();

				this.listenFormSubmit();
				this.initCommentForm();
			}
		},

		//初始化评论框
		initCommentForm: function(){
			/*
	        var serverPath = 'http://ueditor.baidu.com/server/umeditor/',
	        um = UM.getEditor('editor-comment', {
	            imageUrl:serverPath + "imageUp.php",
	            imagePath:serverPath,
	            lang:/^zh/.test(navigator.language || navigator.browserLanguage || navigator.userLanguage) ? 'zh-cn' : 'en',
	            langPath:UMEDITOR_CONFIG.UMEDITOR_HOME_URL + "lang/",
	            focus: true,
	            initialFrameHeight: 160,
	            toolbar:[
	                'fontsize bold forecolor',
	                '| justifyleft justifycenter justifyright justifyjustify',
	                '| link unlink insertorderedlist | emotion image removeformat'
	            ]
	        });
	        */
		},

		//监听评论框的提交事件
		listenFormSubmit: function(){
			$('.comment-submit').unbind('click');
			$('.comment-submit').on('click', function(){
				submitBtn = $(this);
				parentId = parseInt(submitBtn.data('parent'));
				topId = parseInt(submitBtn.data('topid'));
				if(parentId === 0){
					//commentContent = UM.getEditor('editor-comment').getContent();
					commentContent = $('#comment-text').val();
				}else{
					commentContent = $("#reply-text-" + parentId).val();
				}

				$.ajax({
					type: 'POST',
					url: GV.COMMENT.URL_ADD,
					data: {
						'mid': GV.COMMENT.MID,
						'aid': GV.COMMENT.AID,
						'pid': parentId,
						'topid':topId,
						'content': commentContent,
					},
					success: function(data, statusText, xhr, $form){
	                    if (data.status > 0) {
	                    	alert(data.info);
	                        //重新加载数据
	                        module.exports.getComments();

	                        //清除评论框中的内容
							if(parentId === 0){
								$("#comment-text").val('');
								//UM.getEditor('editor-comment').setContent('');
							}else{
								$("#reply-text-" + parentId).val('');
								//$("#reply-form-" + parentId).slideUp();
								$("#reply-form-" + parentId).hide();
							}
	                    }else alert(data.info);
					},
					dataType: 'json'
				});
			});
		},

		//向服务器请求评论内容
		getComments: function(){
			$.ajax({
				type: 'GET',
				url: GV.COMMENT.URL_GET,
				success: function(data, statusText, xhr, $form){
                    if (data.status > 0) {
                    	//如果获得的数据是某个评论的所有回复
                    	if(0 && typeof(data.data.config) === 'undefined'){
                    		firstLoad = true; //正序输出
                    		module.exports.buildComment(data.data.response, GV.COMMENT.REPLY_LOAD_DOM);
                    		firstLoad = false; //置为false
                    	}else{
	                    	//更新评论总数
	                    	COMMENT.TOTAL = parseInt(data.data.cursor.total);
	                    	COMMENT.PAGE = parseInt(data.data.cursor.page);
	                    	COMMENT.SIZE = parseInt(data.data.cursor.size);
	                    	$(".comment-total").text(COMMENT.TOTAL);

	                    	if(COMMENT.TOTAL === 0){
	                    		$(".list-comment-container").append('<div class="text-center">暂无评论~</div>');
	                    	}else{
	                    		module.exports.buildComment(data.data.response, ".list-comment-container");
	                    		if(data.data.cursor.html != null){
	                    			if($(".list-comment-pagination").length > 0){
	                    				$(".list-comment-pagination").remove();
	                    			}
	                    			$(".list-comment-container").append('<div class="list-comment-pagination text-center">'+data.data.cursor.html+'</div>');
	                    		}
	                    		firstLoad = false;
	                    	}
                    	}

						//build完之后监听回复评论按钮点击事件
						module.exports.listenReplyAction();
						module.exports.listenPagination(); //监听评论翻页事件
						//module.exports.listenReplyLoad(); //监听更多评论加载事件
                    }else alert(data.info);
				},
				dataType: 'json'
			});
		},

		//在指定容器中循环输出指定的评论内容
		buildComment: function(data, container){
			var commentTemplate = '<div class="list-group-item" id="comment-{$commentId}"><div class="row-picture"><img class="circle" src="{$avatar}" alt="icon"></div><div class="row-content"><div class="least-content">{$floor}</div><h4 class="list-group-item-heading">{$author}<span class="list-comment-date">{$date}</span></h4><div class="list-group-item-text rating-show-comment" data-parent="{$parentId}" data-static="true"></div><div class="list-group-item-text">{$content}</div><p class="list-comment-action"><span class="reply-action on-right" data-top-id="{$topId}" data-parent-id="{$commentId}" data-parent-author="{$author}"><i class="icon icon-comment on-right"></i>{$childNum}</span></p></div></div><div class="list-group-separator"></div>';
			var replyContainerTemplate = '<div class="list-group list-comment list-comment-reply" id="reply-{$commentId}">';
			var loadReplyTemplate = '<div class="list-group" id="reply-load-{$parentId}"><div class="text-center"><a class="reply-load-action" href="'+GV.COMMENT.URL_VIEW+'{$commentId}" target="_blank" data-parent="{$parentId}">查看所有回复<i class="iconfont icon-chevron-right on-left"></i></div></div><div class="list-group-separator"></div>';
			var containerDom = $(container);
			//第一次输出评论前要清空容器
			if(firstLoad){
				containerDom.html('');
			}
			//遍历输出评论内容
			var diffFloor = 0;
			var outPut = false;
			$(data).each(function(key, value){
				//如果id为load，代表输出load信息
				if(value.id == 'load'){
					if($("#reply-load-"+value.parent).length == 0){
						tempHtml = loadReplyTemplate.replace(/\{\$parentId\}/g, value.pid);
						tempHtml = tempHtml.replace(/\{\$commentId\}/g, value.comment_id);
						outPut = true;
					}else{
						outPut = false;
					}
				//如果是普通评论信息
				}else{
					//如果此前没有输出过此评论则输出
					if($("#comment-"+value.id).length == 0){
						tempHtml = commentTemplate.replace(/\{\$author\}/g, value.uname);
						tempHtml = tempHtml.replace(/\{\$topId\}/g, value.topid);
						tempHtml = tempHtml.replace("{$date}", friendly_date(value.createtime));
						tempHtml = tempHtml.replace("{$childNum}", (value.child === false || typeof(value.child) === 'undefined') ? 0 : value.child.length);
						tempHtml = tempHtml.replace("{$parentId}", value.pid);
						tempHtml = tempHtml.replace("{$content}", htmlspecialchars_decode(value.content));
						tempHtml = tempHtml.replace("{$avatar}", "/index.php?g=Api&m=Avatar&a=index&size=50&uid="+value.user_id);
						tempHtml = tempHtml.replace(/\{\$commentId\}/g, value.id);

						//如果是一级评论则输出楼层号并将楼层数降1
						if(value.parent == 0){
							tempHtml = tempHtml.replace("{$floor}", module.exports.buildFloor(COMMENT.TOTAL - (COMMENT.PAGE - 1) * COMMENT.SIZE + diffFloor));
							diffFloor = diffFloor - 1;
						}else{
							tempHtml = tempHtml.replace("{$floor}", ""); //删除楼层标签
						}
						outPut = true;
					}else{
						outPut = false;
					}
				}
				//如果需要输出
				if(outPut){
					//第一次加载，正序输出
					if(firstLoad){
						containerDom.append(tempHtml);
					//在前面增量输出
					}else{
						containerDom.prepend(tempHtml);
						//var commentDom = $("#comment-"+value.id);
						//commentDom.hide();
						//commentDom.slideDown();
					}
				}
				var commentDom = $("#comment-"+value.id);

				//输出评论的回复
				if(typeof(value.child) !== 'undefined' && value.child !== false ){
					if($("#reply-"+value.id).length == 0){
						tempHtml = replyContainerTemplate.replace("{$commentId}", value.id);
						commentDom.next(".list-group-separator").after(tempHtml);
					}
					module.exports.buildComment(value.child, "#reply-" + value.id);
				}
			});
		},

		//监听评论下方的回复按钮
		listenReplyAction: function(){
			var replyFormTemplate = '<div class="reply-form" id="reply-form-{$parentId}"><textarea class="form-control" id="reply-text-{$parentId}" rows="3" placeholder="回复给@{$parentAuthor}："></textarea><div class="clearfix"><div class="pull-right"><a href="javascript:void(0)" class="btn btn-primary btn-xs comment-submit" data-parent="{$parentId}" data-topid="{$topId}">回复</a></div></div></div>';
			$('.reply-action').unbind('click');
			$('.reply-action').on("click", function(){

				var parentId = $(this).data('parent-id');
				var parentAuthor = $(this).data('parent-author');
				var topId = $(this).data('top-id');
				if($("#reply-form-"+parentId).length == 0){
					//先收起所有评论框
					$(".reply-form").slideUp();
					//$(".reply-form").hide();
					tempHtml = replyFormTemplate.replace(/\{\$parentId\}/g, parentId);
					tempHtml = tempHtml.replace(/\{\$topId\}/g, topId);
					tempHtml = tempHtml.replace("{$parentAuthor}", parentAuthor);
					$("#comment-"+parentId).children(".row-content").append(tempHtml);
					$("#reply-form-"+parentId).slideDown();
					$("#reply-text-"+parentId).focus();// 获得焦点

					module.exports.listenFormSubmit();
				}else{
					$(".reply-form").not("#reply-form-"+parentId).slideUp();
					//$(".reply-form").not("#reply-form-"+parentId).hide();
					//display为none，也就是接下来要展开了
					if($("#reply-form-"+parentId).css('display') == 'none'){
						$("#reply-text-"+parentId).focus();// 获得焦点
					}
					$("#reply-form-"+parentId).slideToggle();
				}
			});
		},

		//监听评论翻页事件
		listenPagination: function(){
			$(".list-comment-pagination a").unbind('click');
			$(".list-comment-pagination a").on('click', function(){
				firstLoad = true;
				GV.COMMENT.URL_GET = $(this).attr('href'); //改变评论获取的路径
				module.exports.getComments();//重新加载评论

				return false;
			});
		},

		//监听“更多评论”的加载事件
		listenReplyLoad: function(){
			$(".reply-load-action").unbind('click');
			$(".reply-load-action").on('click', function(){
				var parentId = $(this).data('parent');
				GV.COMMENT.REPLY_LOAD_DOM = "#reply-load-"+parentId;
				GV.COMMENT.URL_GET = GV.COMMENT.URL_REPLY_LOAD + "&parent=" + parentId;
				$(this).remove();
				$(GV.COMMENT.REPLY_LOAD_DOM).next(".list-group-separator").remove()
				module.exports.getComments();//增量加载评论

				return false;
			});
		},

		buildFloor: function(floor){
			var floorTemplate = '<span class="label label-default">'+floor+"#</span>";

			return floorTemplate;

		},

		initRatingSubmit: function(){
			$("#rate-submit").rating({
				static: false,
				showHint: true,
				click: function(value, rating){
					rating.rate(value);
					$("input[name='rate']").val(value);
	        	},
			});
		},

		/* 测试通信是否正常 */
		debug: function(){
			alert('success');
		}
	}
});

function htmlspecialchars_decode (string, quote_style) {
  var optTemp = 0,
    i = 0,
    noquotes = false;
  if (typeof quote_style === 'undefined') {
    quote_style = 2;
  }
  string = string.toString().replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  var OPTS = {
    'ENT_NOQUOTES': 0,
    'ENT_HTML_QUOTE_SINGLE': 1,
    'ENT_HTML_QUOTE_DOUBLE': 2,
    'ENT_COMPAT': 2,
    'ENT_QUOTES': 3,
    'ENT_IGNORE': 4
  };
  if (quote_style === 0) {
    noquotes = true;
  }
  if (typeof quote_style !== 'number') {
    quote_style = [].concat(quote_style);
    for (i = 0; i < quote_style.length; i++) {
      if (OPTS[quote_style[i]] === 0) {
        noquotes = true;
      } else if (OPTS[quote_style[i]]) {
        optTemp = optTemp | OPTS[quote_style[i]];
      }
    }
    quote_style = optTemp;
  }
  if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
    string = string.replace(/&#0*39;/g, "'");
  }
  if (!noquotes) {
    string = string.replace(/&quot;/g, '"');
  }
  string = string.replace(/&amp;/g, '&');
  return string;
}

function friendly_date(timestampInPage){
   var timestampNow = Math.round(new Date().getTime()/1000);
   var dif = timestampNow-timestampInPage;
   var outPut ="";

   if (dif<=15) outPut ="刚刚";
   else if(dif<60) outPut=dif+"秒前";
   else if(dif<3600) outPut=Math.round(dif/60)+"分钟前";
   else if(dif<86400) outPut=Math.round(dif/3600)+"小时前";
   else {
       var date = new Date(timestampInPage*1000);
       var hours = date.getHours();
       var minutes =date.getMinutes();
       if(hours<10) hours = "0"+hours;
       if(minutes<10) minutes="0"+minutes;

       outPut = date.getMonth()+1+"月"+(date.getDate()+1)+"日 "+hours+":"+minutes;
   }
   return outPut;
}

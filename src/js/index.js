(function(){
//通用样式
require('../css/icon.css');
require('../css/common.css');

//下拉菜单响应
require('./module/dropdown.js');
//tab响应
require('./module/tab.js');
//手机版导航折叠
require('./module/collapse.js');
//轮播图
require('./module/jquery.lightSlider.js');
require('./module/comment.js');

//头部轮播
if($("#index-banner").length > 0){
	$("#index-banner").lightSlider({
	    minSlide:1,
	    maxSlide:1,
	    mode:'fade',
	    auto: true
	});
}
//新闻轮播
if($("#index-news-slider").length > 0){
	$("#index-news-slider").lightSlider({
	    minSlide:1,
	    maxSlide:1,
	    mode:'fade',
	    auto: true
	});
}
//返回顶部
$('.J_gotoTop').on('click', function(){
    $("body,html").animate({scrollTop: 0},500);
    return false;
});
//会员模块
$('.user_changeAddress').click(function(){
	$(this).parent('.ad1').css('display','none');
	$(this).parent('.ad1').siblings('.ad2').css('display','block');
	require.ensure(['./module/superSelect.js','./module/location.js'],function(require){
		var superSelect = require('./module/superSelect.js')
		var data = require('./module/location.js');
		var options = {
		data : data,
		text : ['<option value="">-省-</option>','<option value="">-市-</option>','<option value="">-区-</option>'],
		}

		var sel = new superSelect(options);
		sel.bind('#birthprovince');
		sel.bind('#birthcity');
		sel.bind('#birthdist');

		var sel = new superSelect(options);
		sel.bind('#resideprovince');
		sel.bind('#residecity');
		sel.bind('#residedist');
	});
});

//登录页密码显示
$('#mess').click(function(){
	var obj = $(this);
	var password = $(this).parent('.input-group-addon').siblings('#password');
	if(obj.html()=='显示'){
        $(password).attr('type','text');
        obj.html('隐藏');
    }else{
        $(password).attr('type','password');
        obj.html('显示');
    }
});

})();

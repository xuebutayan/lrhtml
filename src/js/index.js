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

})();
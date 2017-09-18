var common = {
	init:function(){
		this.listenScrollTo();
	}
	listenScrollTo: function(){
		var bt = $('.J_gotoTop');

	    //返回顶部
	    bt.on('click', function(){
	        $("body,html").animate({scrollTop: 0},500);
	        return false;
	    });
	}
}
module.exports = common;
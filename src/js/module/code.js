
module.exports =function toggle_pwd(obj){
    if(obj.innerHTML=='显示'){
        $('#password').attr('type','text');
        obj.innerHTML='隐藏'
    }else{
        $('#password').attr('type','password');
        obj.innerHTML='显示'
    }
}
}
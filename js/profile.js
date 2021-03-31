$(document).ready(function () {
    GetCategories();
    SessionCheck();
    

})

SessionCheck=()=>
{
    let register = new Session();
    var bool=register.SessionCheck();
    var id=register.GetId();
    if (id!=null)
    {
        $('#ProfileHeader').text(id+'\'s Profile ');
    }
}












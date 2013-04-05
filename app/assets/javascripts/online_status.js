(function(){
    var origin = location.protocol+"//"+location.hostname;
    if (location.port != "") {
        origin += ":"+location.port
    }
    origin = location.origin || origin;

    function sortUsers(){
        var onlineUsers = $(".online-user").filter(function(idx,user){
            return user.style.opacity == "1";
        });
        var offlineUsers = $(".online-user").filter(function(idx,user){
            return user.style.opacity != "1";
        });
        $("#online_status_section").append($.merge(onlineUsers, offlineUsers));
    }
    function checkOnlineUsers(){
        var list_url = origin + "/api/v1/online_status/list";

        var online_user_ids = [];
        var query = {
            room_id : AsakusaSatellite.current.room,
            status  : 'active'
        };
        jQuery.get(list_url, query, function(users){
            if (AsakusaSatellite.current.public) {
            } else {
                $.each(AsakusaSatellite.current.member, function(idx, id){
                    var _users = $.map(users, function(user){return user._id});
                    if ( $.inArray(id, _users) == -1) {
                        $("#online_status_user_"+id).css("opacity", "0.5");
                    } else {
                        $("#online_status_user_"+id).css("opacity", "1");
                    }
                });
            }
        });
        sortUsers();
    }

    AsakusaSatellite.pusher.connection.bind('connected', checkOnlineUsers);
    setInterval(checkOnlineUsers, 30 * 1000);
    checkOnlineUsers();
})();

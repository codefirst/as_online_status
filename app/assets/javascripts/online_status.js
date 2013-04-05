(function (){
    function ping(){
        jQuery.get(update_url, {room_id : AsakusaSatellite.current.room});
    }

    var origin = location.protocol+"//"+location.hostname;
    if (location.port != "") {
        origin += ":"+location.port
    }
    location.origin = location.origin || origin;

    var heartbeat_rate = 10 * 1000;
    var update_url = location.origin + "/api/v1/online_status/update";
    AsakusaSatellite.pusher.connection.bind('connected', ping);
    setInterval(ping, heartbeat_rate);
})();
(function(){
    function sortUsers(){
      var onlineUsers = $(".online-user").filter(function(idx,user){
        return user.style.opacity == "1";
      });
      var offlineUsers = $(".online-user").filter(function(idx,user){
        return user.style.opacity != "1";
      });
      $(".notification_section").append($.merge(onlineUsers, offlineUsers));
    }
    function checkOnlineUsers(){
        var list_url = location.origin + "/api/v1/online_status/list";

        var online_user_ids = [];
        jQuery.get(list_url, {room_id : AsakusaSatellite.current.room}, function(users){
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
    setInterval(checkOnlineUsers, 10 * 1000);
})();

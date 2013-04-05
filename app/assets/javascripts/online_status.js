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
    var online_user_ids = [];

    function checkOnlineUsers(){
        var list_url = location.origin + "/api/v1/online_status/list";
        jQuery.get(list_url, {room_id : AsakusaSatellite.current.room}, function(users){
            var user_ids = $.map(users, function(user){return user._id});
            $.each(online_user_ids, function(idx, id){
                if ($.inArray(id, user_ids) == -1) {
                    $("#online_status_user_"+id).remove();
                    online_user_ids = online_user_ids.filter(function(_id){return id != _id});
                }
            });

            $.each(users, function(idx, user){
                if ($.inArray(user._id, online_user_ids) == -1) {
                    var card = createCard(user);
                    onlinestatus_section.append(card);
                    online_user_ids.push(user._id);
                }
            });
        })
    }

    function createCard(user){
        var card = $("<div></div>").
            attr("id","online_status_user_"+user._id).
            addClass("online-user");
        var img = $("<img></img>").attr("src", user.profile_image_url);
        var info = $("<div></div>").addClass("info");
        var username = $("<span></span>").text(user.screen_name).css("display", "block");
        var status = $("<span></span>").text(user.name);
        info.append(username).append(status);
        card.append(img).append(info);

        return card;
    }

    var onlinestatus_section = notificationArea.addSection("online_status","Online Status");

    AsakusaSatellite.pusher.connection.bind('connected', checkOnlineUsers);
    setInterval(checkOnlineUsers, 10 * 1000);
})();

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
            $.each(users, function(idx, user){
                if ($.inArray(user._id, online_user_ids) == -1) {
                    var card = createCard(user);
                    onlinestatus_section.append(card);
                    online_user_ids.push(user._id);
                }
            })
        })
    }

    function createCard(user){
        var card = $("<div></div>").css({
            "margin" : "5px",
            "padding" : "5px",
            "min-height" : "40px",
            "border-bottom" : "1px solid rgba(0,0,0,0.2)",
            "-webkit-box-shadow" : "0px 1px 0px rgba(255,255,255,0.3)",
        });
        var img = $("<img src='"+user.profile_image_url+"'></img>").css({
            "-webkit-border-radius" : "5px",
            "width" : "40px",
            "height" : "40px",
            "float" : "left",
        });
        var info = $("<div></div>").css({
            "margin-left" : "45px",
        });
        var username = $("<span>"+user.screen_name+"</span>").css("display", "block");
        var status = $("<span>"+user.name+"</span>");
        info.append(username).append(status);
        card.append(img).append(info);

        return card;
    }

    var onlinestatus_section = notificationArea.addSection("online_status","Online Status");

    AsakusaSatellite.pusher.connection.bind('connected', checkOnlineUsers);
    setInterval(checkOnlineUsers, 10 * 1000);
})();

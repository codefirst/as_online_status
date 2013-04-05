class OnlineStatusListener < AsakusaSatellite::Hook::Listener
  render_on :notification_area_section, :partial => "online_status_section"
  render_on :account_setting_item, :partial => "online_status_setting"

  def global_header(context)
    controller = context[:request][:controller]
    action     = context[:request][:action]

    case {:controller => controller, :action => action}
    when {:controller => "chat", :action => "room"}
      "<style>#{read_file "app/assets/stylesheets/online_status.css"}</style>"
    end
  end

  def global_footer(context)
    controller = context[:request][:controller]
    action     = context[:request][:action]

    case {:controller => controller, :action => action}
    when {:controller => "chat", :action => "room"}
      "<script>#{read_file "app/assets/javascripts/online_status.js"}</script>"
    end
  end
end

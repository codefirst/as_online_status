# -*- encoding: utf-8 -*-
module Api
  module V1
    class OnlineStatusController < ApplicationController
      @@TIMEOUT = 60

      def list
        if current_user.nil?
          render :json => {:status => 'error', :error => 'login not yet'}
          return
        end

        room = OnlineStatusRoom.where(:room_id => params['room_id']).first
        if room.nil?
          render :json => {:status => 'error', :error => 'room does not exist'}
        else
          online_users = room.online_status_users.where(:updated_at.gt => Time.now - @@TIMEOUT)
          render :json => online_users.map{|user| User.where(:_id => user.user_id).first}.to_json
        end

        if params['status'] then
          user = OnlineStatusUser.find_or_create_by(:user_id => current_user._id, :room_id => params['room_id'])
          user.update_attributes(:updated_at => Time.now)

          room = OnlineStatusRoom.find_or_create_by(:room_id => params['room_id'])
          unless room.online_status_users.where(:_id => user._id).first
            room.online_status_users.push user
          end
          room.save
        end
      end
    end
  end
end

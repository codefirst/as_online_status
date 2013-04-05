class OnlineStatusUser
  include Mongoid::Document
  include Mongoid::Timestamps
  index :updated_at
  belongs_to :online_status_room

  field :user_id
  field :room_id
  field :hidden, :type => Boolean ,:default => false
end

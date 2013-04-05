class OnlineStatusRoom
  include Mongoid::Document
  include Mongoid::Timestamps

  field :room_id
  has_and_belongs_to_many :online_status_users
end

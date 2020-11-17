# frozen_string_literal: true

class Article < ApplicationRecord
  enum source: {
    BBC: 0,
    VOA: 1,
    NHK: 2
  }, _prefix: true

  latest_date = Article.maximum(:created_at).to_date

  scope :latest, -> { where(created_at: latest_date.in_time_zone.all_day) }
end

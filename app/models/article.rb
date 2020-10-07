class Article < ApplicationRecord
  enum source: {
    BBC: 0,
    CNN: 1,
    NHK: 2
  }, _prefix: true
end

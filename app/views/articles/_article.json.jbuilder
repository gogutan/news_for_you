json.extract! article, :id, :source, :title, :japanese_title, :words, :level, :created_at, :updated_at
json.url article_url(article, format: :json)

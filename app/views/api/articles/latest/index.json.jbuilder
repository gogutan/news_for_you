json.array! @articles do |article|
  json.id             article.id
  json.source         article.source
  json.title          article.title
  json.japanese_title article.japanese_title
  json.url            article.url
  json.words          article.words
  json.toeic          article.toeic
  json.created_on     article.created_at.strftime("%Y-%m-%d")
end

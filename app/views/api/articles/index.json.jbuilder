json.array! @articles do |article|
  json.id             article.id
  json.source         article.source
  json.title          article.title
  json.japanese_title article.japanese_title
  json.url            article.url
  json.words          article.words
  json.level          article.level
end
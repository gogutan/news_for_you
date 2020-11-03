# frozen_string_literal: true

require 'nokogiri'
require 'open-uri'

def setup_doc(url)
  charset = 'utf-8'
  html = URI.open(url, &:read)
  doc = Nokogiri::HTML.parse(html, nil, charset)
  doc.search('br').each { |n| n.replace("\n") }
  doc
end

namespace 'scraping' do
  desc 'Save BBC Articles'
  task bbc: :environment do
    root = 'https://www.bbc.com'
    url = 'https://www.bbc.com/news'
    articles = setup_doc(url).xpath("//div[contains(@class, 'nw-c-most-read__items')]//div[contains(@class, 'gs-o-media__body')]")
    articles.each do |article|
      href = article.at_css('a')[:href]
      title = article.at_css('span').text
      Article.create(source: 0, title: title, japanese_title: '日本語タイトル', url: root + href, words: 1000, level: 10)
    end
  end
end

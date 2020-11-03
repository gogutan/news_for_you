# frozen_string_literal: true

require 'nokogiri'
require 'open-uri'
require 'google/cloud/translate'

def setup_doc(url)
  charset = 'utf-8'
  html = URI.open(url, &:read)
  doc = Nokogiri::HTML.parse(html, nil, charset)
  doc.search('br').each { |n| n.replace("\n") }
  doc
end

def translate(text)
  project_id = Rails.application.credentials.google_api[:id]
  language_code = 'ja'

  translate = Google::Cloud::Translate.translation_v2_service project_id: project_id
  translation = translate.translate text, to: language_code

  translation.text.inspect[1...-1]
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
      japanese_title = translate(title)
      Article.create(source: 0, title: title, japanese_title: japanese_title, url: root + href, words: 1000, level: 10)
    end
  end
end

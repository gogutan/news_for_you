# frozen_string_literal: true

class Api::Articles::LatestController < ApplicationController
  def index
    @articles = Article.latest
  end
end

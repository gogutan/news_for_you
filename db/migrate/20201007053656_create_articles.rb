# frozen_string_literal: true

class CreateArticles < ActiveRecord::Migration[6.0]
  def change
    create_table :articles do |t|
      t.integer :source
      t.string :title
      t.string :japanese_title
      t.integer :words
      t.integer :level

      t.timestamps
    end
  end
end

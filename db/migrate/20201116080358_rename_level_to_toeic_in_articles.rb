class RenameLevelToToeicInArticles < ActiveRecord::Migration[6.0]
  def change
    rename_column :articles, :level, :toeic
  end
end

Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :articles
  namespace "api" do
    resources :articles, only: [:index]
    namespace "articles" do
      resources :latest, only: [:index]
    end
  end
end

# app/views/api/quotes/show.json.jbuilder
json.extract! @quote, :id, :quote, :author, :category
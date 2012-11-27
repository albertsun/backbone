
var M = Backbone.Model.extend({
  defaults: {
    "state": "draft",
    "a": 0,
    "b": 0
  }
});

var V = Backbone.View.extend({
  tagName: "tr",
  initialize: function(){
    this.template = _.template($('#item-template').html());
  },
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});

var C = new Backbone.Collection.extend({
  model: M
});
var collection = new C();

var filters = new Backbone.Model({
  "state":"draft",
  "sort":"a"
});

var TableView = Backbone.View.extend({
  el: $("#item-table tbody"),
  initialize: function(){

  },
  render: function() {
    this.$el.html("");

    this.addModels(this.apply_sort(this.apply_filters(collection)));
  },
  addModels: function(models){
    if (models instanceof Backbone.Collection) {
      models.each(this.addQuestion);
    } else {
      _(models).each(this.addQuestion);
    }
  },
  addModel: function(m){
    var v = new V({model: m});
    this.$el.append(v.render().el);
  },
  apply_filters: function(c){
    var state = filters.get("state");
    return new C(c.filter(function(m){ return m.get("state") === state; }));
  },
  apply_sort: function(c){
    var sort = filters.get("sort");
    return c.sortBy(function(m){
      return m.get(sort);
    });
  }
});


$(document).ready(function() {
  console.log("ready");

  
  var table_view = new TableView();
    
});

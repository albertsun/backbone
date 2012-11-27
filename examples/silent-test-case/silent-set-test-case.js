
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

var Table = Backbone.Collection.extend({
  model: M
});

var TableView = Backbone.View.extend({
  initialize: function(){
    _.bindAll(this);
    this.template = _.template($('#table-template').html());
    this.state_template = _.template($('#state-template').html());
    this.sort_template = _.template($('#sort-template').html());
    this.render();
  },
  events: {
    "click .state-toggle th": "state_click",
    "click .sort-toggle th":  "sort_click"
  },
  state_click: function(e){
    e.preventDefault();
    var val = $(e.target).text();
    if (!_.isEmpty(val)) filters.set({state: val});
  },
  sort_click: function(e){
    e.preventDefault();
    var val = $(e.target).text();
    if (!_.isEmpty(val)) filters.set({sort: val});
  },
  render: function() {
    console.log("render");
    this.$el.html(this.template());
    this.render_state();
    this.render_sort();
    this.render_rows();
  },
  render_state: function() {
    console.log("render state");
    this.$(".state-toggle").html(this.state_template(filters.toJSON()));
  },
  render_sort: function() {
    console.log("render sort");
    this.$(".sort-toggle").html(this.sort_template(filters.toJSON()));
  },
  render_rows: function() {
    this.$("tbody").html("");
    this.addRows(this.apply_sort(this.apply_filters(collection)));
  },
  addRows: function(models){
    if (models instanceof Backbone.Collection) {
      models.each(this.addQuestion);
    } else {
      _(models).each(this.addRow);
    }
  },
  addRow: function(m){
    var v = new V({model: m});
    this.$el.append(v.render().el);
  },
  apply_filters: function(c){
    var state = filters.get("state");
    return c.filter(function(m){ return m.get("state") === state; });
  },
  apply_sort: function(c){
    var sort = filters.get("sort");
    return _(c).sortBy(function(m){
      return m.get(sort);
    });
  }
});

var collection;
var filters = new Backbone.Model({
  "state":"draft",
  "sort":"a"
});
var table_view;

$(document).ready(function() {
  console.log("ready");

  collection = new Table;
  collection.reset([
    {state: "published", a: Math.round(Math.random()*10), b: Math.round(Math.random()*10) },
    {state: "published", a: Math.round(Math.random()*10), b: Math.round(Math.random()*10) },
    {state: "published", a: Math.round(Math.random()*10), b: Math.round(Math.random()*10) },
    {state: "published", a: Math.round(Math.random()*10), b: Math.round(Math.random()*10) },
    {state: "draft", a: Math.round(Math.random()*10), b: Math.round(Math.random()*10) },
    {state: "draft", a: Math.round(Math.random()*10), b: Math.round(Math.random()*10) },
    {state: "draft", a: Math.round(Math.random()*10), b: Math.round(Math.random()*10) },
    {state: "draft", a: Math.round(Math.random()*10), b: Math.round(Math.random()*10) },
    {state: "draft", a: Math.round(Math.random()*10), b: Math.round(Math.random()*10) }
  ]);
  table_view = new TableView({el: $("#item-table")});
  
  filters.on("change:state", function(){
    var new_state = filters.get("state");
    if (new_state === "draft") {
      filters.set({"sort":"a"},{silent:true});
    } else {
      filters.set({"sort":"b"},{silent:true});
    }
    table_view.render();
  });
  filters.on("change:sort", table_view.render_rows);
  filters.on("change:sort", table_view.render_sort);

});


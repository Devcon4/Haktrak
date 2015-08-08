// ID of the Google Spreadsheet
 var spreadsheetID = "1hFsBm010k5GqV-4VfW4pEZLqARV-dyLbwnbBUQR1h1Q";
 
 // Make sure it is public or set to Anyone with link can view 
 var url = "https://spreadsheets.google.com/feeds/list/"+spreadsheetID+"/od6/public/values?alt=json";

//questLog = new Mongo.Collection("quests");
var jsonDep = new Deps.Dependency();
var jsonAr = [];

if (Meteor.isClient) {  
  Template.quests.helpers({
    lines: function(){ 
      getData();
      jsonDep.depend();
      return jsonAr;
    }
  });
}

function getData(){
  $.getJSON(url, function(data) {
    for(var i = 0; i < data.feed.entry.length; i++){
      jsonAr[i] = {value: data.feed.entry[i].gsx$value.$t, text: data.feed.entry[i].gsx$text.$t};
    }
    jsonDep.changed();
  });
}
            
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

//Routes
Router.route('/', {
  name: 'home',
  template: 'home'
});
Router.route('/quests', {
  name: 'quests',
  tmeplate: 'quests'
});
Router.route('/stats', {
  name: 'stats',
  template: 'stats'
});

Router.configure({
  layoutTemplate: 'layout1'
});
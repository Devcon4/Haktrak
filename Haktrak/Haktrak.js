/* Dev spreadsheet info. */
var spreadsheetID = "1hFsBm010k5GqV-4VfW4pEZLqARV-dyLbwnbBUQR1h1Q";
var thisUrl = "https://spreadsheets.google.com/feeds/list/"+spreadsheetID+"/od6/public/values?alt=json";

QuestList = new Mongo.Collection('questList');

/* Code to run on each client. */
if (Meteor.isClient) {  
  
  /* Gets the quest data from the spreadsheet. */
  Template.quests.helpers({
    quests: function(){
      Meteor.call("sheetsLoop", thisUrl);
      return QuestList.find({}, { sort: {OrderID: 1 } });
    }
  });
  
  /* event for when we need a modal. */
  Template.layout1.events({  
    'click button.modalBtn': function(event, template) {
      var name = template.$(event.target).data('modal-template');
      Session.set('activeModal', name);
    }
  });
  
  /* activates modal. */
  Template.modal.helpers({  
    activeModal: function() {
      return Session.get('activeModal');
    }
  });
}

/* Global methods */
Meteor.methods({
  /* (fake)sync http.get */
  getJSON: function(url){
    var httpGetWrapper = Meteor.wrapAsync(HTTP.get);
    var result = httpGetWrapper(url);
    return result;
  },
  /* gets google sheet data and adds it to the QuestList. */
  sheetsLoop: function(url) {
    console.log("QuestList updated.");
    QuestList.remove({});
    var result = Meteor.call("getJSON", url);
    for(var i = 0; i < result.data.feed.entry.length; i++){
      try {
        QuestList.insert({
          id: result.data.feed.entry[i].gsx$id.$t,
          value: result.data.feed.entry[i].gsx$value.$t,
          text: result.data.feed.entry[i].gsx$text.$t,
          isActive: 0,
          isReg: 0
        });
      } catch(e) {
        //console.log(e);
      }
    }
  },
  buttonToggled: function(userID){
    var btn = QuestList.find({createdBy: userID});

  }
});

/* Code to run on the server. */
if (Meteor.isServer) {
  /* Startup only code. */
  Meteor.startup(function () {
    QuestList._ensureIndex({text: 1}, {unique: true});
  });
}

/* Routes and router config for HakTrak. */

/* Landing page. */
Router.route('/', {
  name: 'home',
  template: 'home'
});

/* Quest checklist. */
Router.route('/quests', {
  name: 'quests',
  tmeplate: 'quests'
});

/* Stats page. */
Router.route('/stats', {
  name: 'stats',
  template: 'stats'
});

/* Admin page */
Router.route('/admin', {
  name: 'admin',
  template: 'admin'
});

/* Sets the layout Template to Layout1. */
Router.configure({
  layoutTemplate: 'layout1'
});
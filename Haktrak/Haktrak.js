/* Dev spreadsheet info. */
var spreadsheetID = "1hFsBm010k5GqV-4VfW4pEZLqARV-dyLbwnbBUQR1h1Q";
var url = "https://spreadsheets.google.com/feeds/list/"+spreadsheetID+"/od6/public/values?alt=json";

/* dependency to make sure we got data from getData(). */
var jsonDep = new Deps.Dependency();
var jsonAr = [];

/* Code to run on each client. */
if (Meteor.isClient) {  
  
  /* Gets the quest data from the spreadsheet. */
  Template.quests.helpers({
    lines: function(){ 
      getData();
      jsonDep.depend();
      return jsonAr;
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

/* Sets the jsonAr to the spreadsheet data. Messy: needs to be re-done. */
function getData(){
  $.getJSON(url, function(data) {
    for(var i = 0; i < data.feed.entry.length; i++){
      jsonAr[i] = {value: data.feed.entry[i].gsx$value.$t, text: data.feed.entry[i].gsx$text.$t};
    }
    jsonDep.changed();
  });
}

/* Code to run on the server. */
if (Meteor.isServer) {
  /* Startup only code. */
  Meteor.startup(function () {
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

/* Sets the layout Template to Layout1. */
Router.configure({
  layoutTemplate: 'layout1'
});
var builder = require('botbuilder');
var restify = require('restify');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: null,
    appPassword: null
});
var bot = new builder.UniversalBot(connector, {
    localizerSettings: {
        botLocalePath: "./locale",
        defaultLocale: "en"
    }
});
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

var intents = new builder.IntentDialog();

bot.dialog('/', [
    function (session) {
        session.beginDialog('/localePicker');
    },
    function (session) {
        builder.Prompts.text(session, "greeting");
    },
    function (session, results) {
        session.userData.name = results.response;
        builder.Prompts.number(session, "income");
    },
    function (session, results) {
        session.userData.income = results.response;
        builder.Prompts.number(session, "age_prompt");
    },
    function (session, results) {
        session.userData.ageGroup = results.response;
        session.send("final_quote",session.userData.name,session.userData.income,session.userData.ageGroup,taxAge(session.userData.ageGroup,session.userData.income));
    }
]);

bot.dialog('/localePicker', [
    function (session) {
        // Prompt the user to select their preferred locale
        builder.Prompts.choice(session,"locale",'English|हिंदी|ಕನ್ನಡ');
    },
    function (session, results) {
        // Update preferred locale
        var locale;
        switch (results.response.entity) {
            case 'English':
                locale = 'en';
                break;
            case 'हिंदी':
                locale = 'hi';
                break;
            case 'ಕನ್ನಡ':
                locale = 'ka';
                break;
        }
        session.preferredLocale(locale, function (err) {
            if (!err) {
                // Locale files loaded
                session.endDialog('');
            } else {
                // Problem loading the selected locale
                session.error(err);
            }
        });
    }
]);

var taxAge = function(age,income){
  if (age < 60) {
    return taxDueBelow60(income);
  }
  if (age > 60 && age < 80) {
    return taxDue6080(income);
  }
  if (age > 80) {
      return taxDueAbove80(income);
  }
};

var taxDueBelow60 = function(income){
  var taxAmount = 0;
  if(income <= 250000){

  }
  if(income > 250000 && income <= 500000){
    taxAmount = (income - 250000) * 0.1;
  }
  if(income > 500000 && income <= 1000000){
    taxAmount = ((250000 * 0.1) + (income - 500000) * 0.2);
  }
  if(income > 1000000){
    taxAmount = ((250000 * 0.1) + (500000 * 0.2) + (income - 100000) * 0.3);
  }
  taxAmount = taxAmount+ (taxAmount * 0.03);
  return taxAmount;
};
var taxDue6080 = function(income){
  var taxAmount = 0;
  if(income <= 300000){

  }
  if(income > 300000 && income <= 500000){
    taxAmount = (income - 300000) * 0.1;
  }
  if(income > 500000 && income <= 1000000){
    taxAmount = ((200000 * 0.1) + (income - 500000) * 0.2);
  }
  if(income > 1000000){
    taxAmount = ((200000 * 0.1) + (500000 * 0.2) + (income - 100000) * 0.3);
  }
  taxAmount = taxAmount+ (taxAmount * 0.03);
  return taxAmount;
};
var taxDueAbove80 = function(income){
  var taxAmount = 0;
  if(income <= 250000){
  }
  if(income > 250000 && income <= 500000){
  }
  if(income > 500000 && income <= 1000000){
    taxAmount = ((income - 500000) * 0.2);
  }
  if(income > 1000000){
    taxAmount = ((500000 * 0.2) + (income - 100000) * 0.3);
  }
  taxAmount = taxAmount+ (taxAmount * 0.03);
  return taxAmount;
};
/*
bot.dialog('/', intents);

intents.matches(/(.*)change(.*)name(.*)/gmi, [
    function (session) {
        session.beginDialog('/profile');
    },
    function (session, results) {
        session.send('Ok... Changed your name to %s', session.userData.name);
    }
]);

intents.onDefault([
    function (session, args, next) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            next();
        }
    },
    function (session, results) {
        session.send('Hello %s!', session.userData.name);
    }
]);

bot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog("Ok… Goodbye.");
        bot.dialog('/deleteprofile');
    }
]);
*/

var widget;
var startTime;
var periodStartTime;
var timeoutId;
var periodTimeMinutes = 20;
var periodTimeSeconds = 0;
var scoreHome = 0;
var scoreGuest = 0;
var shotsOnGoalHome = 0;
var shotsOnGoalGuest = 0;
var shotsDigitsAmount = 2;
var penaltySecondsPeriod = 120;//2 minutes
var homePenalties;
var guestPenalties;
var secondsInMinute = 60;
var milisecondsInSecond = 1000;
var timeOutMiliseconds = 1000;
var timeMinutesLength = 2;
var penaltyMinutesLength = 1;
var playerNumberDigitsAmount = 2;
var scoreDigitsAmount = 3;            
var period = 1;
var periodDigitsAmount = 1;
var periodMinutesLength = 1;

function getPeriodTimeInSeconds(){
    return periodTimeMinutes * secondsInMinute + periodTimeSeconds;
}

window.onload = function () {
    //widget model moved to widget.js

    //creating widget
    widget = new PerfectWidgets.Widget("root", jsonModel);

    homePenalties = new Array();
    guestPenalties = new Array();
    periodStartTime = new Date();            
    startTime = new Date();
    
    setDigitValue(scoreHome,scoreDigitsAmount,"ScoreHome");
    setDigitValue(scoreGuest,scoreDigitsAmount,"ScoreGuests");

    setDigitValue(shotsOnGoalHome,shotsDigitsAmount,"ShotsOnGoalHome");            
    setDigitValue(shotsOnGoalGuest,shotsDigitsAmount,"ShotsOnGoalGuest");

    
    setDigitValue(period,periodDigitsAmount,"Period");            
    
    clearDigit("PenaltyPlayerHome2",playerNumberDigitsAmount);
    clearDigit("PenaltyPlayerGuest1",playerNumberDigitsAmount);
    clearDigit("PenaltyPlayerGuest2",playerNumberDigitsAmount); 


    
    clearTimeDigit("PenaltyTimeHome2",penaltyMinutesLength);
    clearTimeDigit("PenaltyTimeGuest1",penaltyMinutesLength);
    clearTimeDigit("PenaltyTimeGuest2",penaltyMinutesLength); 

    setDigitTime(periodTimeMinutes,timeMinutesLength,periodTimeSeconds,"Time");            
    timeoutId = window.setTimeout(updateTime,timeOutMiliseconds);
    //TODO: window.clearTimeout(timeoutVariable)
}

function generateRandom(maximum){
    return Math.floor((Math.random()*maximum)+1);
}

function generateRandomPlayer(penalties){
  var playerNumber = generateRandom(99);
  var repeat = true;
    while (true){
      repeat = false;
      for (penalty in homePenalties){
        if (penalty["playerNumber"]==playerNumber){
           playerNumber = generateRandom(99);
           repeat = true;
           break;
        }                                
      }
      if (!repeat){
        return playerNumber;
      }
    }
}

function generateHomePenalty(){
     if (homePenalties.length<2){
        homePenalties.push({"playerNumber":generateRandomPlayer(homePenalties),"startTime":new Date()});
     }
}

function generateGuestPenalty(){
    if (guestPenalties.length<2){
       guestPenalties.push({"playerNumber":generateRandomPlayer(guestPenalties),"startTime":new Date()});                        
    }
}


function updatePeriod(){
    if (period<3){
       period++;
    }
    periodStartTime = new Date();
    periodTimeMinutes = periodMinutesLength;
    periodTimeSeconds = 0;

    setDigitValue(period,periodDigitsAmount,"Period");
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(updateTime,timeOutMiliseconds);
}

function updateTime(){
    var currentTime = new Date();
    var timeDiff = currentTime - periodStartTime;
    timeDiff /= milisecondsInSecond;             
    var elapsedSeconds = timeDiff;
    if (elapsedSeconds >= getPeriodTimeInSeconds()) {
       clearTimeDigit("Time",timeMinutesLength);
       clearTimeout(timeoutId);               
       if (period<3){
         updatePeriod();
       }
       else{
         return;
       }
    } 
    updatePenalties();           
    currentTime =  getPeriodTimeInSeconds() - elapsedSeconds;
    var minutesValue = Math.floor(currentTime/secondsInMinute);
    var secondsValue = Math.floor(currentTime%secondsInMinute);
    setDigitTime(minutesValue,timeMinutesLength,secondsValue,"Time");
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(updateTime,timeOutMiliseconds);
}

function removeItemFromArray(collection, value){
   var idx = collection.indexOf(value);
   if (idx != -1){
      return collection.splice(idx, 1); // The second parameter is the number of elements to remove.
   }
   return false;
}


function clearPenalties(){
   clearDigit("PenaltyPlayerHome1",playerNumberDigitsAmount);         
   clearDigit("PenaltyPlayerGuest1",playerNumberDigitsAmount);

   clearTimeDigit("PenaltyTimeHome1",penaltyMinutesLength);
   clearTimeDigit("PenaltyTimeGuest1",penaltyMinutesLength);

   clearDigit("PenaltyPlayerHome2",playerNumberDigitsAmount);           
   clearDigit("PenaltyPlayerGuest2",playerNumberDigitsAmount);

   clearTimeDigit("PenaltyTimeHome2",penaltyMinutesLength);
   clearTimeDigit("PenaltyTimeGuest2",penaltyMinutesLength);

}

function scoreGoalHome(){
   scoreHome++;
   shotsOnGoalHome++; 
   setDigitValue(scoreHome,scoreDigitsAmount,"ScoreHome");
   setDigitValue(shotsOnGoalHome,shotsDigitsAmount,"ShotsOnGoalHome");
}

function scoreGoalGuest(){
   scoreGuest++;
   shotsOnGoalGuest++; 
   setDigitValue(scoreGuest,scoreDigitsAmount,"ScoreGuests");
   setDigitValue(shotsOnGoalGuest,shotsDigitsAmount,"ShotsOnGoalGuest");
}

function shotHome(){
   shotsOnGoalHome++;            
   setDigitValue(shotsOnGoalHome,shotsDigitsAmount,"ShotsOnGoalHome");
}

function shotGuest(){
   shotsOnGoalGuest++; 
   setDigitValue(shotsOnGoalGuest,shotsDigitsAmount,"ShotsOnGoalGuest");
}


function updatePenalties(){
    var currentTime = new Date();
    var timeDiff = currentTime - startTime;
    timeDiff /= milisecondsInSecond;             
    var elapsedSeconds = timeDiff;
    clearPenalties();
    for (var i = 0; i < homePenalties.length; i++) {
        var penalty = homePenalties[i];
        var penaltyStart = penalty["startTime"];
        var timeDiff = currentTime - penaltyStart;
        timeDiff = timeDiff / milisecondsInSecond;
        var penaltyLeftSeconds =  penaltySecondsPeriod - timeDiff;
        if (penaltyLeftSeconds<0){
           removeItemFromArray(homePenalties,penalty);
           continue;
        }
        var digitId = "PenaltyTimeHome"+(i+1).toString();
        var minutesValue = Math.floor(penaltyLeftSeconds/secondsInMinute);
        var secondsValue = Math.floor(penaltyLeftSeconds%secondsInMinute);
        setDigitTime(minutesValue,penaltyMinutesLength,secondsValue,digitId);
        var playerDigitId = "PenaltyPlayerHome"+(i+1).toString();
        var playerNumber = penalty["playerNumber"]; 
        setDigitValue(playerNumber, playerNumberDigitsAmount, playerDigitId);
    }            
    for (var i = 0; i < guestPenalties.length; i++) {
        var penalty = guestPenalties[i];
        var penaltyStart = penalty["startTime"];
        var timeDiff = currentTime - penaltyStart;
        timeDiff = timeDiff / milisecondsInSecond;
        var penaltyLeftSeconds =  penaltySecondsPeriod - timeDiff;
        if (penaltyLeftSeconds<0){
           removeItemFromArray(guestPenalties,penalty);
           continue;
        }
        var digitId = "PenaltyTimeGuest"+(i+1).toString();
        var minutesValue = Math.floor(penaltyLeftSeconds/secondsInMinute);
        var secondsValue = Math.floor(penaltyLeftSeconds%secondsInMinute);
        setDigitTime(minutesValue,penaltyMinutesLength,secondsValue,digitId);
        var playerDigitId = "PenaltyPlayerGuest"+(i+1).toString();
        var playerNumber = penalty["playerNumber"]; 
        setDigitValue(playerNumber, playerNumberDigitsAmount, playerDigitId);
    }
}

function clearDigit(digitName,digitCount){
    var digit = widget.getByName(digitName);
    digit.setText(alignRightWithSymbol("",digitCount,"0"));
    digit.setNeedRepaint(true);
    digit.refreshElement();
}
function clearTimeDigit(digitName,minutesLength){
    var digit = widget.getByName(digitName);
    var minutesStuff = alignRightWithSymbol("",minutesLength,"0");
    var delimeter = ":";
    var secondsStuff = alignRightWithSymbol("",2,"0");
    digit.setText(minutesStuff+delimeter+secondsStuff);
    digit.setNeedRepaint(true);
    digit.refreshElement();
}

function setDigitValue(val,digitsCount,digitName){
    val = alignRight(val.toString(),digitsCount);
    var digit = widget.getByName(digitName);
    digit.setText(val);
    digit.setNeedRepaint(true);
    digit.refreshElement();
}

function setDigitTime(minutes,minutesLength,seconds,digitName){
    var minutesDigitsAmount = minutesLength;            
    var secondsDigitsAmount = 2;
    var minutesString = alignRight(minutes.toString(),minutesDigitsAmount);
    var secondsString = alignRightWithZeros(seconds.toString(),secondsDigitsAmount);
    var digit = widget.getByName(digitName);
    digit.setText(minutesString+":"+secondsString);
    digit.setNeedRepaint(true);
    digit.refreshElement();
}

function alignRightWithSymbol(str, len, symbol){
    return pad(str,len, symbol,STR_PAD_LEFT);
}

function alignRightWithZeros(str, len){
    return alignRightWithSymbol(str,len, "0");
}

function alignRight(str, len){
    return pad(str,len, " ",STR_PAD_LEFT);
}


var STR_PAD_LEFT = 1;
var STR_PAD_RIGHT = 2;
var STR_PAD_BOTH = 3;


function pad(string, len, padSymbol, padDirection) {
    if (typeof(len) == "undefined") { var len = 0; }
    if (typeof(padSymbol) == "undefined") { var padSymbol = ' '; }
    if (typeof(padDirection) == "undefined") { var dir = STR_PAD_RIGHT; }

    if (len + 1 >= string.length) {

        switch (padDirection){

        case STR_PAD_LEFT:
          string = Array(len + 1 - string.length).join(padSymbol) + string;
        break;

        case STR_PAD_BOTH:
          var right = Math.ceil((padlen = len - string.length) / 2);
          var left = padlen - right;
          string = Array(left+1).join(padSymbol) + string + Array(right+1).join(padSymbol);
        break;

        default:
          string = string + Array(len + 1 - string.length).join(padSymbol);
        break;

        } // switch

    }

    return string;
}

function changeSeason() {
  var seasonElements = document.getElementsByClassName('season');
  for (var i = 0; i < seasonElements.length; i++){
    if(seasonElements[i].classList.contains('blue')) {
      seasonElements[i].classList.remove('blue');
      seasonElements[i].classList.add('green');
    }
    else {
      seasonElements[i].classList.remove('green');
      seasonElements[i].classList.add('blue'); 
    }
  }
}
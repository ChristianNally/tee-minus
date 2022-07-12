const express = require('express');
const say = require(`say`); // automatically pick platform

const app = express();
app.set('view engine','ejs');

// https://spaceflight101.com/falcon-9-ft-countdown-timeline/
const script = [
//  {time: 60, statement:	'Flight Computer to start up.'},
//  {time: 50, statement:	'Stage 1, Stage 2 Pressurization for Flight.'},
//  {time: 45, statement:	'Launch Director: Go for Launch.'},
  {time: 30, statement:	'HOLD Call for Abort.'},
  {time: 20, statement:	'All Tanks at Flight Pressure.'},
  {time: 15, statement:	'Vehicle Configured for Flight.'},
  {time: 10, statement:	'Latest VC Abort.'},
  {time: 07, statement:	'Pad Deck Water Deluge System Activation.'},
  {time: 03, statement:	'Merlin Engine Ignishun.'},
//  {time: 00, statement:	'Strongback Kickback at Liftoff'},
  {time: 00, statement:	'LIFTOFF!'},
];

app.get('/',(req,res) => {
  // res.send('home');
  const totalDuration = script[0].time;
  script.forEach(element => {
    const secondsToGo = totalDuration - element.time;
    setTimeout(()=>{
      say.speak(
        `Tee Minus ${element.time} seconds: ${element.statement}`,
        'Samantha',
        1.0,
        (err) => {
          if (err) {
            return console.error(err);
          }
          console.log(element.statement);
        }
      );
    },(secondsToGo)*1000);    
  });
  res.render('home',{script});
});

const PORT = 7777;
app.listen(PORT,() => {
  console.log(`tee-minus is listening on port=${PORT}`);
});

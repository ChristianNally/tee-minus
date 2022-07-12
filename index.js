const express = require('express');
const say = require(`say`); // automatically pick platform

const app = express();
app.set('view engine','ejs');

// https://spaceflight101.com/falcon-9-ft-countdown-timeline/

const scripts = [
  [ // Falcon-9 Launch Milestones
  {time: 60, statement:	'Flight Computer to start up.'},
  {time: 50, statement:	'Stage 1, Stage 2 Pressurization for Flight.'},
  {time: 45, statement:	'Launch Director: Go for Launch.'},
  {time: 30, statement:	'HOLD Call for Abort.'},
  {time: 20, statement:	'All Tanks at Flight Pressure.'},
  {time: 15, statement:	'Vehicle Configured for Flight.'},
  {time: 10, statement:	'Latest VC Abort.'},
  {time: 07, statement:	'Pad Deck Water Deluge System Activation.'},
  {time: 03, statement:	'Merlin Engine Ignishun.'},
//  {time: 00, statement:	'Strongback Kickback at Liftoff'},
  {time: 0, statement:	'LIFTOFF!'},
],
[ // Countdown to LHL Lecture
  {time: 100, statement: 'Verify Scheduled Lecture'},
  {time: 90, statement: 'Publish Lecture Preamble'},
  {time: 80, statement: 'Prepare Code'},
  {time: 70, statement: 'Open Code in Multiple VS Code Windows'},
  {time: 60, statement: 'Create and Join Zoom Meeting'},
  {time: 50, statement: 'Share Desktop'},
  {time: 40, statement: 'Enable Automatic Transcripts'},
  {time: 30, statement: 'Turn Focus Mode On'},
  {time: 20, statement: 'Open and Arrange Zoom Windows'},
  {time: 10, statement: 'Share Zoom Link with Cohort on Discord lecture links channel for the appropriate cohort'},
  {time: 0, statement:	'Action!'},
]
];

//
// Middleware
//
app.use(express.urlencoded({extended: false}));

//
// ROUTES
//

// BROWSE
app.get('/',(req,res) => {
  res.render('home');
});

function getEarliestTime(script){
  let max = 0;
  for (let ii = 0; ii < script.length; ii++) {
    if (script[ii].time > max) {
      max = script[ii].time;
    }
  }
  return max;
}

// LAUNCH
app.post('/launch/start', (req,res) => {
  const launchId = req.body.launchid;
  console.log('JSON.stringify(scripts)',JSON.stringify(scripts[launchId]));
  const totalDuration = getEarliestTime(scripts[launchId]);
  scripts[launchId].forEach(element => {
    const secondsToGo = totalDuration - element.time;
    setTimeout(()=>{
      let text = '';
      text = `Tee Minus ${element.time} seconds: ${element.statement}`;
      say.speak(
        text,
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
  for (let countDown = 5; countDown > 0; countDown--) {
    setTimeout(()=>{
      let text = '';
      text = `${countDown}`;
      say.speak(
        text,
        'Alex',
        1.0,
        (err) => {
          if (err) {
            return console.error(err);
          }
          console.log('countDown', countDown);
        }
      );
    },(totalDuration - countDown)*1000);
  }
  const templateVars = {
    script: scripts[launchId],
  };
  res.render('launch',templateVars);
});

// ADD
app.get('/milestone/new', (req,res) => {
  res.render('add');
});

app.post('/milestone/new', (req,res) => {
  console.log('req.body',req.body);
  scripts.push({time: req.body.time, statement: req.body.statement});
  res.redirect('/');
});

// EDIT
app.get('/milestone/edit/:index', (req,res) => {
  console.log('req.params',req.params);
  const index = parseInt(req.params.index);
  console.log('scripts',scripts);
  console.log('index',index);
  console.log('scripts[index]',scripts[index]);
  const templateVars = {
    index: index,
    time: scripts[index].time,
    statement: scripts[index].statement
  };
  res.render('edit', templateVars);
});

app.post('/milestone/edit/:index', (req,res) => {
  console.log('req.body',req.body);
  console.log('req.params',req.params);
  const index = parseInt(req.params.index);
//  scripts.push({time: req.body.time, statement: req.body.statement});

  scripts[index].time = req.body.time;
  scripts[index].statement = req.body.statement;

  res.redirect('/');
});

// DELETE
app.get('/milestone/delete/:index', (req,res) => {
  console.log('req.params',req.params);
  const index = parseInt(req.params.index);
  console.log('scripts before the delete',scripts);
  console.log('index',index);
  console.log('scripts[index]',scripts[index]);

//  delete scripts[index];
//  let item = array.indexOf(scripts[index]);
  let deleteCount = 1;
  scripts.splice(index, deleteCount)

  console.log('scripts AFTER the delete',scripts);

  res.redirect('/');
});


const PORT = 7777;
app.listen(PORT,() => {
  console.log(`tee-minus is listening on port=${PORT}`);
});

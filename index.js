const express = require('express');
const say = require(`say`); // automatically pick platform

const app = express();
app.set('view engine','ejs');

// https://spaceflight101.com/falcon-9-ft-countdown-timeline/

const script = [
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
  {time: 00, statement:	'LIFTOFF!'},
];

// Countdown to LHL Lecture
// const script = [
// {time: 100, statement: 'Verify Scheduled Lecture'},
// {time: 90, statement: 'Publish Lecture Preamble'},
// {time: 80, statement: 'Prepare Code'},
// {time: 70, statement: 'Open Code in Multiple VS Code Windows'},
// {time: 60, statement: 'Create and Join Zoom Meeting'},
// {time: 50, statement: 'Share Desktop'},
// {time: 40, statement: 'Enable Automatic Transcript'},
// {time: 30, statement: 'Turn Focus Mode On'},
// {time: 20, statement: 'Open and Arrange Zoom Windows'},
// {time: 10, statement: 'Share Zoom Link with Cohort on Discord lecture links channel for the appropriate cohort'},
// ];

//
// Middleware
//
app.use(express.urlencoded({extended: false}));

//
// ROUTES
//

// BROWSE
app.get('/',(req,res) => {
  // res.send('home');
  console.log('JSON.stringify(script)',JSON.stringify(script));
  const totalDuration = 60;
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
  const templateVars = {
    script: script,
  };
  res.render('home',templateVars);
});

// ADD
app.get('/milestone/new', (req,res) => {
  res.render('add');
});

app.post('/milestone/new', (req,res) => {
  console.log('req.body',req.body);
  script.push({time: req.body.time, statement: req.body.statement});
  res.redirect('/');
});

// EDIT
app.get('/milestone/edit/:index', (req,res) => {
  console.log('req.params',req.params);
  const index = parseInt(req.params.index);
  console.log('script',script);
  console.log('index',index);
  console.log('script[index]',script[index]);
  const templateVars = {
    index: index,
    time: script[index].time,
    statement: script[index].statement
  };
  res.render('edit', templateVars);
});

app.post('/milestone/edit/:index', (req,res) => {
  console.log('req.body',req.body);
  console.log('req.params',req.params);
  const index = parseInt(req.params.index);
//  script.push({time: req.body.time, statement: req.body.statement});

  script[index].time = req.body.time;
  script[index].statement = req.body.statement;

  res.redirect('/');
});

// DELETE
app.get('/milestone/delete/:index', (req,res) => {
  console.log('req.params',req.params);
  const index = parseInt(req.params.index);
  console.log('script before the delete',script);
  console.log('index',index);
  console.log('script[index]',script[index]);

//  delete script[index];
//  let item = array.indexOf(script[index]);
  let deleteCount = 1;
  script.splice(index, deleteCount)

  console.log('script AFTER the delete',script);

  res.redirect('/');
});


const PORT = 7777;
app.listen(PORT,() => {
  console.log(`tee-minus is listening on port=${PORT}`);
});

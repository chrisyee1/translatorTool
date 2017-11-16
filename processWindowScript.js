const electron = require('electron');
const{ipcRenderer} = electron;
const ps = require('ps-node');
const processes = document.querySelector('.collection');

ps.lookup({
  command: '',
  },
  function(err, resultList ) {
  if (err) {
    throw new Error( err );   
  }

  resultList.forEach(function( process ){
    if( process ){
        console.log( 'PID: %s, COMMAND: %s, ARGUMENTS: %s', process.pid, process.command, process.arguments );     
        let processName = document.createTextNode(process.command + " (" + process.pid + ")");
        let proc = document.createElement('a');

        proc.className += "collection-item";
        proc.appendChild(processName);
        processes.appendChild(proc);
    }
  });
});

function submitForm(e){
  e.preventDefault();
  const item = document.querySelector('#item').value;
  ipcRenderer.send('item:add', item);
}
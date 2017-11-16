const electron = require('electron');
const ps = require('ps-node');
const {ipcRenderer} = electron;
const ul = document.getElementById('list');
var count = 0;
        
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
    }
  });
});

// Add Item
ipcRenderer.on('item:add', function(e, item, item2){
  let li = document.createElement('li');
  const br = document.createElement("br");
  const itemText = document.createTextNode(item);
  const itemText2 = document.createTextNode(item2);
  ul.className = 'collection';
  li.className = 'collection-item'

  li.appendChild(itemText);
  li.appendChild(br);
  li.appendChild(itemText2);
  ul.insertAdjacentElement('afterbegin', li);
  if(ul.childElementCount > 30){
    ul.removeChild(ul.lastChild);
  }
});

// Clear items
ipcRenderer.on('item:clear', function(){
  ul.innerHTML = '';
  ul.className = '';
});

//Remove item
ul.addEventListener('dblclick', removeItem);

function removeItem(e){
  e.target.remove();
  if(ul.children.length == 0){
    ul.className = '';
  }
}

function openProcessWindow(){
  console.log("sent");
  ipcRenderer.send('process:open');
}

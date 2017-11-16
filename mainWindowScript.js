const electron = require('electron');
const {ipcRenderer} = electron;
const ul = document.getElementById('list');
var count = 0;

// Add Item
ipcRenderer.on('item:add', function(e, item, item2){
  const li = document.createElement('li');
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

const electron = require('electron');
const {ipcRenderer} = electron;
const ul = document.getElementById('list');
var count = 0;

// Add Item
ipcRenderer.on('item:add', function(e, item){
  const li = document.createElement('li');
  const itemText = document.createTextNode(item);
  ul.className = 'collection';
  li.className = 'collection-item'

  li.appendChild(itemText);
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

function addEtcItem(e){
  const li = document.createElement('li');
  const itemText = document.createTextNode("Test" + count);
  ul.className = 'collection';
  li.className = 'collection-item'

  li.appendChild(itemText);
  ul.insertAdjacentElement('afterbegin', li);
  count = count + 1;
  if(ul.childElementCount > 30){
    ul.removeChild(ul.lastChild);
  }
}

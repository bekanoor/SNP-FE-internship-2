"use strict";

//? DOM ELEMENTS
const todos = document.querySelector('.todos');
const arrow = document.querySelector('.todo__arrow');
const navigation = document.querySelector('.navigation');
const todoList  = document.querySelector('.todo__list');
const itemsLeft = document.querySelector('.navigation__item-left');
const completeStatus = document.querySelector('.completes');
const activeStatus = document.querySelector('.actives');

//? FUNCTIONS
function createElement(item, completed, toLocal) {
    // add li
    const liItem = document.createElement('li');
    liItem.classList.add('todo__item'); 
    todoList.append(liItem);

    // add text container
    const itemText = document.createElement('label');

    // itemText.setAttribute('contenteditable', true);
    itemText.classList.add('todo__itemText');
    itemText.textContent = item;
    liItem.append(itemText);
    
    // add buttons 
    const completeButton = document.createElement('button');
    completeButton.classList.add('complete');
    completeButton.innerHTML = '<i class="far fa-check-square fa-lg" style="color:green"></i>';
    liItem.append(completeButton);
    
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete');
    deleteButton.innerHTML = '<i class="far fa-times-circle fa-lg" style="color:red"></i>';
    liItem.append(deleteButton);

    // will be called only to save value in local storage 
    if(toLocal) saveToLocalStorage(toLocal);
    
    // if the task is completed marks the text 
    if(completed) itemText.classList.add('todo__cross-out');

    // change inner text 
    itemText.addEventListener('dblclick', ()=> {
        itemText.setAttribute('contenteditable', true);
        itemText.classList.add('todo__active');
    });

    itemText.addEventListener('blur', (e)=> {
        const todos = getValueFromLS();
        let nodeId = parseInt(e.target.parentNode.id);
        
        for (let elem of todos) {
            if(elem.id === nodeId) {
                elem.text = itemText.textContent;
            };
        }

        updateLS(todos);
        itemText.classList.remove('todo__active');
        itemText.removeAttribute('contenteditable');
    });

    itemText.addEventListener('keydown', (e) => {
        if (e.keyCode === 13) {
            const todos = getValueFromLS();
            let nodeId = parseInt(e.target.parentNode.id);
            
            for (let elem of todos) {
                if(elem.id === nodeId) {
                    elem.text = itemText.textContent;
                };
            }

            updateLS(todos);
            itemText.classList.remove('todo__active');
            itemText.removeAttribute('contenteditable');
        }
    })

    // delete element
    deleteButton.addEventListener('click', ()=> {
        deleteTodoItemFromLocalStorage(liItem.id);
        liItem.remove();
        showItemsLeft();
        // hide navigation and reset active button 
        if(todoList.childNodes.length === 0) {
            const active = document.querySelector('.active');
            active.classList.remove();

            toggleFooterVisibility('','');
        }
    });

    //make cross out/regular text
    completeButton.addEventListener('click', ()=> {
        changeCompletePropertyInLS(liItem.id);
       
        if(itemText.classList.contains('todo__cross-out')) {
            itemText.classList.remove('todo__cross-out');
            showItemsLeft();
        } else {
            itemText.classList.add('todo__cross-out');
            showItemsLeft();
        }
        
        let buttons = document.querySelectorAll(".navigation__btn");

        for (let btn of buttons) {
            // search active button
            if(btn.classList.contains('active')) {
                // if "active" or "complete" button enable add additional functionality
                //hide element after click if enable "active"
                if(btn.value === 'active') {
                    liItem.style.display = 'none';
                }
                //hide element after click if enable "complete" 
                if(btn.value === 'completes') {
                    liItem.style.display = 'none';
                }
            }
        }
    })
}

function showTodoItem (e) {
    if(e.type === 'keypress') {
        // Make sure enter is pressed and string is not empty 
        if (e.which === 13 || e.keyCode === 13) {
            if (removeGaps(todos.value).length === 0) return;

            if(todoList.childNodes.length >= 0) toggleFooterVisibility('flex', 'inline');

            // hide task if completed button is active 
            if(completeStatus.classList.contains('active')) todoList.lastChild.style.display = 'none';

            createElement(todos.value, '', todos.value);
            showItemsLeft();
            todos.value = '';
        }
    }
}

// delete gaps in a string 
function removeGaps(str) {
    let newStr = str.replace(/\s/g, '');
    return newStr;
}

// show how many items are left
function showItemsLeft() {
    const show = getValueFromLS().filter(elem => elem.completed === false)
    
    itemsLeft.textContent = `${show.length} items left`;
}

// show/hide navigation 
function toggleFooterVisibility(flex, inline) {
    navigation.style.display = flex;
    arrow.style.display = inline;
}

function getBlur () {
    if(todos.value.length === 0 ) return 
   
    createElement(todos.value, '', todos.value);
    toggleFooterVisibility('flex', 'inline');

    todos.value = '';
}

// turn off/on cross out all text 
function toggleArrow() {
    const countToDo = document.querySelectorAll('.todo__itemText');
    const arrowActive = getValueFromLS('arrowStatus');
    const todoArr = getValueFromLS();

    if(arrowActive) {
        // for each text item make regular text
        for (let elem of countToDo) {
            if(elem.classList.contains('todo__cross-out')) elem.classList.remove('todo__cross-out');

            // show/hide items when active complete/active navigation buttons  
            if(activeStatus.classList.contains('active')) elem.parentNode.style.display = 'flex';

            if(completeStatus.classList.contains('active')) elem.parentNode.style.display = 'none';

            todoArr.forEach(e=> e.completed = false);

            updateLS(todoArr);
            showItemsLeft();
        }

        updateLS(false, 'arrowStatus');
    } else {
        // for each text item make cross out text
        for (let elem of countToDo) {
            // show/hide items when active complete/active navigation buttons  
            if(activeStatus.classList.contains('active')) elem.parentNode.style.display = 'none';

            if(completeStatus.classList.contains('active')) elem.parentNode.style.display = 'flex';
            
            if(!elem.classList.contains('todo__cross-out')) elem.classList.add('todo__cross-out');

            todoArr.forEach(e=> e.completed = true);

            updateLS(todoArr);
            showItemsLeft();
        }

        updateLS(true, 'arrowStatus');
    }
}

// manage navigation 
function manageFooterComponents(e) {
    // create for each todo list item a function to control display property 
    todoList.childNodes.forEach(element => {
        switch (e.target.value) {
            // show all elements
            case 'all':
                element.style.display = 'flex';
                break;
            // show only active 
            case 'active':
                element.firstChild.classList.contains('todo__cross-out') ? 
                element.style.display = 'none' : 
                element.style.display = 'flex';
                break;
            // show only complete 
            case 'completes':
                element.firstChild.classList.contains('todo__cross-out') ? 
                element.style.display = 'flex' : 
                element.style.display = 'none';
                break;
            // clear all cross out element
            case 'clear': 
                const clear = document.querySelectorAll('.todo__cross-out');
                for (let elem of clear) {
                    deleteTodoItemFromLocalStorage(elem.parentNode.id);
                    elem.parentNode.remove();
                }
                
                // turn off arrow 
                updateLS(false, 'arrowStatus');

                // hide navigation 
                if(todoList.childNodes.length === 0) toggleFooterVisibility('','');
                
                break;
            default:
                break;
        }
    })
}

// set green background for navigation buttons 
function toggleFooterButton() {
    const buttons = document.querySelectorAll(".navigation__btn");

    for (let btn of buttons) {
        btn.addEventListener('click', (e) => {
            // et = event target
            const et = e.target;

            // slect active class
            const active = document.querySelector('.active');

            // check for the button that has active class and remove it
            if (active) active.classList.remove('active');
            
            // add active class to the clicked element 
            et.classList.add('active');
        });
    }
}

// local storage functions 
function updateLS(value, key="todoArray"){
    return localStorage.setItem(key, JSON.stringify(value));
}

function getValueFromLS(key='todoArray') {
    return JSON.parse(localStorage.getItem(key));
}

function saveToLocalStorage(item) {
    let todoArray = getValueFromLS();

    const obj = {
        id: Date.now(),
        text: item, 
        completed: false
    };

    // add item to LS
    todoArray.push(obj); 
    updateLS(todoArray);

    // add ID to li items
    for (let i = 0; i < todoList.childNodes.length; i++) {
        todoList.childNodes[i].setAttribute("id", todoArray[i].id);
    }
    
}

function getTodoListFromLocalStorage() {
    let todoArray = getValueFromLS();

    // add items to the screen 
    todoArray.forEach(item => {
       createElement(item.text, item.completed);
       toggleFooterVisibility('flex', 'inline');
    })

    // add ID to li from LS
    for (let i = 0; i < todoList.childNodes.length; i++) {
        todoList.childNodes[i].setAttribute("id", todoArray[i].id);
    }
}

function deleteTodoItemFromLocalStorage(item) {
    let deleteFromLS = getValueFromLS();
    let whatRemove = parseInt(item);

    for (let elem of deleteFromLS) {
        if (elem.id === whatRemove) {
            deleteFromLS.splice(elem, 1);
            updateLS(deleteFromLS);
        }
    }
}

function changeCompletePropertyInLS(id) {
    const completed = getValueFromLS();

    completed.forEach(item => {
        if(item.id === parseInt(id)) {
            item.completed = !item.completed;
        }
    });

    updateLS(completed);
};
//? EVENTS   
document.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem('todoArray') === null) localStorage.setItem('todoArray', JSON.stringify([]));
     
    showItemsLeft();
});
document.addEventListener('DOMContentLoaded', getTodoListFromLocalStorage);
arrow.addEventListener('click', toggleArrow);
todos.addEventListener('keypress', showTodoItem);
todos.addEventListener('blur', getBlur);
navigation.addEventListener('click', manageFooterComponents);
navigation.addEventListener('click', toggleFooterButton);
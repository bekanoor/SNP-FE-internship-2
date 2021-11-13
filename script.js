"use strict";

//? DOM ELEMENTS AND VARIABLES 
const todos = document.querySelector('.todos');
const arrow = document.querySelector('.todo__arrow');
const footer = document.querySelector('.footer');
const todoList  = document.querySelector('.todo__list');
const itemsLeft = document.querySelector('.footer__item-left');
const footerItems = document.querySelector('.footer__list');
// grab all the buttons

let todosText = '';

//? FUNCTIONS
function createElement(item, status, toLocal) {
    // create  elements 
    // add li
    const liItem = document.createElement('li');
    liItem.classList.add('todo__item'); 
    todoList.append(liItem);

    // add text container
    const itemText = document.createElement('div');
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
    
    // if status on local storage is true then mark text  
    if(status) itemText.classList.add('todo__cross-out');

    // delete element
    deleteButton.addEventListener('click', ()=> {
        
        itemText.classList.contains('todo__cross-out') ? '' : showItemsLeft('');
        deleteFromLocalStorage(item);
        liItem.remove();
        
        // if todo list is empty then delete footer
        if(todoList.childNodes.length === 0) {
            toggleFooterVisibility('','');
        }
    });

    //make cross out /regular text
    completeButton.addEventListener('click', ()=> {
        changeStatus(itemText.textContent);

        if(itemText.classList.contains('todo__cross-out')) {
            itemText.classList.remove('todo__cross-out');

            showItemsLeft('plus');
        } else {
            itemText.classList.add('todo__cross-out');

            showItemsLeft('');
        }
    })
}

function displayContent (e) {
    if(e.type === 'keypress') {
        // Make sure enter is pressed and string is not empty 
        if (e.which == 13 || e.keyCode == 13) {
            if (todosText.length === 0) return
            
            if(todoList.childNodes.length >= 0) {
                toggleFooterVisibility('flex', 'inline');
            }

            showItemsLeft('plus');
            createElement(todosText, '', todosText);
            
            todos.value = '';
            todosText = '';
        }
    }
}

// show how many items are left
function showItemsLeft(operation) {
    // get value from local storage and increase it 
    let counterListItems = JSON.parse(localStorage.getItem('count'));
    operation === 'plus' ? counterListItems++ : counterListItems--;
    localStorage.setItem('count', counterListItems)
    itemsLeft.textContent = `${JSON.parse(localStorage.getItem('count'))} items left`;
}

// show footer 
function toggleFooterVisibility(flex, inline) {
    footer.style.display = flex;
    arrow.style.display = inline;
}

function getBlur () {
    if(todosText.length === 0 ) return 
   
    createElement(todosText, '', todosText);
    toggleFooterVisibility('flex', 'inline');
    showItemsLeft('plus');

    todos.value = '';
    todosText = '';

}

// turn off/on cross out text 
function toggleArrow() {
    let countToDo = document.querySelectorAll('.todo__itemText');
    let arrowActive = JSON.parse(localStorage.getItem('status'));

    // check active or not
    if(arrowActive) {
        
        // for each text item make regular text
        for(let elem of countToDo) {
            showItemsLeft('plus')
            elem.classList.remove('todo__cross-out');
            changeStatus(elem.textContent);
        }

        localStorage.setItem('status', JSON.stringify(false));
    } else {
        // for each text item make cross out text
        for(let elem of countToDo) {
            if(elem.classList.contains('todo__cross-out')) {
                showItemsLeft('plus');
            } 
            elem.classList.add('todo__cross-out');
            changeStatus(elem.textContent);
            showItemsLeft('');
        }

        localStorage.setItem('status', JSON.stringify(true))
    }

}

// manage footer 
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
                    deleteFromLocalStorage(elem.textContent);
                    elem.parentNode.remove();
                }
                
                // turn off arrow 
                localStorage.setItem('status', false);

                // hide footer 
                if(todoList.childNodes.length === 0) {
                    toggleFooterVisibility('','');
                }
                break;
            default:
                break;
        }
    })

}

function toggleFooterButton() {
    let buttons = document.querySelectorAll(".footer__btn");

    for (let btn of buttons) {
        btn.addEventListener('click', (e) => {
            // et = event target
            const et = e.target;
            // slect active class
            const active = document.querySelector('.active');
            // check for the button that has active class and remove it
            if (active) {
            active.classList.remove('active');
            }
            // add active class to the clicked element 
            et.classList.add('active');
        });
    }
}

// local storage functions 
function saveToLocalStorage(item) {
    let todoArray;
    let obj = {
        text: item, 
        status: false
    }
    if(localStorage.getItem('todoArray') === null) {
        // create array if it's not exist 
        todoArray = [];
    } 
    else {
        todoArray = JSON.parse(localStorage.getItem('todoArray'));
    }
   
    todoArray.push(obj); 
    localStorage.setItem('todoArray', JSON.stringify(todoArray));
}

function getFromLocalStorage(item) {
    let todoArray = JSON.parse(localStorage.getItem('todoArray'));

    if(todoArray.length > 0) {
        itemsLeft.textContent = `${JSON.parse(localStorage.getItem('count'))} items left`;
    } 
    
    todoArray.forEach(item => {
       createElement(item.text, item.status);
       toggleFooterVisibility('flex', 'inline');
    })
}

function deleteFromLocalStorage(item) {
    let deleteFromLS = JSON.parse(localStorage.getItem('todoArray'));
    let whatRemove = item;

    for(let i = 0; i < deleteFromLS.length; i++) {
        if (deleteFromLS[i].text === whatRemove) {
            deleteFromLS.splice(i, 1);
            localStorage.setItem('todoArray', JSON.stringify(deleteFromLS));
        }
    }
}

function changeStatus(text) {
    let status = JSON.parse(localStorage.getItem('todoArray'));

    status.forEach(item => {
        if(item.text === text) {
            item.status = !item.status;
            localStorage.setItem('todoArray', JSON.stringify(status))
        }
    })
}
//? EVENTS   
todos.oninput = function () {
    todosText = todos.value;
}
arrow.addEventListener('click', toggleArrow);
todos.addEventListener('keypress', displayContent);
todos.addEventListener('blur', getBlur);
footerItems.addEventListener('click', manageFooterComponents);
footerItems.addEventListener('click', toggleFooterButton);
document.addEventListener('DOMContentLoaded', getFromLocalStorage);
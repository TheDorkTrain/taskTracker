// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
const taskName = document.querySelector("#taskName");
const taskDesc = document.querySelector("#taskDesc");
const dueDate = document.querySelector("#dueDate");
const modalBody = document.querySelector(".modal-body")

subButt.addEventListener('click', function() {

        createTaskCard(taskName, taskDesc, dueDate);
        taskName.value = "";
        taskDesc.value = "";
        dueDate.value= "";
});


function generateTaskId() {
    const timestamp = new Date().getTime(); 
    const randomNum = Math.floor(Math.random() * 1000);
    
    return `task_${timestamp}_${randomNum}`;
};

function createTaskCard(taskName, taskDesc, dueDate) {
    const taskId = generateTaskId();

    const cardHtml = `
        <div id="${taskId}" class="card ui-widget-content text-dark bg-info mb-3" style="width: 24rem;">
            <div class="card-header">${taskName.value}</div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item">${taskDesc.value}</li>
                <li class="list-group-item">${dueDate.value}</li>
            
            </ul>
            <button id="cardClose" type="button" class="deleto" data-bs-dismiss="card" aria-label="Close">Delete</button>
        </div>
    `;
    saveTasksToLocalStorage(); 
    
    $("#todo-cards").append(cardHtml);
    $(`#${taskId}`).draggable({
        snap: ".ui-widget-header",
        start: function(event, ui) {
            $(this).css('z-index', 1000);
        },
        stop: function(event, ui) {
            $(this).css('z-index', 1);
        }
        });

    $(`#${taskId} .deleto`).on('click', function() {
        $(`#${taskId}`).remove();
        saveTasksToLocalStorage();
    });
}

function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(task => {
        renderTask(task.id, task.name, task.description, task.dueDate);

        if (task.position && task.position.top && task.position.left) {
            $("#" + task.id).css({
                top: task.position.top,
                left: task.position.left
            });
        }
    });
}

$( function() {
    $( "#draggable" ).draggable();
  } );


function renderTask(taskId, taskName, taskDesc, dueDate) {
    const cardHtml = `
        <div id="${taskId}" class="card ui-widget-content  mb-3" style="width: 24rem; z-index: 1;">
            <div class="card-header">${taskName}</div>
            <ul class="list-group list-group-flush ">
                <li class="list-group-item ">${taskDesc}</li>
                <li class="list-group-item ">${dueDate}</li>
            </ul>
            <button class="delete" type="button">Delete</button>
        </div>
    `;

    $("#todo-cards").append(cardHtml);

    $(`#${taskId}`).draggable({
        snap: ".ui-widget-header",
        start: function(event, ui) {
            $(this).css('z-index', 1000);
        },
        stop: function(event, ui) {
            $(this).css('z-index', 1);
            saveTasksToLocalStorage(); 
        }
    });

    $(`#${taskId} .delete`).on('click', function() {
        $(`#${taskId}`).remove();
        saveTasksToLocalStorage(); 
    });
}

function saveTasksToLocalStorage() {
    const tasks = $("#todo-cards").children().map(function() {
        return {
            id: $(this).attr('id'),
            name: $(this).find('.card-header').text(),
            description: $(this).find('.list-group-item').eq(0).text(),
            dueDate: $(this).find('.list-group-item').eq(1).text(),
            position: {
                top: $(this).css('top'),
                left: $(this).css('left')
            }
        };
    }).get();

    localStorage.setItem('tasks', JSON.stringify(tasks));
}
function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(task => {
        renderTask(task.id, task.name, task.description, task.dueDate);
        
        if (task.position) {
            $("#" + task.id).css({
                top: task.position.top,
                left: task.position.left
            });
        }
    });
}

$(document).ready(function() {
    loadTasksFromLocalStorage();
});


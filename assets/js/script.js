const taskName = document.querySelector("#taskName");
const taskDesc = document.querySelector("#taskDesc");
const dueDate = document.querySelector("#dueDate");
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
const modalBody = document.querySelector(".modal-body");


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

const cardHtmlTemplate = (taskId, taskName, taskDesc, dueDate) => `
    <div id="${taskId}" class="card ui-widget-content text-dark mb-3" style="width: 24rem;">
        <div class="card-header">${dueDate}</div>
        <ul class="list-group list-group-flush">
            <li class="list-group-item">${taskName}</li>
            <li class="list-group-item">${taskDesc}</li>
        </ul>
        <button class="delete" type="button">Delete</button>
    </div>
`;

function createTaskCard(taskName, taskDesc, dueDate) {
    const taskId = generateTaskId();
    const cardHtml = cardHtmlTemplate(taskId, taskName.value, taskDesc.value, dueDate.value);

    $("#todo-cards").append(cardHtml);
    $(`#${taskId}`).draggable({
        snap: ".ui-widget-header",
        stack: ".ui-widget-header",
        start: function(event, ui) {
            $(this).css('z-index', 2);
            saveTasksToLocalStorage();},
        stop: function(event, ui) {
            saveTasksToLocalStorage();
        }
    });

    $(`#${taskId} .delete`).on('click', function() {
        $(`#${taskId}`).remove();
        saveTasksToLocalStorage();
    });

    saveTasksToLocalStorage();
}

function renderTask(taskId, taskName, taskDesc, dueDate) {
    const cardHtml = cardHtmlTemplate(taskId, taskName, taskDesc, dueDate);

    $("#todo-cards").append(cardHtml);

    $(`#${taskId}`).draggable({
        snap: ".ui-widget-header",
        stack: ".ui-widget-header",
        start: function(event, ui) {
            $(this).css('z-index', 2);
            saveTasksToLocalStorage();},
        stop: function(event, ui) {
            $(this).css('z-index', 2);
            saveTasksToLocalStorage();
        }
    });

    $(`#${taskId} .delete`).on('click', function() {
        $(`#${taskId}`).remove();
        saveTasksToLocalStorage();
    });
}

function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    tasks.forEach(task => {
        renderTask(task.id, task.name, task.description, task.dueDate);

        let jsDate = dayjs(task.dueDate, 'YYYY-MM-DD');
        
        if (task.position && task.position.top && task.position.left) {
            $("#" + task.id).css({
                top: task.position.top,
                left: task.position.left,
                'z-index': task.zIndex,
            });
        }
        
        if (dayjs().format('YYYY-MM-DD') === jsDate.format('YYYY-MM-DD')) {
            $("#" + task.id).css({backgroundColor: 'var(--warning-card)' });
        }
        else if (dayjs().isAfter(`${jsDate}`)) {
        $("#" + task.id).css({backgroundColor: 'var(--overdue-card' });}
        else{
            $("#" + task.id).css({backgroundColor: 'var(--safe-card)' });
        }
    });
}

$( function() {
    $( "#draggable" ).draggable();
  } );


function saveTasksToLocalStorage() {
    const tasks = $("#todo-cards").children().map(function() {
        return {
            id: $(this).attr('id'),
            dueDate: $(this).find('.card-header').text(),
            name: $(this).find('.list-group-item').eq(0).text(),
            description: $(this).find('.list-group-item').eq(1).text(),
            position: {
                top: $(this).css('top'),
                left: $(this).css('left')
            },
            zIndex: $(this).css('z-index'),
        };
    }).get();

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

$(document).ready(function() {
    loadTasksFromLocalStorage();
});


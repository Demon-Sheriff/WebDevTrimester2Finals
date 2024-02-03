const addBtn = document.querySelector('.add-btn');
const removeBtn = document.querySelector('.remove-btn');
const modal = document.querySelector('.modal-cont');
const textArea = document.querySelector('.textarea-cont');
const mainCont = document.querySelector('.main-cont');
const allPriorityColor = document.querySelectorAll('.priority-color');
let addModal = true;
let taskColor = 'red';
let removeBtnActive = false;
let colorArr = ['red','blue','green','pink'];
let ticketArr = [];



if(localStorage.getItem('tasks')){


    let stringifiedArr = localStorage.getItem('tasks');



    ticketArr = JSON.parse(stringifiedArr);
    console.log(ticketArr);
    for(let i=0;i<ticketArr.length;i++){
        generateTicket(ticketArr[i].task,ticketArr[i].color,ticketArr[i].id);
    }
}

let allFilterColor = document.querySelectorAll('.color');
for(let i=0;i<allFilterColor.length;i++){
    allFilterColor[i].addEventListener('click',function(){


        let currentSelectedFilter = allFilterColor[i].classList[1];
        console.log(currentSelectedFilter);
        let allTicketsColor = document.querySelectorAll('.ticket-color');





        for(let j=0;j<allTicketsColor.length;j++){
            let colorOfTicket = allTicketsColor[j].classList[1];
            console.log(colorOfTicket);
            if(colorOfTicket == currentSelectedFilter){
                

                allTicketsColor[j].parentElement.style.display = 'block';
            }else{
                

                allTicketsColor[j].parentElement.style.display = 'none';
            }
        }
    })

    allFilterColor[i].addEventListener('dblclick',function(){
        let allTicketsColor = document.querySelectorAll('.ticket-color');
        for(let j=0;j<allTicketsColor.length;j++){
            allTicketsColor[j].parentElement.style.display = 'block';
        }
    })
}

addBtn.addEventListener('mouseover', () =>{
    
});

addBtn.addEventListener('mouseout', ()=> {

});
var uid = new ShortUniqueId();

// hover effect for the create button

addBtn.addEventListener('click',function(){

    if(addModal){
        modal.style.display = 'flex' //show the modal
    }else{
        modal.style.display = 'none' //hide the modal
    }
    addModal = !addModal;
})

//Toggle delete icon color
removeBtn.addEventListener('click',function(){
    if(removeBtnActive){
        removeBtn.style.color = 'black';
        removeBtnActive = false;
    }else{
        removeBtn.style.color = 'red';
        removeBtnActive = true;
    }  
})

textArea.addEventListener('keydown',function(event){

    
    let key = event.key;
    if(key === "Enter"){

        if(textArea.value == ""){
            textArea.value = "";
            alert("Please Enter some task!");
            return;
        }
        generateTicket(textArea.value,taskColor); // generating ticket from UI 
        textArea.value = "";
        modal.style.display = 'none'
        addModal = true
    }
})

//Set priority of a task. which here is denoted by colors.
for(let i=0;i<allPriorityColor.length;i++){
    allPriorityColor[i].addEventListener("click",function(){

        for(let j=0;j<allPriorityColor.length;j++){
            allPriorityColor[j].classList.remove('active');
        }
        allPriorityColor[i].classList.add('active')
        taskColor = allPriorityColor[i].classList[1];
        console.log(taskColor)
    })
}

function generateTicket(task,priority,ticketId){

    let id;
    if(ticketId){ // Call from localStorage data and if id is available don't generate.
        id = ticketId // use the passed ticket.
    }else{ // call from UI, there is need of generating radom id.
        id = uid.rnd(); // generate new id.
    }
     
    let ticketCont = document.createElement("div");
    ticketCont.className = "ticket-cont";
    ticketCont.innerHTML = `<div class="ticket-color ${priority}"></div>
                            <div class="ticket-id">#${id}</div>
                            <div class="ticket-area">${task}</div>
                            <div class="lock-unlock"><i class="fa-solid fa-lock"></i></div>`
    console.log(ticketCont)
    mainCont.appendChild(ticketCont);
    if(!ticketId){
        ticketArr.push({id:id,task:task,color:taskColor});
        let stringifiedArr = JSON.stringify(ticketArr);
        localStorage.setItem('tasks',stringifiedArr);
        console.log(ticketArr);
    }
    

    //handle priority color
    let ticketColor = ticketCont.querySelector('.ticket-color');
    ticketColor.addEventListener('click',function(){
 


        let currentColor = ticketColor.classList[1];


        ticketColor.classList.remove(currentColor);
        let currentColorIndex;
        for(let i=0;i<colorArr.length;i++){
            if(colorArr[i] == currentColor){
                currentColorIndex = i;
                break;
            }
        }
        let nextColorIndex = (currentColorIndex+1)%colorArr.length;
        let nextColor = colorArr[nextColorIndex];
        // console.log(nextColor);
        ticketColor.classList.add(nextColor)
        let idx;
        for(let i=0;i<ticketArr.length;i++){
            if(id == ticketArr[i].id){
                idx = i;
            }
        }
        console.log(idx);
        ticketArr[idx].color = nextColor;
        console.log(ticketArr);
        updateLocalStorage();
    })

    //handle lock and unlock
    let taskArea = ticketCont.querySelector('.ticket-area');
    let lockUnlockBtn = ticketCont.querySelector('.lock-unlock i');
    lockUnlockBtn.addEventListener('click',function(){
        if(lockUnlockBtn.classList.contains('fa-lock')){
            lockUnlockBtn.classList.remove('fa-lock');
            lockUnlockBtn.classList.add('fa-lock-open')
            taskArea.setAttribute('contentEditable','true')
        }else{
            lockUnlockBtn.classList.remove('fa-lock-open');
            lockUnlockBtn.classList.add('fa-lock')
            taskArea.setAttribute('contentEditable','false')
        }
        let updatedTask = taskArea.innerText;
        let idx;
        for(let i=0;i<ticketArr.length;i++){
            if(id == ticketArr[i].id){
                idx = i;
            }
        }
        ticketArr[idx].task = updatedTask;
        updateLocalStorage();
    })

    //handle delete of ticket
    ticketCont.addEventListener('click',function(){
        if(removeBtnActive){
            ticketCont.remove();
            let idx;
            for(let i=0;i<ticketArr.length;i++){
                if(id == ticketArr[i].id){
                    idx = i;
                }
            }
            ticketArr.splice(idx,1);
            console.log(ticketArr);
            updateLocalStorage();
        }
    })
}

function updateLocalStorage(){
    let stringifiedArr = JSON.stringify(ticketArr);
    localStorage.setItem('tasks',stringifiedArr);
}

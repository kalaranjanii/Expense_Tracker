var state={
    balance:2900,
    income:3000,
    expense:100,
    transaction:[
        {id:uniqueId(),name:'salary',amount:1000,type:'income'},
        {id:uniqueId(),name:'buy grocery',amount:100,type:'expense'},
        {id:uniqueId(),name:'buy cloths',amount:200,type:'expense'}
    ]
}
// console.log(state);

var balanceEl = document.querySelector('#balance');
var incomeEl = document.querySelector('#income');
var expenseEl = document.querySelector('#expense');
var transactionEl = document.querySelector('#transaction');
var incomebtn = document.querySelector('#addincome');
var expensebtn = document.querySelector('#addexpense');
var nameinput = document.querySelector('#name');
var amountinput = document.querySelector('#amount');

function init(){
    var localState = JSON.parse(localStorage.getItem('expenseTrackerState'))
    if(localState !== null){
        state = localState;
    }

    updateState()
    initListeners()
    
}

function uniqueId(){
    return Math.round(Math.random()*1000000);
}
// console.log(uniqueId());

function initListeners(){
    incomebtn.addEventListener('click',onAddIncomeClick);
    expensebtn.addEventListener('click',onAddExpenseClick);
}

function onAddIncomeClick(){
    addTransaction(nameinput.value,amountinput.value,'income')
    // console.log('income',nameinput.value,amountinput.value);
}
function addTransaction(name,amount,type){
    if(name !=='' && amount !==''){
        var transactions = {
            id:uniqueId(),
            name:name,
            amount:parseInt(amount),
            type:type
    }
        state.transaction.push(transactions);
        updateState();
    }
    else{
        alert('please enter value')
    }
    nameinput.value = '';
    amountinput.value = '';
}
function onAddExpenseClick(){
    addTransaction(nameinput.value,amountinput.value, 'expense');
    // console.log('expense',nameinput.value,amountinput.value);
}

function onDeleteClick(event){
    // console.log(event.target);
    var id = parseInt(event.target.getAttribute('data-id'));
    var deleteIndex;
    for(var i = 0; i < state.transaction.length; i++) {
        if(state.transaction[i].id===id){
            deleteIndex = i;
            break;
        }
    }
    state.transaction.splice(deleteIndex,1);
    updateState()
}
function updateState(){
    var balance=0,income=0,expense=0,items;

    for(var i=0;i<state.transaction.length;i++){
        items = state.transaction[i];
        if(items.type=== 'income'){
            income += items.amount;
        }
        else if(items.type === 'expense'){
            expense += items.amount;
        }
    }
    // console.log(balance,income,expense);
    balance = income - expense;

    state.balance = balance;
    state.income = income;
    state.expense = expense;

    localStorage.setItem('expenseTrackerState',JSON.stringify(state))

    render()
}

function render(){
    balanceEl.innerHTML = `$${state.balance}`;
    incomeEl.innerHTML = `$${state.income}`;
    expenseEl.innerHTML = `$${state.expense}`;

    var transactionlist,containerEl,amountEl,items;
    transactionEl.innerHTML = '';
    for(var i=0;i<state.transaction.length;i++){
        items = state.transaction[i];
        transactionlist = document.createElement('li');
        transactionlist.append(items.name);
        transactionEl.appendChild(transactionlist);

        containerEl = document.createElement('div');
        containerEl.id='mydiv';
        amountEl = document.createElement('span');
        if(items.type === 'income'){
            amountEl.classList.add('income_amt');
        }
        else if(items.type === 'expense'){
            amountEl.classList.add('expense_amt');
        }
        amountEl.innerHTML = `$${items.amount}`;
        containerEl.appendChild(amountEl);
        btnEl = document.createElement('button');
        btnEl.setAttribute('data-id',items.id);
        btnEl.innerHTML = 'X';
        btnEl.addEventListener('click',onDeleteClick);
        containerEl.appendChild(btnEl);
        
        transactionEl.appendChild(containerEl)
    }
    
}
init()
const transactionUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')

// let transactions = [
//     { id: 1, name: 'Bolo de brigadeiro', amount: -20},
//     { id: 2, name: 'Salário', amount: 300},
//     { id: 3, name: 'Torta de Frango', amount: -10},
//     { id: 4, name: 'Aula de Violão', amount: 150}
// ]

const localStorageTransaction = JSON.parse(localStorage
    .getItem('transactions'))

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransaction : []

removeTransaction = ID => {
    transactions = transactions.filter(transaction => 
        transaction.id !== ID)
    
    updateLocalStorege()
    init()
}

const addTransactionIntoDOM = transaction => {
    const operator = transaction.amount < 0 ? '-' : '+'
    const CSSClass = transaction.amount < 0 ? 'minus' : 'plus'
    const amountWithoutOperator = Math.abs(transaction.amount)
    const li =document.createElement('li')

    li.classList.add(CSSClass)
    li.innerHTML = `
        ${transaction.name}
        <span>${operator} R$ ${amountWithoutOperator}</span>
        <button class="delete-btn" onClick = "removeTransaction(${transaction.id})">
        x
        </button>
    `

    transactionUl.append(li)

}

const getTotal = transactionAmounts => transactionAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2)

const getIncome = transactionAmounts => transactionAmounts
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2)

const getExpense = transactionAmounts => Math.abs(transactionAmounts
    .filter(value => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0))
    .toFixed(2)

const updateBalanceValue = () => {
    const transactionAmounts = transactions
        .map(transaction => transaction.amount)
    const total = getTotal(transactionAmounts)
    const income = getIncome(transactionAmounts)
    const expense = getExpense(transactionAmounts)

    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expenseDisplay.textContent = `R$ ${expense}`
}

const init = () => {
    transactionUl.innerHTML = ''
    transactions.forEach(addTransactionIntoDOM)
    updateBalanceValue()
}

init()

const updateLocalStorege = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

const genarateID = () => Math.round(Math.random() * 1000)

const addToTransactionArray = (transactionName, transactionAmount) => {
    transactions.push({
        id: genarateID(),
        name: transactionName,
        amount: Number(transactionAmount)
    })
}

const cleanInputs = () => {
    inputTransactionName.value = ''
    inputTransactionAmount.value = ''
}

const handleFormSubmit = event => {
    event.preventDefault()

    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim() 
    const isSomeInputEmpty = transactionName === '' || transactionAmount === ''

    if (isSomeInputEmpty) {
        alert('Por favor preencha o nome e o valor da transação!')
        return
    }

    addToTransactionArray(transactionName, transactionAmount)
    init()
    updateLocalStorege()
    cleanInputs()

}

form.addEventListener('submit', handleFormSubmit)
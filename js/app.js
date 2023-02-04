let activeCardPlayer = document.querySelector('.card-player')
let activeCardEnemy = document.querySelector('.card-enemy')
const modalInfo = document.querySelector('.modal-info')
const playerCards = document.querySelector('.cards')
const isChooseCard = document.querySelector('.game-action')
const isAction = document.querySelector('.actions')
const cards = document.querySelectorAll('.card')

let countCards = cards.length
let attack = 0
let health = 0
let energy = 0
let buff = false
let cardName

let arrayEnemies = [
    {
        name: 'Лесник',
        attack: 5,
        health: 5,
        img: 'img/cards/Lesnik_card.png'
    },
    {
        name: 'Милф-слэйер',
        attack: 4,
        health: 6,
        img: 'img/cards/MilfSlayer_card.png'
    },
    {
        name: 'Лада Гранта',
        attack: 3,
        health: 10,
        img: 'img/cards/Lada_card.png'
    },
]
let countEnemies = arrayEnemies.length
let maxEnemies = countEnemies
let enemy
let healthEnemy
let attackEnemy

cards.forEach(card => card.addEventListener('click',function(){
    cardName = card.querySelector('.card-name').value
    let src = card.querySelector('img').getAttribute('src')
    attack = card.querySelector('.card-attack').innerHTML
    health = card.querySelector('.card-health').innerHTML

    isAction.style.bottom = `0%`
    playerCards.style.display = "none"

    activeCardPlayer.innerHTML = ""
    activeCardPlayer.innerHTML = 
        `<img src='${src}' alt="">
        <p class="card-attack">${attack}</p>
        <p class="card-health">${health}</p>`
    
    card.style.display = "none"
    countCards--
    if (countEnemies === maxEnemies) {
        createEnemy()    
    }
}))

cards.forEach(card => card.addEventListener('mouseover',function(){
    let info = card.querySelector('.card-info').value
    modalInfo.innerHTML = info
    modalInfo.style.top = "0%"
}))

cards.forEach(card => card.addEventListener('mouseout',function(){
    modalInfo.style.top = "-100%"
}))

function createEnemy(){
    enemy = arrayEnemies[countEnemies - 1]
    attackEnemy = enemy.attack
    healthEnemy = enemy.health

    activeCardEnemy.innerHTML = ""
    activeCardEnemy.innerHTML = 
        `<img src='${enemy.img}' alt="">
        <p class="card-attack">${enemy.attack}</p>
        <p class="card-health">${enemy.health}</p>`    
}

activeCardEnemy.addEventListener('animationend',function(){
    activeCardEnemy.classList.remove('get-damage')
    enemyMove()
})

activeCardPlayer.addEventListener('animationend',function(){
    activeCardPlayer.classList.remove('player-attack')
    activeCardPlayer.classList.remove('buff')
    activeCardPlayer.classList.remove('heal')
    activeCardPlayer.classList.remove('ultimate')
})

function Attack(){
    // Блокируем кнопку атаки до окончания действуйщей
    blockActions()

    healthEnemy -= attack
    energy++
    // анимация нанесения урона врагу
    activeCardPlayer.classList.add('player-attack')
    // анимация получения урона врага
    setTimeout(function(){
        activeCardEnemy.classList.add('get-damage')
    },500)
    if (buff) {
        deleteBuff()   
    }
}

function blockActions(){
    document.getElementById('btn-attack').disabled = true

    setTimeout(function(){
        document.getElementById('btn-attack').disabled = false
    },1500)
}

function Ultimate(){
    activeCardPlayer.classList.add('ultimate')
    setTimeout(function(){
        switch (cardName) {
            case 'Лада Гранта':
                health = 1
                deathEnemy()
                break;
            case 'Милф Слэйер':
                healthEnemy -= attack * 2
                enemyMove()    
                break;
            case 'Лесник':  
                attack += parseInt(healthEnemy,10)
                enemyMove()
                break;       
        }
        energy = 0
        document.getElementById('btn-ultimate').disabled = true
        if (buff) {
            deleteBuff()   
        }
    },1500)
}

function enemyMove(){
    clearStats()
    if (healthEnemy <= 0) {
        deathEnemy()
    }
    else if(energy >= 2){
        document.getElementById('btn-ultimate').disabled = false
        health -= enemy.attack
    }
    else{
        health -= enemy.attack
    }
    updateStats()
}

function clearStats(){
    activeCardEnemy.querySelector('.card-health').innerHTML = ""
    activeCardPlayer.querySelector('.card-health').innerHTML = ""

    activeCardEnemy.querySelector('.card-attack').innerHTML = ""
    activeCardPlayer.querySelector('.card-attack').innerHTML = ""
}

function updateStats(){
    if (health <= 0) {
        activeCardEnemy.querySelector('.card-health').innerHTML = healthEnemy
        activeCardEnemy.querySelector('.card-attack').innerHTML = attackEnemy
        deathPlayer(countCards)
    }
    else{
        activeCardEnemy.querySelector('.card-health').innerHTML = healthEnemy
        activeCardPlayer.querySelector('.card-health').innerHTML = health

        activeCardEnemy.querySelector('.card-attack').innerHTML = attackEnemy
        activeCardPlayer.querySelector('.card-attack').innerHTML = attack
    }
}

function deathEnemy(){
    if (countEnemies > 1) {
        --countEnemies
        createEnemy()
    }
    else{
        alert('Вы победили!', location.reload())
    }
}

function deathPlayer(cards){
    activeCardPlayer.innerHTML = ""
    if (cards > 0) {
        document.getElementById('btn-heal').disabled = false
        energy = 0
        isAction.style.bottom = `100%`
        playerCards.style.display = ""
    }
    else{
        alert('Вы проиграли!', location.reload())
    }
}

function deleteBuff(){
    attack -= 2

    activeCardPlayer.querySelector('.card-attack').style.color = "#fff"  
    document.getElementById('btn-buff').disabled = false
    buff = false

    updateStats()
}

function buffATK(){
    document.getElementById('btn-buff').disabled = true
    activeCardPlayer.querySelector('.card-attack').style.color = "green"
    activeCardPlayer.classList.add('buff')    
    energy++
    attack++
    attack++
    buff = true
    setTimeout(enemyMove,1500)
}

function Heal(){
    document.getElementById('btn-heal').disabled = true
    activeCardPlayer.classList.add('heal') 
    energy++
    health++
    health++
    health++
    setTimeout(enemyMove,1500)
}
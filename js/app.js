let activeCardPlayer = document.querySelector('.card-player')
let activeCardEnemy = document.querySelector('.card-enemy')
const modalInfo = document.querySelector('.modal-info')
const playerCards = document.querySelector('.cards')
const isChooseCard = document.querySelector('.game-action')
const isAction = document.querySelector('.actions')
const cards = document.querySelectorAll('.card')

let countCards = cards.length
let maxCountCards = countCards
let attack = 0
let health = 0
let energy = 0
let buff = false
let buffAttack = 2
let buffHeal = 4
let cardName
let cardInfo
let damage = 0

let arrayEnemies = [
    {
        name: 'Лесник',
        attack: 5,
        health: 20,
        img: 'img/cards/Lesnik_card.png'
    },
    {
        name: 'Милф-слэйер',
        attack: 5,
        health: 15,
        img: 'img/cards/MilfSlayer_card.png'
    },
    {
        name: 'Лада Гранта',
        attack: 3,
        health: 24,
        img: 'img/cards/Lada_card.png'
    },
    {
        name: 'Они-чан',
        attack: 2,
        health: 26,
        img: 'img/cards/Onichan_card.png'
    },
]
let countEnemies = arrayEnemies.length
let maxEnemies = countEnemies
let enemy
let healthEnemy
let attackEnemy

function showModalInfo(card){
    if (!card) {
        modalInfo.innerHTML = cardInfo
    }
    else{
        let info = card.querySelector('.card-info').value
        modalInfo.innerHTML = info
    }
    modalInfo.style.top = "0%"
}

function hideModalInfo(){
    modalInfo.style.top = "-100%"
}
// 
cards.forEach(card => card.addEventListener('click',function(){
    cardName = card.querySelector('.card-name').value
    cardInfo = card.querySelector('.card-info').value
    let src = card.querySelector('img').getAttribute('src')
    attack = card.querySelector('.card-attack').innerHTML
    health = card.querySelector('.card-health').innerHTML
    document.getElementById('btn-ultimate').disabled = true
    energy = 0

    isAction.style.bottom = `0%`
    playerCards.style.display = "none"

    activeCardPlayer.innerHTML = ""
    activeCardPlayer.innerHTML = 
        `<img src='${src}' alt="">
        <p class="card-attack">${attack}</p>
        <p class="card-health">${health}</p>`
    
    card.style.display = "none"
    if (countEnemies === maxEnemies && countCards === maxCountCards) {
        createEnemy()    
    }
    countCards--
}))

// Информация о карточках в модальном окне

cards.forEach(card => card.addEventListener('mouseover', function(){
    showModalInfo(card)
}))

cards.forEach(card => card.addEventListener('mouseout', hideModalInfo))

activeCardPlayer.addEventListener('mouseover',function(){
    showModalInfo()
})

activeCardPlayer.addEventListener('mouseout',function(){
    hideModalInfo()
})

//////////////
/////////////
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
    activeCardEnemy.classList.remove('enemy-attack')
    //enemyMove()
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

    console.log('Вы наносите ' + attack + ' урона')
    healthEnemy -= attack
    sizeDamage()
    ++energy
    // анимация нанесения урона врагу
    activeCardPlayer.classList.add('player-attack')
    // анимация получения урона врага
    setTimeout(function(){
        activeCardEnemy.classList.add('get-damage')
        enemyMove()
    },500)
    if (buff) {
        deleteBuff()   
    }
}

function sizeDamage(){
    for (let i = 0; i < attack; i++) {
        damage++       
    }
    console.log(damage)
}

function blockActions(){
    document.getElementById('btn-attack').disabled = true

    setTimeout(function(){
        document.getElementById('btn-attack').disabled = false
    },1500)
}

function Ultimate(){
    activeCardPlayer.classList.add('ultimate')
    energy = 0
    setTimeout(function(){
        switch (cardName) {
            case 'Лада Гранта':
                health = 1
                healthEnemy = 0
                break;
            case 'Милф Слэйер':
                healthEnemy -= attack * 2
                deleteBuff()     
                break;
            case 'Лесник': 
                for (let i = 0; i < healthEnemy; i++) {
                    attack++
                }
                break; 
            case 'Бог PHP':
                let src = 'img/cards/TrueGod_card.png'
                cardName = 'Истинный Бог PHP'
                attack = 5
                health = 10
                activeCardPlayer.innerHTML = ""
                activeCardPlayer.innerHTML = 
                `<img src='${src}' alt="">
                <p class="card-attack">${attack}</p>
                <p class="card-health">${health}</p>`
                break;  
            case 'Истинный Бог PHP':
                for (let i = 0; i < attack; i++) {
                    health++;                   
                }
                break;
            case 'Лёша Пиздабольский':
                healthEnemy -= 5
                energy = 0
                document.getElementById('btn-ultimate').disabled = true
                if (healthEnemy <= 0) {
                    deathEnemy()
                }
                else{
                    updateStats()  
                }
                return
            case 'Порш Каен':
                buffAttack++
                break
            case 'Джуси Пуси':
                buffHeal++
                buffHeal++
                health = 0
                break
            case 'Фурри Бой':
                deleteBuff()
                let diff = attack
                attack = attackEnemy
                attackEnemy = diff
                break
            case 'Андрей Маск':
                let i = attackEnemy
                attackEnemy = healthEnemy
                healthEnemy = i
                energy = 0
                document.getElementById('btn-ultimate').disabled = true
                if (healthEnemy <= 0) {
                    deathEnemy()
                }
                else{
                    updateStats()  
                }
                return
            case 'Твой отец':
                for (let i = 0; i < damage; i++) {
                    health++         
                }
                console.log("Хп поднялось до" + health)
                damage = 0
                break
            case 'Они-чан':
                healthEnemy -= 12
                break   
            case 'Кот Роман':
                for (let i = 0; i < 8; i++) {
                    health++                  
                }
                attack--
                break
            case 'Денис Святой':
                attackEnemy -= 1
                break
            case 'Санёчек':
                let b = maxCountCards - countCards
                for (let i = 0; i < b; i++) {
                    healthEnemy--                   
                }
                break             
        }
        enemyMove()
        document.getElementById('btn-ultimate').disabled = true
    },1500)
}

function enemyMove(){
    clearStats()
    updateStats()
    if (healthEnemy <= 0) {
        deathEnemy()
    }
    else{
        setTimeout(function(){
            activeCardEnemy.classList.add('enemy-attack')
            health -= attackEnemy
            updateStats()
        },500)
    }
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

    if (energy == 2) {
        document.getElementById('btn-ultimate').disabled = false
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
    damage = 0
    // document.getElementById('btn-ultimate').disabled = true
    if (cards > 0) {
        document.getElementById('btn-heal').disabled = false
        isAction.style.bottom = `100%`
        playerCards.style.display = ""
    }
    else{
        alert('Вы проиграли!', location.reload())
    }
}

function deleteBuff(){
    if (buff) {
        attack -= buffAttack
        activeCardPlayer.querySelector('.card-attack').style.color = "#fff"  
        document.getElementById('btn-buff').disabled = false
        buff = false
    }
    updateStats()
}

function buffATK(){
    document.getElementById('btn-buff').disabled = true
    activeCardPlayer.querySelector('.card-attack').style.color = "green"
    activeCardPlayer.classList.add('buff')    
    energy++
    for (let i = 0; i < buffAttack; i++) {
        attack++     
    }
    buff = true
    setTimeout(enemyMove,1500)
}

function Heal(){
    document.getElementById('btn-heal').disabled = true
    activeCardPlayer.classList.add('heal') 
    energy++
    for (let i = 0; i < buffHeal; i++) {
        health++       
    }
    setTimeout(enemyMove,1500)
}
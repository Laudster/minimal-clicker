var socket = io.connect(window.location.origin);

let money, money_per_print, money_per_second, prices;
const upgrades = [0.2, 1, 1, 2.5, 3, 5, 6, 10, 1, 1, 1]; // En smart løsning som jeg ikke husker hvordan funker

window.onload = function loadGame() {
    socket.emit("load-game", function(data){
        money = data.money;
        money_per_print = data.money_per_print
        money_per_second = data.money_per_second
        prices = data.prices

        update();
        document.getElementById("interface").style.display = "block";
    });
}

function saveGame() {
    const gameState = {
        'money': money,
        "money_per_print": money_per_print,
        "money_per_second": money_per_second,
        "prices": prices
    }

    socket.emit("save-game", {"save-data": gameState});
}

function update(){
    document.getElementById('money-count').innerHTML = money.toFixed(1);
    for (let i = 0; i < prices.length; i++){
        document.getElementById("price" + (i + 1)).textContent = prices[i];
    }
}

function print_money() {
    money += money_per_print;       // Blir kalt av print money knapp
    update();
}

function click_upgrade(id){
    if (money >= prices[Number(id)]){
        money_per_print += upgrades[Number(id)];
        money -= prices[Number(id)];
        prices[Number(id)] = Math.round(prices[Number(id)] * 1.25)
        update();
    }
}

function automatic_upgrade(id){
    if (money >= prices[Number(id)]){
        money_per_second += upgrades[Number(id)];
        money -= prices[Number(id)];
        prices[Number(id)] = Math.round(prices[Number(id)] * 1.25)
        update();
    }
}

setInterval(() => { money += money_per_second; update(); }, 1000); // 1000 millisekund / et sekund
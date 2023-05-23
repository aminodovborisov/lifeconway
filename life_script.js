let maxRows = 150;
let maxCols = 70;
// let rounded = true; 



function twoDigits(numb) {
    return (numb > 9) 
        ? numb.toString() 
        : '0' + numb.toString(); 
}

function countNeibs(cell, rounded)
{
    let clX = parseInt(cell.substr(4, 2));
    let clY = parseInt(cell.substr(6, 2));
    let preArr = [
        [clX - 1, clY - 1],
        [clX - 1, clY],
        [clX - 1, clY + 1],
        [clX, clY - 1],
        [clX, clY + 1],
        [clX + 1, clY - 1],
        [clX + 1, clY],
        [clX + 1, clY + 1]
    ]
    
    let rdArr = [];
    let onP;
    let neighId;
    let neighBour
    
    let neiCount = 0;
    
    // В следующем цикле мы оставляем реальных соседей.
    if (rounded) {
        for (let onP of preArr) {
           
            if (onP[0] === 0) {
                onP[0] = maxRows;
            }
            if (onP[0] === maxRows + 1) {
                onP[0] = 1;
            }
            if (onP[1] === 0) {
                onP[1] = maxCols;
            }
            if (onP[1] === maxCols + 1) {
                onP[1] = 1
            }
            // Сделали замкнутое поле!
            neighId = 'cell' + twoDigits(onP[0]) + twoDigits(onP[1]);
            neighBour = document.getElementById(neighId);
            if (neighBour.style.backgroundColor === 'rgb(0, 0, 0)') {
                neiCount++;
            }
        }
    } else {
        for (let onP of preArr) {
            
            if (onP[0] > 0 && onP[0] <= maxRows && onP[1] > 0 && onP[1] <= maxCols) {
                // Это реальный сосед, не за границами.
                // Пока считаем игровое поле плоским, не тороидальным.
                neighId = 'cell' + twoDigits(onP[0]) + twoDigits(onP[1]);
                // console.log('Neighbour #' + neighId);
                neighBour = document.getElementById(neighId);
                if (neighBour.style.backgroundColor === 'rgb(0, 0, 0)') {
                    // console.log('Neighbour #' + neighId + ' is ALIVE!')
                    neiCount++;
                }
            }

        }
        
    }
    // console.log(neiCount);
    
    return neiCount;
    
}

function stepLife()
{
    
    let i = 0;
    let j = 0;
    let myCellId, myCellSelf, myCellColor;
    let neighbCount;
    let destiny = {};
    let aliveCount = 0;
    
    let chkRound = document.getElementById('chkRound');
    let isRound = chkRound.checked;
    if (!chkRound.disabled) {
        chkRound.disabled = true;
    }
    // console.log('--- START ---');
    for (i = 1; i <= maxRows; i++) {
        for (j = 1; j <= maxCols; j++) {
            myCellId = 'cell' + twoDigits(i) + twoDigits(j);
            neighbCount = countNeibs(myCellId, isRound);
            // console.log(myCellId + ' has ' + neighbCount);
            myCellSelf = document.getElementById(myCellId);
            myCellColor = myCellSelf.style.backgroundColor;
            if (myCellColor === 'rgb(0, 0, 0)') {  // Alive
                aliveCount++;
                // console.log(myCellId + ' now ALIVE');
                if (neighbCount === 2 || neighbCount === 3) {
                    destiny[myCellId] = 'stay';
                } else {
                    destiny[myCellId] = 'kill';
                }
            } else {  // Empty
                // console.log(myCellId + ' now EMPTY');
                if (neighbCount === 3) {
                    destiny[myCellId] = 'birth';
                } else {
                    destiny[myCellId] = 'stay';
                }
            }
            // console.log(myCellId + ' must be ' + destiny.myCellId);
            
        }
    }
    
    if (aliveCount > 0) { 
    
        for (i = 1; i <= maxRows; i++) {
            for (j = 1; j <= maxCols; j++) {
                myCellId = 'cell' + twoDigits(i) + twoDigits(j);
                myCellSelf = document.getElementById(myCellId);
                // console.log(myCellId + 's Destiny is ' + destiny[myCellId]);
                switch (destiny[myCellId]) {
                    case 'kill':
                        myCellSelf.style.backgroundColor = '#cdcdcd';
                        break;
                    case 'birth':
                        myCellSelf.style.backgroundColor = 'rgb(0, 0, 0)';
                        break;
                }
            }
        }
        
        for (i = 1; i <= maxRows; i++) {
            for (j = 1; j <= maxCols; j++) {
                myCellId = 'cell' + twoDigits(i) + twoDigits(j);
                destiny[myCellId] = '';
            }
        }
        // return true;
    } else {
        alert('В общем, все умерли.\n' + 
              'Начните жизнь с чистого листа.\n' + 
              'Рисуйте и жмите Шаг жизни.')
        return;
    }
    // console.log('STEP!');
}

function isAllDead()
{
    // console.log('Whoop!');
    let countAlive = 0;
    for (let i = 1; i <= maxRows; i++) {
        for (let j = 1; j <= maxCols; j++) {
            let cellId = 'cell' + twoDigits(i) + twoDigits(j);
            let cellSelf = document.getElementById(cellId);
            if (cellSelf.style.backgroundColor === 'rgb(0, 0, 0)') {
                countAlive++;
            }
        }
    }
    return countAlive === 0;
}

function autoEvol()
{
    // console.log('Here!');
    function autoLifer()
    {
        // console.log('AutoLifer');
        let intr = setInterval(
            function()
            {
                if (!isAllDead()) {
                    stepLife();
                    // console.log('Badoom!')
                } else {
                    clearInterval(intr);
                    alert('В общем, все умерли.' + 
                          '\nНачните жизнь с чистого листа.\n' + 
                          'Рисуйте и жмите Шаг жизни или Автомат.')
                }
            },
            100
        )
    }
    autoLifer();
}


function paintCell(attrPaint)
{
    let elToPaint = document.getElementById(attrPaint);
    if (elToPaint.style.backgroundColor === 'rgb(0, 0, 0)') {
        elToPaint.style.backgroundColor = '#cdcdcd';
    } else {
        elToPaint.style.backgroundColor = '#000000';
    }
}    

function gameStart() 
{
    var chkRound = document.getElementById('chkRound');
    var chkRoundValue = chkRound.checked;
    let gameTable = document.getElementById('gameFieldTable');
    for (let i = 1; i <= maxRows; i++) {
        let nwRow = document.createElement("tr");
        nwRow.setAttribute('id', 'row' + twoDigits(i));
        gameTable.appendChild(nwRow);
        for (let j = 1; j <= maxCols; j++) {
            let nwCell = document.createElement('td');
            nwCell.setAttribute('class', 'gameCell');
            nwRow.appendChild(nwCell);
            let nwGameCell = document.createElement('div');
            nwGameCell.setAttribute('id', 'cell' + twoDigits(i) + twoDigits(j));
            nwGameCell.setAttribute('class', 'clickMe');
            nwCell.appendChild(nwGameCell);
        }
    }
    
    // console.log(gameTable);
    
    gameTable.addEventListener(
        'click',
        function(event) {
            let td = event.target.closest('td');
            if (!td) return;
            if (!gameTable.contains(td)) return;
            // console.log(td);
            let clkEd = td.children[0].getAttribute('id');
            // console.log(clkEd);
            paintCell(clkEd);
        }
    )
}

function onRefresh() 
{
    document.location.reload(true);
}

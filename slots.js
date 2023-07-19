const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    A:2,
    B:4,
    C:6,
    D:8
}

const SYMBOLS_VALUES = {
    A:5,
    B:4,
    C:3,
    D:2
}

//function to handle collecting user input of numbers 
const numberInput = (reply, reply2) => {
    while (true){
        const numberInput = prompt(reply);
        const numberFloat = parseFloat(numberInput);
        
        if (isNaN(numberFloat) || numberFloat <= 0)
        {
            console.log(reply2);
        }
        else
        {
            return numberFloat;
        }
    }
}

//function to collect deposit ammount based on user input
const getDeposit = () => {
    return numberInput("Enter deposit ammount: ", "Invalid deposit ammount!");
}

//function to collect ammount of lines to bet on 
const getLines = () => {
    while (true) {
        const lines = numberInput("Enter line ammount (1-3): ", "Invalid line ammount!");

        if (lines > ROWS) 
        {
            console.log("Too many lines!");
        }
        else 
        {
            return lines;
        }
        
    }
}

//function to collect bet per line and check against balance
const getBet = (balance, lines) => {
    while (true){
        const bet = numberInput("Enter bet per line: ", "Invalid bet ammount!");
        if (bet * lines > balance) 
        {
            console.log("Balance too low");
        }
        else 
        {
            return bet;
        }
        
    }
}

//transposes the reels arrays to rows 
const transpose = (reels) =>{
    const rows = [];
    for(let i=0; i<ROWS; i++)
    {
        rows.push([]);
        for (let j=0; j<COLS; j++)
        {
            rows[i].push(reels[j][i])
        }
    }
    return rows;
}

//creates the reels for the slot machine
const spin = () => {
    //adds all symbols to array 
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT))
    {
        for (let i=0; i<count; i++)
        {
            symbols.push(symbol);
        }
    }

    //creates reels by first creating 3(COLS) columns 
    //copys the 'symbols' array to a scoped column array
    //selects 3(ROWS) random symbols from the copied array and adds them to the 'reels' arry
    //removes selected symbol from the 'reelSymbols' array
    const reels = [];
    for(let i=0; i<COLS; i++)
    {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j=0; j<ROWS; j++)
        {
            const randIndex = Math.floor(Math.random() * reelSymbols.length)
            const selectedSymbol = reelSymbols[randIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randIndex, 1)
        }
    }
    return transpose(reels);
}

//Prints rows to create visual of slot machine
const printRows = (rows) => {
    for (const row of rows)
    {
        let rowString = "";
        for(const [i, symbol] of row.entries())
        {
            rowString += symbol;
            if (i != row.length - 1)
            {
                rowString +=" | ";
            }
        }
        console.log(rowString);
    }
}

//checks to see if user wins by checking if each row is a winner
const getWinnings = (rows, bet, lines) =>{
    let winnings = 0;

    for (let row=0; row<lines; row++)
    {
        const symbols = rows[row];
        let allSame = true;
        for (const symbol of symbols)
        {
            if(symbol != symbols[0])
            {
                allSame = false;
                break;
            }
        }

        if(allSame)
        {
            winnings += bet * SYMBOLS_VALUES[symbols[0]]
        }
    }
    return winnings;
}

//Main function
const game = () => {
    let accountBalance = getDeposit();

    while(true){
        console.log("Current Balance: £" + accountBalance)
        const lines = getLines();
        const bet = getBet(accountBalance, lines);
        accountBalance -= bet * lines;
        const reels = spin();
        
        console.log(accountBalance);
        console.log(lines);
        console.log(bet);
        
        printRows(reels);
        const winnings = getWinnings(reels, bet, lines );
        accountBalance += winnings;
        console.log("you won: £" + winnings.toString());

        if (accountBalance<=0)
        {
            console.log("Insufficient balance")
            break;
        }

        const repeat = prompt("Play again? (y/n) ");

        if (repeat != "y") break;
    }
}

game();
pragma solidity ^0.5.0;

import './Token.sol'; //importar para que se comuniquen los contratos

contract EthSwap {

    
    ///name for the contract
    string public name = 'EthSwap Instant Exchange'; //public to read outside of the contract
                    //state variable

    Token public token; //variable paara usar lo smetodos en token.sol
    uint public rate = 100;

    event TokenPurchase(
        address account,
        address token,
        uint amount,
        uint rate
    );

    event TokenSold(
        address account,
        address token,
        uint amount,
        uint rate
    );

    constructor(Token _token) public { ///_ es una convencion
        token = _token; // -> solopuede usarse en esta funcion _token
    }

    function buyTokens() public payable{ ///el que recibe es el que llama a esta funcion, payable, send eth cuando se llame esta funcion
        //transferir del contrato a la persona que las compra
        //AMount of ETH * redention reate
        uint tokenAmount = msg.value * rate; //global var para saber cuando se esta enviando

        //revisar que existan suficientes monedas en el exchange
        //require es como un if.. si es false da un error, true sigue ejecutando
        //this es la address del smartcontractjj
        require(token.balanceOf(address(this)) >= tokenAmount);

        token.transfer(msg.sender, tokenAmount); ///sender es el valor del address
    
        //triggering evetns -- emit an Event
        emit TokenPurchase(msg.sender, address(token), tokenAmount, rate);
    }


    ///SELLTOKENSSSSS
    function sellTokens(uint _amount) public {

        //user cant sell more tokens that they have
        require(token.balanceOf(msg.sender) >= _amount);

        //calculate amount of ETH to redeem
        uint etherAmount = _amount / rate;

        //revisar que haya suficiente ETh
        require(address(this).balance >= etherAmount);

        //perform sale
        token.transferFrom(msg.sender, address(this), _amount); //this es la direccion de este contrato
                                                                //transferFrom para cuando un tercer necesita mover tu trasnferencia
                                                                //necesita un aprove
        msg.sender.transfer(etherAmount); //send eth to the person calling the function

        emit TokenSold(msg.sender, address(token), _amount, rate );

    }
}

//truffle compile revisa que no tengas typos
// develop copnsole truffle console
///escribe comandos JS para interactuar con el contrato como si fuera API
//contract = await EthSwap.deployed() --> await 
//contract
//truffle(development)> contract.address
//'0x2544e3450d591CB122ad46E57f21fDB093E3FbEA'

//name = await contract.name() --> nombramos a la varible name el nombre del contrato
pragma solidity ^0.5.0;

import './Token.sol'; //importar para que se comuniquen los contratos

contract EthSwap {

    
    ///name for the contract
    string public name = 'EthSwap Instant Exchange'; //public to read outside of the contract
                    //state variable

    Token public token; //variable paara usar lo smetodos en token.sol
    uint public rate = 100;

    constructor(Token _token) public { ///_ es una convencion
        token = _token; // -> solopuede usarse en esta funcion _token
    }

    function buyTokens() public payable{ ///el que recibe es el que llama a esta funcion, payable, send eth cuando se llame esta funcion
        //transferir del contrato a la persona que las compra
        //AMount of ETH * redention reate
        uint tokenAmount = msg.value * rate; //global var para saber cuando se esta enviando
        token.transfer(msg.sender, tokenAmount); ///sender es el valor del address
    
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
const EthSwap = artifacts.require("EthSwap");
const Token = artifacts.require("Token");

module.exports = async function(deployer) {
  
  await deployer.deploy(Token);
  const token = await Token.deployed()

  await deployer.deploy(EthSwap, token.address); ///dos argumentos porque estamos pasando la direccion del contrato del token
  const ethSwap = await EthSwap.deployed()


  //transfer all coins to EThSwap

  await token.transfer(ethSwap.address, '1000000000000000000000000')
};

//truffle migrate --reset -> se usa para subir una copia dle contato ya subido, porque en laBC las cosas no se pueden sustituir

/* comprobacion truffle console de que se pasaron las monedas

truffle(development)> token = await Token.deployed()
undefined
truffle(development)> ethSwap = await EthSwap.deployed()
.undefined
truffle(development)> .
Invalid REPL keyword
truffle(development)> balance = await token.balanceOf(ethSwap.address)
undefined
truffle(development)> balance.toString()
'1000000000000000000000000'
truffle(development)> 

*/

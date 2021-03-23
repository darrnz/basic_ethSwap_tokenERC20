///probar antes de subirt a la BC
//mocha framework and chai para hacer test
//const web3 = require('web3')
const Token = artifacts.require('Token')
const EthSwap = artifacts.require('EthSwap')


//config chai
require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether')
}

contract('EthSwap', ([deployer, investor]) => {
    //aqui van los test
    let token, ethSwap

    //BEFORE HOOK
    before(async () => {
        token =  await Token.new()
        ethSwap = await EthSwap.new(token.address) 
        await token.transfer(ethSwap.address, tokens('1000000'))
    })

    //revisar que se deployo
    describe('Token deployment', async () => {
        it('contract has a name', async () => {
            const name = await token.name()
            assert.equal(name, 'DApp Token')
        })


    })

    describe('EthSwap deployment', async () => {
        it('contract has a name', async () =>{
            const name = await ethSwap.name()
            assert.equal(name, 'EthSwap Instant Exchange')
        })

        it('contract has tokens', async () => {
            let balance = await token.balanceOf(ethSwap.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })


    

    describe('Buy Tokens', async() => {
        let result

        before(async () => {
                //purchase tokens before each example
                result = await ethSwap.buyTokens({
                    from: investor, 
                    value: web3.utils.toWei('1', 'ether')
                })
            })

        it('Allows user to instantly purchase tokens from ethSawp for a fixed price', async()=> {
            //chek investor token balance after purchase
            let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('100'))
        })
    })

})

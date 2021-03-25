///probar antes de subirt a la BC
//mocha framework and chai para hacer test

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

            //checkEth balance after purchase
            let ethSwapBalance
            ethSwapBalance = await token.balanceOf(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), tokens('999900'))
            ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), web3.utils.toWei('1','Ether'))

            const event = result.logs[0].args //ver la información del evento enviado y revisar que la info ess correcta
            assert.equal(event.account, investor)
            assert.equal(event.token, token.address)
            assert.equal(event.amount.toString(), tokens('100').toString())
            assert.equal(event.rate.toString(), '100')
        })

    })

    describe('sellTokens()', async () => {
        let result

        before(async () => {
            await token.approve(ethSwap.address, tokens('100'), { from: investor } )//aprove antes de sell
            result = await ethSwap.sellTokens(tokens('100'), { from: investor })
        })

        it('Allows user to instantly sell tokens to ethSawp for a fixed price', async()=> {
                        //chek investor token balance after sell
                        let investorBalance = await token.balanceOf(investor)
                        assert.equal(investorBalance.toString(), tokens('0'))

                         //checkEth balance after purchase
                        let ethSwapBalance
                        ethSwapBalance = await token.balanceOf(ethSwap.address)
                        assert.equal(ethSwapBalance.toString(), tokens('1000000'))
                        ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
                        assert.equal(ethSwapBalance.toString(), web3.utils.toWei('0','Ether')) //0 porque estamos probando que vayan de un lado a otro
        
                        const event = result.logs[0].args //ver la información del evento enviado y revisar que la info ess correcta
                        assert.equal(event.account, investor)
                        assert.equal(event.token, token.address)
                        assert.equal(event.amount.toString(), tokens('100').toString())
                        assert.equal(event.rate.toString(), '100')

                        //FAILURE: EL INVESTOR NO PEUDE VENDER MAS DE LO QUE TIENE
                        await ethSwap.sellTokens(tokens('500', { from: investor })).should.be.rejected   
        })
    })

})

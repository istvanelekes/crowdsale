const { ethers } = require('hardhat');
const { expect } = require('chai');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Crowdsale', () => {
    let crowdsale

    beforeEach(async () => {
        const Crowdsale = await ethers.getContractFactory('Crowdsale')
        crowdsale = await Crowdsale.deploy()
    })
    
    describe('Deployment', () => {
        it('has correct name', async () => {
            expect(await crowdsale.name()).to.equal("Crowdsale")
        })    
    })
})
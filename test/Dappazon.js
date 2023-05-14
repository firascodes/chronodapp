const { expect } = require("chai");
const { TransactionDescription } = require("ethers/lib/utils");
const { beforeEach } = require("mocha");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Dappazon", () => {

    const ID = 1
    const NAME = "Shoes"
    const CATEGORY = "Footwear"
    const IMAGE = "https://"
    const COST = tokens(1)// Ether value in wei using "tokens" converter
    const RATING = 4
    const STOCK = 5

    let dappazon;
    let deployer,buyer;

  beforeEach(async () =>{
    //Setup accounts
    [deployer,buyer] = await ethers.getSigners(); // Two Dummy Addresses
      //Deploy Contract
    const Dappazon = await ethers.getContractFactory("Dappazon");
    dappazon = await Dappazon.deploy();
  })

  describe("Deployment", ()=>{
    it("sets the owner", async() => {
      expect(await dappazon.owner()).to.equal(deployer.address);
    })
  })

  describe("Listing", ()=>{
    let transaction;
    beforeEach(async () => {
      transaction = await dappazon.connect(deployer).list(
        ID,
        NAME,
        CATEGORY,
        IMAGE,
        COST,
        RATING,
        STOCK
      )

      await transaction.wait();
    })

    it("returns item attributes", async() => {
      const item = await dappazon.items(ID);
      expect(item.id).to.equal(ID);
      expect(item.name).to.equal(NAME);
      expect(item.category).to.equal(CATEGORY);
      expect(item.image).to.equal(IMAGE);
      expect(item.cost).to.equal(COST);
      expect(item.rating).to.equal(RATING);
      expect(item.stock).to.equal(STOCK);
    })

    it("emits List event", () => {
      expect(transaction).to.emit(dappazon, "List");
    })

  })

  describe("Buying", ()=>{
    let transaction;
    beforeEach(async () => {
      //List an item
      transaction = await dappazon.connect(deployer).list( ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
      await transaction.wait();
      //Buy an item
      transaction = await dappazon.connect(buyer).buy(ID, {value: COST})
    })

    it("updates the contract balance", async() => {
      const result = await ethers.provider.getBalance(dappazon.address);
      expect(result).to.equal(COST);
    })

    it("updates buyer's order count", async() => {
      const result = await dappazon.orderCount(buyer.address);
      expect(result).to.equal(1);
    })

    it("Adds the order" , async() => {
        const order = await dappazon.orders(buyer.address, 1)

        expect(order.time).to.be.greaterThan(0)
        expect(order.item.name).to.equal(NAME)
    })

    it("emits buy event", () => {
      expect(transaction).to.emit(dappazon, "Buy");
    })

  })

  describe("Withdrawing", () => {
    let balanceBefore;

    beforeEach(async () => {
      //List an item
      let transaction = await dappazon.connect(deployer).list( ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
      await transaction.wait();

      //Buy an item
      transaction = await dappazon.connect(buyer).buy(ID, {value:COST});
      await transaction.wait();

      //Get deployer initial balance
      balanceBefore = await ethers.provider.getBalance(deployer.address);

      //Withdraw
      transaction = await dappazon.connect(deployer).withdraw();
      await transaction.wait();
    })

    it("updates the owner balance", async() => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    })

    it("Updates the contract balance", async() => {
      const result = await ethers.provider.getBalance(dappazon.address);
      expect(result).to.equal(0);
    })


  })

  
})

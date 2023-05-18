import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Rating from './Rating'

import close from '../assets/close.svg'

const Product = ({ item, provider, account, dappazon, togglePop }) => {

  const [order,setOrder] = useState(null)
  const [hasBought, setHasBought] = useState(false)

  const fetchDetails = async() => {
    const events = await dappazon.queryFilter("Buy")
    const orders= events.filter(
      (event) => event.args.buyer === account && event.args.itemId.toString() === item.id.toString()
    )

    if(orders.length === 0) return

    const order = await dappazon.orders(account, orders[0].args.orderId)
    setOrder(order)

  }

  const buyHandler = async() => {
    console.log("buying...")
    const signer = await provider.getSigner()

    let transaction = dappazon.connect(signer).buy(item.id, { value: item.cost})
    await transaction.wait();
    setHasBought(true);
  }

  useEffect(() => {
    fetchDetails()
  }, [hasBought])



  return (
    <div className="product">
      <div className="product__details">

        <div className="product__image">
          <img src = {item.image} alt="Product" />
        </div>

        <div className="product__overview">
          <h1>{item.name}</h1>
          <Rating value={item.rating} />
          <hr />
          <p>{item.address}</p>
            <br />
          <h2>{ethers.utils.formatUnits(item.cost.toString(),'ether')} ETH</h2>
          <hr />

        </div>

        <div className='product__order'>
          <h1>{ethers.utils.formatUnits(item.cost.toString(),'ether')} ETH</h1>

          <p>
            Free Delivery <br />
            <strong>in 2 days</strong>
          </p>

          {item.stock>0 ? (
            <p>In Stock.</p>
          ): (
            <p>Out of Stock.</p>
          )}

            <button className='product__buy' onClick={buyHandler}>Buy Now</button>
            
            {order && (
              <div className='product__bought'>
                Item bought on <br />
                <strong>
                  { new Date(Number(order.time.toString()+'000')).toLocaleDateString(
                    undefined,
                    {
                      weekday: 'long',
                      hour: 'numeric',
                      minute: 'numeric',
                      second: 'numeric'
                    }
                  )}
                </strong>
                </div>
            )}
        </div>


        <button onClick={togglePop} className="product__close">
          <img src={close} alt="close" />
        </button>

      </div>
    </div >
  );
}

export default Product;
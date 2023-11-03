import { useState, useEffect } from 'react';
import { faker } from '@faker-js/faker';
import styled from "styled-components";
import cartIcon from "./images/shopping-cart.png";
import dogLogo from "./images/dog-logo.PNG";
import ShoppingCart from './components/ShoppingCart';

const App = () => {

  const [allDogs, setAllDogs] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchDogData = async () => {
      try {
        const response = await fetch("https://api.thedogapi.com/v1/images/search?limit=20");
        if(!response.ok){
          throw new Error(response.statusText);
        }
        const data = await response.json();
        const dogData = data.map((dog, index) => {
          return {
            inCart: false,
            dogId: index,
            dogImage: dog.url,
            name: faker.name.findName(),
            breed: faker.animal.dog(),
            price: faker.finance.amount(200, 800),
            gender: faker.name.gender(),
            location: faker.address.country(),
            ownerDetails: {
              phoneNumber: faker.phone.phoneNumber(),
              email: faker.internet.email(),
            }
          }
        })
        setAllDogs(dogData);
      } catch (err){
        setErrorMessage(err.message);
      }
    }
    fetchDogData()
  }, []);

  const handleAddToCart = (index, dogData) => {
    if(!dogData.inCart){
      let updatedDogs = [...allDogs];
      updatedDogs[index].inCart = true;
      setAllDogs(updatedDogs);

      let updatedCart = [...cart];
      updatedCart.push(dogData);
      setCart(updatedCart)
    } else {
      for (let i = 0; i < cart.length; i++) {
        if(cart[i].dogId === index){
          let removeDogFromCart = [...cart];
          removeDogFromCart.splice(i, 1)
          setCart(removeDogFromCart)

          let updatedAllDogs = [...allDogs];
          updatedAllDogs[index].inCart = false;
          setAllDogs(updatedAllDogs);
        }
      }
    }
  }

  return (
    <>
      <NavBar>
        <LeftSection>
          <img src={dogLogo} alt="Dog logo" />
          <h1>Dogz4Eva</h1>
        </LeftSection>
        <CartButton value={cart.length} onClick={() => setShowCart(!showCart)}></CartButton>
      </NavBar>
      <h2>{errorMessage}</h2>
      <AllDogs isCartVisible={showCart}>
        {allDogs.map((dog, index) => {
          return (
            <DogCard key={index} isDogInCart={dog.inCart} onClick={()=> handleAddToCart(index, dog)}>
              {dog.inCart ? <h3>Remove from Cart</h3> : <h3>Add to Cart</h3>}
              <img src={dog.dogImage} alt={dog.name}/>
              <h4>{dog.name}</h4>
              <p>£{dog.price}</p>
            </DogCard>
          )
        })}
      </AllDogs>
      <ShoppingCart isCartVisible={showCart} itemsInCart={cart} />
    </>
  );
}

export default App;

const NavBar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  background-color: #000000;
  width: 100vw;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftSection =styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    color: white;
    margin: 0 10px;
  }
  img {
    margin: 0 0 0 50px;
    height: 40px;
  }
`;

const CartButton = styled.button`
  height: 40px;
  width: 40px;
  padding: 0;
  margin: 0 50px 0 0;
  cursor: pointer;
  background-image: url(${cartIcon});
  background-repeat: no-repeat;
  background-size: cover;
  border: none;
  filter: invert(100%);
  background-color: rgba(0,0,0,0);

  &:hover {
    transform: scale(1.1);
  }

  &:after{
    content: attr(value);
    font-family: avenir;
    background-color: rgb(0, 255, 255);
    border-radius: 50%;
    position: relative;
    padding: 0px 5px;
    box-sizing: border-box;
    left: 15px;
    top: 13px;
    opacity: 0.9;
}
`;

const AllDogs = styled.div`
  margin: ${props => (props.isCartVisible ? '130px 400px 50px 50px' : '130px 50px 50px 50px')};
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  transition: margin 0.2s;
`;

const DogCard = styled.div`
  margin: 10px;
  padding: 10px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
    background-color: #ededed;
  }

  h3 {
    position: absolute;
    background-color: #ededed;
    width: 250px;
    height: 50px;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: ${props => props.isDogInCart ? '0.8' : '0'};
  }

  &:hover h3 {
    opacity: 0.8;
  }

  img {
    height: 250px;
    width: 250px;
    object-fit: cover;
  }

  h4 {
    letter-spacing: 2px;
    margin: 10px 0;;
  }

  p {
    margin: 0;
    letter-spacing: 4px;
    font-size: 12px;
  }
`;
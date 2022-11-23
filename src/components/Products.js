import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart, {generateCartItemsFrom} from './Cart';

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */

  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchValid,setIfSearchValid] = useState("true")
  const [deBounceTimeout, setDeBounceTimeout] = useState(0);
  const [itemsInCart, setItemsInCart] = useState([]);

  const  loggedIn = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const onLoadHandler = async () => {
      const productData = await performAPICall();
      if (token) {
        const cartData = await fetchCart(token);
        const cartDetails = await generateCartItemsFrom(cartData, productData);
        setItemsInCart(cartDetails);
      }
      // console.log(itemsInCart)
    };
    onLoadHandler();
  }, []);   //Renders only for the first time



  const performAPICall = async () => {
    try{
      setLoading(true);
      const res = await axios.get(`${config.endpoint}/products`);
      const data = res.data;
      // console.log(data);
      setLoading(false);
      setProducts(data); 
      return data;
    }
    catch(error) {
      setLoading(false);
      enqueueSnackbar(
        "Something went wrong. Check the backend console for more details",
        {
          variant: "error",
        }
      );
    }
  };


  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    try{
      const res = await axios.get(`${config.endpoint}/products/search?value=${text}`)
      const data = res.data;
      console.log(data);
      setProducts(data);
      setIfSearchValid(true);
    }
    catch(error){
    //  console.log(error)
      setIfSearchValid(false);
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    const value = event.target.value;
    if(deBounceTimeout !== 0){
      clearTimeout(deBounceTimeout)
    }
    const newTimeout = setTimeout(() => performSearch(value), debounceTimeout);
    setDeBounceTimeout(newTimeout);
  };



  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    let url = `${config.endpoint}/cart`
    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const res = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = res.data;
      // console.log("cartData", data);
      return data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    for(let i=0; i<items.length; i++){
      if(productId === items[i]["productId"]) return true
    }
    return false;
  };

  const updateCartItems = async (addedItem, products) => {
    const cartDataDetails = await generateCartItemsFrom(addedItem, products);
    //console.log(cartDataDetails)
    setItemsInCart(cartDataDetails);
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
    
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    console.log(token);
    if(!token) {
      enqueueSnackbar("Login to add an item to the Cart", {variant:'warning'});
      return;
    };
    

    if(options.preventDuplicate && isItemInCart(items, productId)){
      enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.",
        { 
          variant: "warning"
        });
      return;
    };
    
    {   
        let postDataFromPageToCart = {
          "productId": productId,
          "qty": qty,
        }
        console.log(postDataFromPageToCart);
        let url = `${config.endpoint}/cart`;
        try{
          const res = await axios.post(url, postDataFromPageToCart, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = res.data;
          //console.log("pageDataToCart", data);
          await updateCartItems(data, products);
        }
        catch(error) {
          console.log(error.response.data.message)
          }
      }
  };

    
  let updateProductsToPage = <Grid container spacing={2}  marginY="1rem" paddingX="1rem" >
                        {
                          products.map((product) => {
                            return(
                              <Grid item className="product-grid" xs={6} md={3} key={product._id}>
                                  <ProductCard key={product._id} 
                                    product={product} 
                                    handleAddToCart = {async() => await addToCart(
                                        token,
                                        itemsInCart,
                                        products,
                                        product._id,
                                        1,
                                        {preventDuplicate:true}
                                      )
                                    }
                                  />
                              </Grid>
                            )
                          })
                        }
                      </Grid>

  let searchCheck = searchValid ? updateProductsToPage : <Box className="loading">
                                                          <SentimentDissatisfied />
                                                          <p>No Products Found</p>
                                                         </Box>
 
  
    return(
    <div>
        <Header hasHiddenAuthButtons= {true}>
        {/* search view for desktop*/}
        <TextField
          className="search-desktop"
          size= "small"
          placeholder="Search for items/categories"
          name="search"
          InputProps={{
            className:"search",
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          onChange={(event)=> debounceSearch(event,500)}
        />
      </Header>

        {/* search view for mobile */}
        <TextField
          className="search-mobile"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          onChange={(event)=> debounceSearch(event,500)}
          placeholder="Search for items/categories"
          name="search"
        />
      

       <Grid container>
         <Grid item 
            className="product-grid" 
            xs={12} 
            md={loggedIn ? 9 : 12}
          >
           <Box className="hero" mb={2}>
             <p className="hero-heading">
               India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
           </Box>
          
              {loading ? <Box className="loading">
                                       <CircularProgress color="success"/>
                                       <p>Loading Products...</p> 
                                   </Box> 
                                   : searchCheck
                                  
              }
          </Grid>
          {loggedIn && <Grid item xs={12} md={3} bgcolor="#E9F5E1" >
                        <Cart 
                            products={products} 
                            items={itemsInCart}
                            handleQuantity = {addToCart}  
                          />
                        </Grid>}
        </Grid>
      
      <Footer />
      </div>
    )
}

export default Products;

"use client";
import { createContext, useEffect, useState } from "react";

// import { PRODUCTS } from "../products";

export const ShopContext = createContext<any | null>(null);

const getDefaultCart = () => {
  let cart:any = {};
  for (let i = 1; i < 10 + 1; i++) {
    cart[i] = 0;
  }
  console.log(cart);
  return cart;
};

export const ShopContextProvider = (props:any) => {
  const [cartItems, setCartItems] = useState<any>({});

  // const [userCount, setUserCount] = useState({});
  let socket;

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Perform localStorage action
    //   setCartItems(JSON.parse(localStorage.getItem("cartItems")) || {});


      if (localStorage.getItem("cartItems")) {
        let tempData:string|null = localStorage.getItem("cartItems");

        if(tempData){
            // return JSON.parse(tempData)
            setCartItems(JSON.parse(tempData) || {});
        }
      }
    }
  }, []);

  //   const getTotalCartAmount = () => {
  //     let totalAmount = 0;
  //     for (const item in cartItems) {
  //       if (cartItems[item] > 0) {
  //         let itemInfo = PRODUCTS.find((product) => product.id === Number(item));
  //         totalAmount += cartItems[item] * itemInfo.price;
  //       }
  //     }
  //     return totalAmount;
  //   };

  const updateCartItems = (newCartItems:object) => {
    console.log(newCartItems, "----------------------- New Cart Items");
    localStorage.setItem("cartItems", JSON.stringify(newCartItems));
    // console.log(
    //   JSON.parse(localStorage.getItem("cartItems")),
    //   "----------------------- New Cart Items"
    // );
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;

    for (const itemid in cartItems) {
      if (cartItems.hasOwnProperty(itemid)) {
        const item = cartItems[itemid];
        totalAmount += item.itemprice * item.count;
      }
    }

    return totalAmount;
  };

  //   const addToCart = (itemId) => {
  //     setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
  //   };
  const addToCart = (itemid:string, itemprice:string, itemtitle:string, itemimages:string) => {
    // Check if cartItem has any items
    // If cartItems has items, check if itemid exists
    if (cartItems.hasOwnProperty(itemid)) {
      // If matched, increase the count by one
      let tempCart = {
        ...cartItems,
        [itemid]: {
          ...cartItems[itemid],
          count: cartItems[itemid].count + 1,
        },
      };
      setCartItems(tempCart);
      updateCartItems(tempCart);
      //   setCartItems({
      //     ...cartItems,
      //     [itemid]: {
      //       ...cartItems[itemid],
      //       count: cartItems[itemid].count + 1,
      //     },
      //   });
    } else {
      // If no match is found, add a new object with itemid as the key
      let tempCart = {
        ...cartItems,
        [itemid]: {
          itemid,
          itemprice,
          itemtitle,
          itemimages,
          count: 1,
        },
      };
      setCartItems(tempCart);

      updateCartItems(tempCart);
      //   setCartItems({
      //     ...cartItems,
      //     [itemid]: {
      //       itemid,
      //       itemprice,
      //       itemtitle,
      //       itemimages,
      //       count: 1,
      //     },
      //   });
    }
  };

  //   const removeFromCart = (itemId) => {
  //     setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
  //   };

  const removeFromCart = (itemid:string) => {
    // Check if cartItem has any items
    if (Object.keys(cartItems).length === 0) {
      // If cartItems is empty, do nothing
      return;
    } else {
      // If cartItems has items, check if itemid exists
      if (cartItems.hasOwnProperty(itemid)) {
        // If count is more than 1, decrement it by one
        if (cartItems[itemid].count > 1) {
          let tempCart = {
            ...cartItems,
            [itemid]: {
              ...cartItems[itemid],
              count: cartItems[itemid].count - 1,
            },
          };

          setCartItems(tempCart);
          updateCartItems(tempCart);
          //   setCartItems({
          //     ...cartItems,
          //     [itemid]: {
          //       ...cartItems[itemid],
          //       count: cartItems[itemid].count - 1,
          //     },
          //   });
        } else {
          // If count is 1, remove the item from cartItems
          const updatedCart = { ...cartItems };
          delete updatedCart[itemid];
          setCartItems(updatedCart);
        }
      }
    }
  };

  //   const updateCartItemCount = (newAmount, itemId) => {
  //     setCartItems((prev) => ({ ...prev, [itemId]: newAmount }));
  //   };

  const updateCartItemCount = (
    itemId:string,
    newAmount:string,
    itemprice:string,
    itemtitle:string,
    itemimages:string
  ) => {
    // Check if newAmount is 0 or less
    console.log(
      itemId,
      newAmount,
      itemprice,
      itemtitle,
      itemimages,
      "this is from update cart item count..."
    );
    if (Number(newAmount) <= 0) {
      // If newAmount is 0 or less, remove the item from cartItem
      const updatedCart = { ...cartItems };
      delete updatedCart[itemId];
      setCartItems(updatedCart);
      updateCartItems(updatedCart);
    } else {
      // If newAmount is greater than 0, update the count or add a new item
      //   setCartItems({
      //     ...cartItems,
      //     [itemId]: {
      //       ...cartItems[itemId],
      //       itemId,
      //       count: newAmount,
      //     },
      //   });
      if (cartItems.hasOwnProperty(itemId)) {
        // If matched, increase the count by one

        let tempCart = {
          ...cartItems,
          [itemId]: {
            ...cartItems[itemId],
            count: newAmount,
          },
        };
        setCartItems(tempCart);
        // setCartItems({
        //   ...cartItems,
        //   [itemId]: {
        //     ...cartItems[itemId],
        //     count: newAmount,
        //   },
        // });
        updateCartItems(tempCart);
      } else {
        // If no match is found, add a new object with itemid as the key
        let tempCart = {
          ...cartItems,
          [itemId]: {
            itemId,
            itemprice,
            itemtitle,
            itemimages,
            count: newAmount,
          },
        };
        setCartItems(tempCart);
        updateCartItems(tempCart);
        // setCartItems({
        //   ...cartItems,
        //   [itemId]: {
        //     itemId,
        //     itemprice,
        //     itemtitle,
        //     itemimages,
        //     count: newAmount,
        //   },
        // });
      }
    }
  };
  const removeEntireItem = (itemId:string) => {
    const updatedCart = { ...cartItems };
    delete updatedCart[itemId];
    setCartItems(updatedCart);
    updateCartItems(updatedCart);
  };

  const getItemCountById = (itemId:string) => {
    // Retrieve cartItems from local storage
    const cartItemsString = localStorage.getItem("cartItems");

    // Check if cartItems is present in local storage
    if (cartItemsString) {
      try {
        // Parse the JSON string to get the cartItems object
        const cartItems = JSON.parse(cartItemsString);

        // Check if the item with the given itemId exists in cartItems
        if (cartItems && cartItems[itemId]) {
          // Return the count property of the item
          return cartItems[itemId].count;
        }
      } catch (error) {
        console.error("Error parsing cartItems JSON:", error);
      }
    }

    // Return 0 if the item with the given itemId is not found
    return 0;
  };

  const checkout = () => {
    setCartItems({});
    localStorage.removeItem("cartItems");
    // updateCartItems({});
  };

  const contextValue:any = {
    cartItems,
    addToCart,
    updateCartItemCount,
    removeFromCart,
    removeEntireItem,
    getTotalCartAmount,
    checkout,
    socket,
    getItemCountById,
    // userCount,
    // setUserCount,
  };

 return <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  
}




// -----------------------------------------------------------------------------------


// import { createContext, useEffect, useState, ReactNode } from "react";
// // import io from "socket.io-client";

// interface ShopContextType {
//   cartItems: any;
//   addToCart: (itemid?: string, itemprice?: number, itemtitle?: string, itemimages?: string[]) => void;
//   updateCartItemCount: (newAmount?: number, itemId?: string) => void;
//   removeFromCart: (itemid: string) => void;
//   removeEntireItem: (itemId: string) => void;
//   getTotalCartAmount: () => number;
//   checkout: () => void;
// //   socket: SocketIOClient.Socket | null;
//   getItemCountById: (itemId: string) => number;
// }

// export const ShopContext = createContext<ShopContextType | null>(null);

// const getDefaultCart = (): Record<string, number> => {
//   let cart: Record<string, number> = {};
//   for (let i = 1; i < 10 + 1; i++) {
//     cart[i.toString()] = 0;
//   }
//   console.log(cart);
//   return cart;
// };

// interface ShopContextProviderProps {
//   children: ReactNode;
// }

// export const ShopContextProvider: React.FC<ShopContextProviderProps> = (props) => {
//   const [cartItems, setCartItems] = useState<any>({});
//   let socket;

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       // Perform localStorage action
//     //   setCartItems(JSON.parse(localStorage.getItem("cartItems")) || {});


//       if (localStorage.getItem("cartItems")) {
//         let tempData:string|null = localStorage.getItem("cartItems");

//         if(tempData){
//             // return JSON.parse(tempData)
//             setCartItems(JSON.parse(tempData) || {});
//         }
//       }
//     }
//   }, []);

//   //   const getTotalCartAmount = () => {
//   //     let totalAmount = 0;
//   //     for (const item in cartItems) {
//   //       if (cartItems[item] > 0) {
//   //         let itemInfo = PRODUCTS.find((product) => product.id === Number(item));
//   //         totalAmount += cartItems[item] * itemInfo.price;
//   //       }
//   //     }
//   //     return totalAmount;
//   //   };

//   const updateCartItems = (newCartItems:object) => {
//     console.log(newCartItems, "----------------------- New Cart Items");
//     localStorage.setItem("cartItems", JSON.stringify(newCartItems));
//     // console.log(
//     //   JSON.parse(localStorage.getItem("cartItems")),
//     //   "----------------------- New Cart Items"
//     // );
//   };

//   const getTotalCartAmount = () => {
//     let totalAmount = 0;

//     for (const itemid in cartItems) {
//       if (cartItems.hasOwnProperty(itemid)) {
//         const item = cartItems[itemid];
//         totalAmount += item.itemprice * item.count;
//       }
//     }

//     return totalAmount;
//   };

//   //   const addToCart = (itemId) => {
//   //     setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
//   //   };
//   const addToCart = (itemid:string, itemprice:string, itemtitle:string, itemimages:string) => {
//     // Check if cartItem has any items
//     // If cartItems has items, check if itemid exists
//     if (cartItems.hasOwnProperty(itemid)) {
//       // If matched, increase the count by one
//       let tempCart = {
//         ...cartItems,
//         [itemid]: {
//           ...cartItems[itemid],
//           count: cartItems[itemid].count + 1,
//         },
//       };
//       setCartItems(tempCart);
//       updateCartItems(tempCart);
//       //   setCartItems({
//       //     ...cartItems,
//       //     [itemid]: {
//       //       ...cartItems[itemid],
//       //       count: cartItems[itemid].count + 1,
//       //     },
//       //   });
//     } else {
//       // If no match is found, add a new object with itemid as the key
//       let tempCart = {
//         ...cartItems,
//         [itemid]: {
//           itemid,
//           itemprice,
//           itemtitle,
//           itemimages,
//           count: 1,
//         },
//       };
//       setCartItems(tempCart);

//       updateCartItems(tempCart);
//       //   setCartItems({
//       //     ...cartItems,
//       //     [itemid]: {
//       //       itemid,
//       //       itemprice,
//       //       itemtitle,
//       //       itemimages,
//       //       count: 1,
//       //     },
//       //   });
//     }
//   };

//   //   const removeFromCart = (itemId) => {
//   //     setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
//   //   };

//   const removeFromCart = (itemid:string) => {
//     // Check if cartItem has any items
//     if (Object.keys(cartItems).length === 0) {
//       // If cartItems is empty, do nothing
//       return;
//     } else {
//       // If cartItems has items, check if itemid exists
//       if (cartItems.hasOwnProperty(itemid)) {
//         // If count is more than 1, decrement it by one
//         if (cartItems[itemid].count > 1) {
//           let tempCart = {
//             ...cartItems,
//             [itemid]: {
//               ...cartItems[itemid],
//               count: cartItems[itemid].count - 1,
//             },
//           };

//           setCartItems(tempCart);
//           updateCartItems(tempCart);
//           //   setCartItems({
//           //     ...cartItems,
//           //     [itemid]: {
//           //       ...cartItems[itemid],
//           //       count: cartItems[itemid].count - 1,
//           //     },
//           //   });
//         } else {
//           // If count is 1, remove the item from cartItems
//           const updatedCart = { ...cartItems };
//           delete updatedCart[itemid];
//           setCartItems(updatedCart);
//         }
//       }
//     }
//   };

//   //   const updateCartItemCount = (newAmount, itemId) => {
//   //     setCartItems((prev) => ({ ...prev, [itemId]: newAmount }));
//   //   };

//   const updateCartItemCount = (
//     itemId:string,
//     newAmount:string,
//     itemprice:string,
//     itemtitle:string,
//     itemimages:string
//   ) => {
//     // Check if newAmount is 0 or less
//     console.log(
//       itemId,
//       newAmount,
//       itemprice,
//       itemtitle,
//       itemimages,
//       "this is from update cart item count..."
//     );
//     if (Number(newAmount) <= 0) {
//       // If newAmount is 0 or less, remove the item from cartItem
//       const updatedCart = { ...cartItems };
//       delete updatedCart[itemId];
//       setCartItems(updatedCart);
//       updateCartItems(updatedCart);
//     } else {
//       // If newAmount is greater than 0, update the count or add a new item
//       //   setCartItems({
//       //     ...cartItems,
//       //     [itemId]: {
//       //       ...cartItems[itemId],
//       //       itemId,
//       //       count: newAmount,
//       //     },
//       //   });
//       if (cartItems.hasOwnProperty(itemId)) {
//         // If matched, increase the count by one

//         let tempCart = {
//           ...cartItems,
//           [itemId]: {
//             ...cartItems[itemId],
//             count: newAmount,
//           },
//         };
//         setCartItems(tempCart);
//         // setCartItems({
//         //   ...cartItems,
//         //   [itemId]: {
//         //     ...cartItems[itemId],
//         //     count: newAmount,
//         //   },
//         // });
//         updateCartItems(tempCart);
//       } else {
//         // If no match is found, add a new object with itemid as the key
//         let tempCart = {
//           ...cartItems,
//           [itemId]: {
//             itemId,
//             itemprice,
//             itemtitle,
//             itemimages,
//             count: newAmount,
//           },
//         };
//         setCartItems(tempCart);
//         updateCartItems(tempCart);
//         // setCartItems({
//         //   ...cartItems,
//         //   [itemId]: {
//         //     itemId,
//         //     itemprice,
//         //     itemtitle,
//         //     itemimages,
//         //     count: newAmount,
//         //   },
//         // });
//       }
//     }
//   };
//   const removeEntireItem = (itemId:string) => {
//     const updatedCart = { ...cartItems };
//     delete updatedCart[itemId];
//     setCartItems(updatedCart);
//     updateCartItems(updatedCart);
//   };

//   const getItemCountById = (itemId:string) => {
//     // Retrieve cartItems from local storage
//     const cartItemsString = localStorage.getItem("cartItems");

//     // Check if cartItems is present in local storage
//     if (cartItemsString) {
//       try {
//         // Parse the JSON string to get the cartItems object
//         const cartItems = JSON.parse(cartItemsString);

//         // Check if the item with the given itemId exists in cartItems
//         if (cartItems && cartItems[itemId]) {
//           // Return the count property of the item
//           return cartItems[itemId].count;
//         }
//       } catch (error) {
//         console.error("Error parsing cartItems JSON:", error);
//       }
//     }

//     // Return 0 if the item with the given itemId is not found
//     return 0;
//   };

//   const checkout = () => {
//     setCartItems({});
//     localStorage.removeItem("cartItems");
//     // updateCartItems({});
//   };

//   const contextValue:ShopContextType = {
//     cartItems,
//     addToCart,
//     updateCartItemCount,
//     removeFromCart,
//     removeEntireItem,
//     getTotalCartAmount,
//     checkout,
//     socket,
//     getItemCountById,
//     // userCount,
//     // setUserCount,
//   };

//   return (
//     <ShopContext.Provider value={contextValue}>
//       {props.children}
//     </ShopContext.Provider>
//   );
// };



export const calculateAverageRating = (reviews:any) => {
    if (!reviews || reviews.length === 0) {
      return 0;
    }
  
    const totalRatings = reviews.reduce(
      (acc:any, review:any) => acc + Number(review.ratings),
      0
    );
    const averageRating = totalRatings / reviews.length;
  
    return averageRating.toFixed(2);
  };
  
  export const isIdInProducts = (array:any[], userId:string, productId:string) => {
    // Check if the array is empty
    if (!Array.isArray(array) || array.length === 0) {
      return false;
    }
  
    // Iterate through each object in the array
    for (const order of array) {
      // Check if the 'userId' property matches the provided 'userId' parameter
      if (order.userId === userId) {
        // Check if the 'products' property exists and is an array
        if (Array.isArray(order.products)) {
          // Iterate through each product in the 'products' array
          for (const product of order.products) {
            // Check if the 'itemid' property matches the provided 'productId' parameter
            if (product.itemId === productId) {
              return true; // Found a match, return true
            }
          }
        }
      }
    }
  };
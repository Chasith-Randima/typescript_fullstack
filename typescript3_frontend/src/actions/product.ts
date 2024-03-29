import fetch from "isomorphic-fetch";
import axios from "axios";
import queryString from "query-string";

let API = "http://44.204.150.148:3001/api/v1"
// let API = process.env.NEXT_PUBLIC_API_DEVELOPMENT;

// if (process.env.NEXT_PUBLIC_PRODUCTION && process.env.NEXT_PUBLIC_PRODUCTION.toLowerCase() === 'true') {
//     API = process.env.NEXT_PUBLIC_API_PRODUCTION;
//   }

export const createProduct = async (data:any, token:string) => {
  console.log(token);
  let url = `${API}/products/`;
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};

export const allProducts = (paramsData:any) => {
  let url = `${API}/products`;

  return axios(url, {
    method: "GET",
    // params: { ...query },
    params: {
      page: paramsData.page,
      limit: paramsData.limit,
      category: paramsData.category,
      brandName: paramsData.brand,
      "price[lte]": paramsData.price,
      "quantity[lte]": paramsData.quantity,
      // createdAt: paramsData.createdAt,

      //   name: paramsData.name,
      //   city: paramsData.city,
      //   brandname: paramsData.brandname,
      //   Product: paramsData.Product,
      //   "price[gte]": paramsData.priceMin,

      sort: paramsData.sort,
    },
  })
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};
export const oneProduct = (id:string) => {
  let url = `${API}/Products/${id}`;

  return axios(url, {
    method: "GET",
  })
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};

export const updateProduct = async (id:string, data:any, token:string) => {
  console.log(id, data, token);
  let url = `${API}/Products/${id}`;
  return fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};

export const deleteProduct = async (id:string, token:string) => {
  let url = `${API}/Products/${id}`;
  return fetch(url, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};

export const searchProducts = (params:any) => {
  // console.log(params);
  let query = queryString.stringify(params);
  // console.log(query);
  let url = `${API}/products/search?${query}`;
  // console.log(url);

  return fetch(url, {
    method: "GET",
  })
    .then((response) => {
      // console.log(response);
      return response.json();
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};
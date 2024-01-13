import fetch from "isomorphic-fetch";
import axios from "axios";
import queryString from "query-string";

let API = process.env.NEXT_PUBLIC_API_DEVELOPMENT;

if (process.env.NEXT_PUBLIC_PRODUCTION && process.env.NEXT_PUBLIC_PRODUCTION.toLowerCase() === 'true') {
  API = process.env.NEXT_PUBLIC_API_PRODUCTION;
}


export const createOrder = async (data:any, token:string) => {
  console.log(token);
  let url = `${API}/orders/`;
  return fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};

export const allOrders = (paramsData:any) => {
  let url = `${API}/orders`;

  return axios(url, {
    method: "GET",
    // params: { ...query },
    params: {
      page: paramsData.page,
      limit: paramsData.limit,
      userId: paramsData.userId,
      "subTotal[lte]": paramsData.price,
      // createdAt: paramsData.createdAt,
      status: paramsData.status,
      _id: paramsData.orderId,
      //   name: paramsData.name,
      //   city: paramsData.city,
      //   brandname: paramsData.brandname,
      //   Order: paramsData.Order,
      //   "price[gte]": paramsData.priceMin,
      //   "price[lte]": paramsData.priceMax,
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
export const oneOrder = (id:string) => {
  let url = `${API}/orders/${id}`;

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

export const updateOrder = async (id:string, data:any, token:string) => {
  console.log(id, data, token);
  let url = `${API}/orders/${id}`;
  return fetch(url, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};

export const deleteOrder = async (id:string, token:string) => {
  let url = `${API}/orders/${id}`;
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

export const searchOrders = (params:any) => {
  // console.log(params);
  let query = queryString.stringify(params);
  // console.log(query);
  let url = `${API}/orders/search?${query}`;
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
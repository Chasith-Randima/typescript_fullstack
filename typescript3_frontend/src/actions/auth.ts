import fetch from "isomorphic-fetch";
import cookie from "js-cookie";

let API = process.env.NEXT_PUBLIC_API_DEVELOPMENT;

if (process.env.NEXT_PUBLIC_PRODUCTION && process.env.NEXT_PUBLIC_PRODUCTION.toLowerCase() === 'true') {
  API = process.env.NEXT_PUBLIC_API_PRODUCTION;
}

export const signup = async (user:object) => {
  console.log(user);
  let url = `${API}/users/signup`;
  return fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};

export const logIn = async (user:object) => {
  let url = `${API}/users/login`;
  return fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};

// export const logOut = async (next) => {
export const logOut = async () => {
  removeCookie("token_user");
  removeLocalStorage("user");

  let url = `${API}/users/logout`;
  return fetch(url, {
    method: "GET",
  })
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};

export const setCookie = (key:string, value:any) => {
  if (typeof window !== "undefined") {
    cookie.set(key, value, {
      expires: 1,
    });
  }
};

export const removeCookie = (key:string, value?:string) => {
  if (typeof window !== "undefined") {
    cookie.remove(key, {
      expires: 1,
    });
  }
};

export const getCookie = (key:string) => {
  if (typeof window !== "undefined") {
    return cookie.get(key);
  }
};

export const setLocalStorage = (key:string, value:any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const removeLocalStorage = (key:string) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};

export const authenticate = (data:any, user:any, next:any) => {
  if (user == "user") {
    setCookie("token_user", data.token);
    setLocalStorage(user, data.user);
  }
  next();
};

export const isAuth = async (user:any) => {
  if (typeof window !== "undefined") {
    let cookieChecked;
    if (user == "user") {
      cookieChecked = getCookie("token_user");
    }
    if (cookieChecked) {
      if (localStorage.getItem(user)) {
        let tempData:string|null = localStorage.getItem(user);

        if(tempData){
            return JSON.parse(tempData)
        }else{
            return false
        }
      } else {
        return false;
      }
    }
  }
};
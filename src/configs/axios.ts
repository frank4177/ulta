import axios from "axios";


const BASE_URL = "https://api.twitter.com/1.1"


export const request = axios.create({
  baseURL: BASE_URL
});
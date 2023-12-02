import axios from "axios";


const BASE_URL = "https://remotedev.izesan.com"


export const request = axios.create({
  baseURL: BASE_URL
});
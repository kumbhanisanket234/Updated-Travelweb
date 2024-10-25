import axios from "axios";

const instance=axios.create({
    // baseURL:"http://localhost:3001",
    baseURL:"https://travelweb-backend-kugb.onrender.com",
})

export const BASE_URL="https://travelweb-backend-kugb.onrender.com";

export default instance;

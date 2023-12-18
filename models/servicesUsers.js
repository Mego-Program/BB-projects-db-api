import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();

const selfUser = async function(token){
    const response = await axios.get(process.env.SLF_URL, { headers: {'authorization': token}})
    return response.data;
}

const allUsers = async function (token){
    const response = await axios.get(process.env.API_URL, { headers: {'authorization': token}})
    return response.data;
}

const inUsers = async function (token, idsArray){
    const response = await axios.get(process.env.API_URL, { headers: {'authorization': token}, params: { only: idsArray }})
    return response.data;
}

const exUsers = async function (token, idsArray){
    const response = await axios.get(process.env.API_URL, { headers: {'authorization': token}, params: { exlude: idsArray }})
    return response.data;
}

export {selfUser, allUsers, inUsers, exUsers};


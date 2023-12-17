import axios from "axios";

const allUsers = async function (token){
    const response = await axios.get("http://localhost:5000/api/users/users",   {headers: {'authorization': token}})

    return response.data;
}

export {allUsers}

const inUsers = async function (token, idsArray){
    const response = await axios.get("http://localhost:5000/api/users/users",   {headers: {'authorization': token}},{params:{only: idsArray}})

    return response.data;
}

const exUsers = async function (token, idsArray){
    const response = await axios.get("http://localhost:5000/api/users/users",   {headers: {'authorization': token}},{params:{exlude: idsArray}})

    return response.data;
}
export {inUsers, exUsers}


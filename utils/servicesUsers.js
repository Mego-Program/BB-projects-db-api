import axios from "axios";
import dotenv from 'dotenv';
import { Board } from "../models/board.js";


dotenv.config();

const selfUser = async function(token){
    const response = await axios.get(process.env.SLF_URL, { headers: {'authorization': token}})
    return response.data;
}

const allUsers = async function (token){
    const response = await axios.get(process.env.API_URL, { headers: {'authorization': token}})
    return response.data;
}

const inUsers = async function (token, boardID){

    const board = await Board.findById(boardID).exec();
    const response = await axios.get(process.env.API_URL, {headers: { 'authorization': token }, data: { only: board.users }});
    
    return response.data;
}

const exUsers = async function (token, boardID){
    const board = await Board.findById(boardID).exec();
    const response = await axios.get(process.env.API_URL, {headers: { 'authorization': token }, data: { exclude: board.users }});
    
    return response.data;
}


export {selfUser, allUsers, inUsers, exUsers};


import {StreamChat} from "stream-chat";
import {StreamClient} from "@stream-io/node-sdk";
import { ENV } from "./env.js";

const apikey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if(!apikey || !apiSecret){
    console.error("STREAM_API_KEY or STREAM_API_SECRET is missing");
}

export const streamClient = new StreamClient(apikey,apiSecret); //this is for video calls
export const chatClient = StreamChat.getInstance(apikey , apiSecret);//this is for chat features

export const upsertStreamUser = async(userData)=>{
    try {
        await chatClient.upsertUser(userData);
        console.log("Stream user updated successfully: ",userData);
    } catch (error) {
        console.error("Error upserting Stream user:", error);
    }
};

export const deletetStreamUser = async(userId)=>{
    try {
        await chatClient.deleteUser(userId);
        console.log("Stream user deleted successfully: ",userId);
    } catch (error) {
        console.error("Error deleting Stream user:", error);
    }
};
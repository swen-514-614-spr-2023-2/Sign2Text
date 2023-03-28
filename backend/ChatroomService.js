const ChatroomCacheDAO = require('./dao/ChatroomCacheDAO');
const Chatroom = require('./Chatroom');

class ChatroomService{
    #chatRoomDAO;
    #currentId;

    constructor(){
        this.#currentId = 0;
        this.#chatRoomDAO = new ChatroomCacheDAO();
    }

    /**
     * Lets a user with a unique username enter the chatroom
     * @param {*} roomId 
     * @param {*} user 
     * @returns 
     */
    enterChatroom(roomId, user){
        let chatroom = this.#chatRoomDAO.getChatroom(roomId);
        if(chatroom){
            return chatroom.addUser(user);
        }
        else return false;
    };

    exitChatroom(roomId, user){
        let chatroom = this.#chatRoomDAO.getChatroom(roomId);
        if(chatroom){
            return chatroom.deleteUser(user);
        }
        else return false;
    };

    /**
     * 
     * @param {*} message should follow the format {roomId : #, text: #}
     * @returns true if message added to chatroom successfully, else false
     */
    sendMessage(message){
        let chatroom = this.#chatRoomDAO.getChatroom(Number(message['roomId']));
        if(!chatroom){
            return false;
        }
        console.log('Adding message to chatroom');
        chatroom.addMessage(message);
        return true;
    };

    /**
     * 
     * @param {*} name name of chatroom to be created
     * @returns id of created chatroom
     */
    createChatroom(name){
        let cm = new Chatroom(this.#currentId++, name);
        this.#chatRoomDAO.createChatroom(cm)
        console.log(`Chatroom with id ${cm.id} created`);
        return cm.id;
    };

    deleteChatroom(roomId){
        return this.#chatRoomDAO.deleteChatroom(roomId);
    };

    getAllChatrooms(){
        return this.#chatRoomDAO.getAll();
    }
}

module.exports = ChatroomService;
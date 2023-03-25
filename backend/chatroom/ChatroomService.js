class ChatroomService{
    #chatRoomDAO;
    #currentId;

    constructor(){
        this.#currentId = 0;
        this.#chatRoomDAO = new ChatroomCacheDAO();
    }

    enterChatroom(room_id, user){
        const chatroom = this.#chatRoomDAO.getChatroom(room_id);
        chatroom.addUser(user);
    };

    exitChatroom(room_id, user){
        const chatroom = this.#chatRoomDAO.getChatroom(room_id);
        chatroom.deleteUser(user);
    };

    sendMessage(message){
        const chatroom = this.#chatRoomDAO.getChatroom(message['roomId']);
        chatroom.addMessage(message);
    };

    createChatroom(name){
        let cm = new Chatroom(this.#currentId++, name);
        return cm.id;
    };

    deleteChatroom(room_id){
        this.#chatRoomDAO.deleteChatroom(room_id);
    };
}
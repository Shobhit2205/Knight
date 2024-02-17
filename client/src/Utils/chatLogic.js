export function getName(obj, auth){
    return (obj?.isGroupChat ? obj?.chatName : (obj?.users[0]?._id === auth?.user?._id ? `${obj?.users[1]?.firstName} ${obj?.users[1]?.lastName}` : `${obj?.users[0]?.firstName} ${obj?.users[0]?.lastName}`))
}

export function getEmail(obj, auth){
    return (obj.isGroupChat ? obj.groupAdmin.email : (obj.users[0]._id === auth?.user?._id ? obj.users[1].email : obj.users[0].email));
}

export function isSameUser(messages, m, i){
    return i > 0 && messages[i-1].sender._id === m.sender._id;
}

export function isFirstMessage(messages, m, i){
    if(i === 0 || messages[i-1].sender._id !== m.sender._id) return true;
    return false;
}

export function getLatestMsg(el, user){
    if(el.latestMessage.sender._id !== user._id){
        if(el.isGroupChat){
            return `${el.latestMessage.sender.firstName} : ${el.latestMessage.content}`
        }
        else{
            return `${el.latestMessage.content}`
        }
    }
    else{
        return `You : ${el.latestMessage.content}`;
    }
}
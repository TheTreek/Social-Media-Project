const initialState = {
    id: null,
    user_name: '',
    profile_pic: '',
    auth: false
};

const GET_USER = 'GET_USER';

export function getUser(id,user_name,profile_pic,auth){
    return {
        type: GET_USER,
        payload: {
            id,
            user_name,
            profile_pic,
            auth
        }
    }
}

export default function reducer(state=initialState, action){
    const {type,payload} = action;
    switch(type){
        case GET_USER:
            return {...state,
                id: payload.id,
                user_name: payload.user_name,
                profile_pic: payload.profile_pic,
                auth: payload.auth   
            }
        default:
            return state;
    }
}
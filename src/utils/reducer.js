export const initialState = {
    modal: null,
    encText: null
}

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_MODAL":
            return { ...state, modal: action.payload }    
            case "SET_ENC_TEXT":
            return { ...state, encText: action.payload }    
        default:
            return state
    }
}

export const initialState = {
    modal: null
}

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_MODAL":
            return { ...state, modal: action.payload }        
        default:
            return state
    }
}

export const initialState = {
    modal: null,
    encText: null,
    startDec: false
}

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_MODAL":
            return { ...state, modal: action.payload }
        case "SET_ENC_TEXT":
            return { ...state, encText: action.payload }
        case "START_DECRYPT":
            return { ...state, startDec: action.payload }
        default:
            return state
    }
}

import { createSlice } from '@reduxjs/toolkit'


function getUserInfo(){
    let obj = {}
    try {
        const _userInfo = localStorage.getItem('useInfo')
        if (_userInfo) {
            obj = JSON.parse(_userInfo)
        }
    } catch{

    }
    return obj
}


function getLang(){
    let lang = 'en'
    try {
        lang = localStorage.getItem('lang') || 'en'
    } catch{

    }
    return lang
}

function getSystemCOnfig(){
    let obj = {}
    try {
        const _ethInfo = localStorage.getItem('systemInfo')
        if (_ethInfo) {
            obj = JSON.parse(_ethInfo)
        }
    } catch{

    }
    return obj
}

const userSlice = createSlice({
    name: 'user',
    initialState: {
        info: getUserInfo(),
        lang: getLang(),
        system: getSystemCOnfig()
    },
    reducers: {
        setUserInfoAction(state, action) {
            state.info = {...state.info, ...action.payload}
            localStorage.setItem('userInfo', JSON.stringify(state.info))
        },
        setLangAction(state, action) {
            state.lang = action.payload
            localStorage.setItem('lang', state.lang)
        },
        setSystemAction(state, action) {
            state.system = action.payload
            localStorage.setItem('systemInfo', JSON.stringify(state.system))
        }
    }
})

export const { setUserInfoAction, setLangAction, setSystemAction } = userSlice.actions

export default userSlice.reducer


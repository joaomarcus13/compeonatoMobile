import React, { useState, createContext } from "react";



const Context = createContext('')

export const NameProvider = ({children}) =>{

    const [name,setName] = useState('brasileiro')

    return(
    <Context.Provider value={[name,setName]}>
        {children}
    </Context.Provider>)
}

export default Context



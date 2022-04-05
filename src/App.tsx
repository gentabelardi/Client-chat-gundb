import { useEffect, useState, useReducer } from 'react'
import logo from './logo.svg'
import './App.css'
import Gun from 'gun'
const SEA = Gun.SEA;

const gun = Gun({
  peers: [
    'http://localhost:3030/gun'
  ]
})

const initialState = {
  messages: []
}

function reducer(state: any, message: any) {
  return {
    messages: [message, ...state.messages]
  }
}
function App() {
  const [password, setPassword] = useState("")
  const [notifMsg, setNotifMsg] = useState("")
  const [notification, setNotification] = useState(false)

  const [open, setOpen] = useState(true)
  const [formState, setForm] = useState({
    name: '', message: ''
  })

  const [state, dispatch] = useReducer(reducer, initialState)
  useEffect(() => {
    const messages = gun.get('messages')
    messages.map().on(m => {
      dispatch({
        name: m.name,
        message: m.message,
        createdAt: m.createdAt
      })
    })
  }, [])

  async function saveMessage() {
    if (formState.message.length < 150) {
      const messages = gun.get('messages')
      messages.set({
        name: formState.name,
        message: formState.message,
        createdAt: new Date(+new Date() - 1 * 1000 * 60 * 60 * 3).toISOString(),
      })
      setForm({
        name: '', message: ''
      })
    }
  }

  function onChange(e: any) {
    setForm({ ...formState, [e.target.name]: e.target.value })
  }

  function onChangePassword(e: any) {
    setPassword(e.target.value)
  }

  function verifyPass() {
    if (password.length > 0) {
      if (password == "dznwxswlzhcdxbecrdqm") {
        setOpen(false)
      } else {
        setNotifMsg("Wrong your password")
        setNotification(true)
        setTimeout(function () { setNotification(false) }, 2000);
      }
    }
  }
  return (
    <div className="bg-[#191919] h-screen">
      {notification ? <div id="toast-top-left" className="absolute  flex items-center w-full max-w-xs p-4 space-x-4 " role="alert">
        <div id="toast-danger" className="flex bg-[#222222] items-center w-full max-w-xs p-3  rounded-lg " role="alert">
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-500 bg-opacity-10 rounded-lg ">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
          </div>
          <div className="ml-3 text-sm font-medium text-red-500">{notifMsg}</div>
        </div>
      </div> : null}
      <section className="flex h-full justify-center items-center">
        <div className="flex rounded-lg md:w-[400px] border border-white border-opacity-20 flex-col">
          {open ?
            <div className="flex flex-col border m-1 rounded-lg border-yellow-400 border-2 border-opacity-50">
              <div className="flex flex-col border m-1 rounded-lg border-red-500 border-2 border-opacity-50">
                
                <div className="flex flex-col p-3 ">

                  <div className="flex">
                    <h1 className="text-white relative text-3xl font-bold">hello.
                      <span className="text-white font-medium text-xs bg-black py-0.5 px-1.5 flex items-center justify-center rounded-lg absolute right-[-30px] top-0">beta</span>
                    </h1>
                  </div>
                  <p className="text-white text-sm text-opacity-50">welcome to my site this is my projects chat decenteral using <a className="text-blue-400 hover:text-blue-500" target="_blank" href="https://gun.eco/"> gunjs</a> </p>
                </div>
                <div className="flex  space-x-2 p-3  ">
                  <input type="password" id="password" name="password" value={password} onChange={onChangePassword} placeholder="Put password" className="block p-2 w-full text-white bg-white bg-opacity-10 focus:outline-none rounded-lg  sm:text-xs focus:ring-blue-500 focus:border-blue-500 " />
                  {password.length > 0 ? <button type="button" className="text-blue-500 p-0.5 text-sm " onClick={verifyPass}>Send</button> : <div className="flex items-center justify-center text-white opacity-30 p-0.5 text-sm " >Send</div>}
                </div>
              </div>
            </div>
            : <div className="bg-[#B2C7DA]  rounded-lg">
              <div className="flex p-3 border-b border-white border-opacity-10">
                <h1 className="text-black text-xl font-bold">hello.</h1>
              </div>
              <div className=" flex  flex-col p-3 h-[400px] overflow-y-scroll">
                {state.messages.map(message => {
                  return <div key={message.createdAt} className="flex flex-col my-2">
                    <div className="flex">
                      <h1 className={`text-white break-words max-w-[200px] px-2 py-1 rounded-lg bg-blue-500 `}>{message.message}</h1>
                    </div>
                    <div className="flex space-x-5 mt-2">
                      <h1 className="text-black  text-opacity-50 text-xs">@{message.name}</h1>
                    </div>
                  </div>
                })}
              </div>
              <div className="flex bg-white rounded-b-lg space-x-2 px-3 py-2  border-t border-white border-opacity-10">
                <input type="text" id="name" name="name" value={formState.name} onChange={onChange} placeholder="@Your_name" className="block p-2 w-32 text-black bg-black bg-opacity-10 focus:outline-none rounded-lg  sm:text-sm focus:ring-blue-500 focus:border-blue-500 " />
                <input type="text" id="message" name="message" value={formState.message} onChange={onChange} placeholder="Your message" className="block p-2 w-full text-black bg-black bg-opacity-10 focus:outline-none rounded-lg  sm:text-sm focus:ring-blue-500 focus:border-blue-500 " />
                {formState.message.length && formState.name.length > 0 ? <button type="button" className="text-blue-500 font-bold p-0.5 text-sm " onClick={saveMessage}>Send</button> : <div className="flex items-center justify-center text-blue-500 font-bold opacity-50 p-0.5 text-sm " >Send</div>}
              </div>
            </div>}
        </div>
      </section>
    </div>
  )
}

export default App

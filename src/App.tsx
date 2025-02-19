import { useState } from 'react'
import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { Button, Stack } from '@mui/material'
import MyTabs from './view/tabs'
import NavigationComponentExample from './view/tabs/NavigationComponentDemo'

import NavigationComponentExample2 from './view/tabs/NavigationComponentExample'
import StepperExample from './view/Step/StepperExample'
import MyStepperComponent from './view/myStep/test'
import UserExample from './view/useAxios/UserExample'
import RequestExample from './view/useAxios/RequestExample'
import UserList from './view/user/UserList'
import LocalDataView from './view/local/LocalDataView'
import TodoList from './view/todo/TodoList'
import Chart from './view/Chart'
import ChartExample from './view/Chart/ChartExample'
import ChartDemo from './view/ChartDemo'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          {/* <img src={viteLogo} className="logo" alt="Vite logo" /> */}
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <Stack spacing={2} direction="row">
      <Button variant="text">Text</Button>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
    </Stack>
    {/* <MyTabs/>
    <NavigationComponentExample/>
    NavigationExample：
    <NavigationComponentExample2/>
    steper:
    <StepperExample/>
    -------------
    <hr />
    <Example/> */}
     <StepperExample/>
    {/* <MyStepperComponent/> */}
    {/* <UserExample/> */}
    {/*<RequestExample/>
    userlist:示例
    <UserList/>
    <LocalDataView/>
    */}
    {/* <TodoList/> */}
    {/* <Chart/>   */}
    {/* <UserList/> */}

    {/* <ChartExample/> */}
    <ChartDemo/>

    
    
    </>
  )
}

export default App

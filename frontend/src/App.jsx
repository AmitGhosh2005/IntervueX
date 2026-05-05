import { useState } from 'react'
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'

function App() {
  

  return (
    <>
      <h1 className='bg-red-500 p-4'>Welcome here</h1>
      <button className='btn btn-secondary m-16'>click me</button>
      <header>
        <Show when="signed-out">
          <SignInButton />
          <SignUpButton />
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </header>
    </>
  )
}

export default App

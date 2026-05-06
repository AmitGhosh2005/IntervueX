import React from 'react';
import { Show, SignInButton, SignUpButton, UserButton, useUser } from '@clerk/react';
import toast from 'react-hot-toast';


function Homepage() {
  return (
    <div>
      <button className='text-blue-500 p-2 btn btn-error' onClick={()=>{toast.error("nice you click")}}>Click me</button>
      <header>
        <Show when="signed-out">
          <SignInButton />
          <SignUpButton />
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </header>
    </div>
  )
}

export default Homepage
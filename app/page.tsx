'use client';

import Image from "next/image";
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function Home() {
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [welcome, setWelcome] = useState("Welcome!");

  const supabaseUrl = "https://xkmknlcfyloulpjyjylr.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrbWtubGNmeWxvdWxwanlqeWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3ODcxOTksImV4cCI6MjEwODM2MzE5OX0.EjW8I9aHC1P_DIahP_Fwid0OqAtFzD5EGwEXIEpXtxI";

  const supabaseClient = createClient(supabaseUrl, supabaseKey)

  const signUp = async () => {
    const { data, error } = await supabaseClient.auth.signUp({ email: inputEmail, password: inputPassword })

    if(error) {
      alert(error.message)
    } else {
      alert("User registered successfully!")
    }
  };

  const login = async () => {
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email: inputEmail, password: inputPassword })

    if(error) {
      alert(error.message)
    } else {
      alert("User successfully logged in!")
      const { data: {user}, error } = await supabaseClient.auth.getUser()

      if (error) {
        alert(error.message)
      } else {
        setWelcome('Welcome ' + user.email +'!')
      }
    }
  }

  const logout = async () => {
    const { error } = await supabaseClient.auth.signOut()

    if (error) {
      alert(error.message)
    } else {
      alert("User successfully logged out!")
      setWelcome('Welcome!')
    }
  }
  
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert h-5 w-[100px]"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Supabase Demo
          </h1>
          <h2 style={{fontSize: '24px'}}>Sign Up or Login:</h2>
          <input 
            type="email" 
            placeholder="Email"
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
            style={{padding: '10px 20px', backgroundColor: '#b0b0b0'}}
          />
          <input 
            type="password" 
            placeholder="Password"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            style={{padding: '10px 20px', backgroundColor: '#b0b0b0'}}
          />
          <button onClick={signUp} style={{padding: '10px 20px', backgroundColor: '#0207ab', color: '#FFF'}}>Sign Up</button>
          <button onClick={login} style={{padding: '10px 20px', backgroundColor: '#0207ab', color: '#FFF'}}>Login</button>

          <h2 style={{fontSize: '24px'}}>Dashboard</h2>
          <p>{welcome}</p>
        </div>
        <div>
          
        </div>
        <div>
          <button onClick={logout} style={{padding: '10px 20px', backgroundColor: '#0207ab', color: '#FFF'}}>Logout</button>
        </div>
      </main>
    </div>
  );
}

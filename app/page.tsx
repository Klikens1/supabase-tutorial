'use client';

import Image from "next/image";
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function Home() {
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [welcome, setWelcome] = useState("Welcome!");
  const [loggedIn, setLoggedIn] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [uploading, setUploading] = useState(false);

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

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
        setLoggedIn(true)
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
      setLoggedIn(false)
    }
  }

  const addTask = async () => {
    const { data, error } = await supabaseClient.from("new tasks").insert([{ task: newTask, completed: false }])

    if (error) {
      alert(error.message)
    } else {
      alert("Task added successfully!")
    }
  }

  const getTasks = async () => {
    const { data } = await supabaseClient.from("new tasks").select("*")

    return data.map((task, index) => (
      <li key={index}>
        {task.task}
        <button onClick={completeTask(task.id)}>Complete</button>
        <button onClick={deleteTask(task.id)}>Delete</button>
      </li>
    ))
  }

  const completeTask = async (id) => {
    const { data, error } = await supabaseClient.from("new tasks"). update({ completed: true }).eq("id", id).select()

    if (error) {
      alert(error.message)
    }
  }

  const deleteTask = async (id) => {
    const { error } = await supabaseClient.from("new tasks").delete().eq("id", id)
  }

  const handleUpload = async (event) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        alert("You must select an image to upload")
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${Math.random()}.${fileExt}`

      const { data, error } = await supabaseClient.storage
        .from('images') // Replace with your actual bucket name
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error
      else {
        alert('Image uploaded successfully!')
        console.log('Stored file information:', data)
      }      
    } catch (error) {
      alert(error.message)
    } finally {
      setUploading(false)
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

          {loggedIn ? (
            <>
              <h2 style={{fontSize: '24px'}}>Task App</h2>
              <input 
                type="text"
                placeholder="Enter a task"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)} 
                style={{padding: '10px 20px', backgroundColor: '#b0b0b0'}}
              />
              <button onClick={addTask} style={{padding: '10px 20px', backgroundColor: '#0207ab', color: '#FFF'}}>Add Task</button>

              <h3>Tasks</h3>
              <ul>
                {getTasks()}
              </ul>

              <h3>Image Upload</h3>
              <label htmlFor="single">
                {uploading ? 'Uploading ...' : 'Upload Image'}
              </label>
              <input
                type="file"
                id="single"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
              />
            </>
          ) : (
            <p>Log In to access tasks list</p>
          )}

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

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import WeatherFilter from './components/WeatherFilter'
import Header from './components/Header'

function App() {

  return (
    <>
    <Header />
    <WeatherFilter />
    </>
  )
}

export default App

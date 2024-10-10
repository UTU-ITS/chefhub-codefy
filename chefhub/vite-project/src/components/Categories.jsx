import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import './Categories.css'


export default function Categories() {
  return (
    <span>
        <button className="btn-tag"> Pizzeria </button>
        <button className="btn-tag"> Hamburguesas </button>
        <button className="btn-tag"> Sushi </button>
    </span>
  )
}

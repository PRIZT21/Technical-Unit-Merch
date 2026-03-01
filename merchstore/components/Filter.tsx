'use client'
import { useState } from "react";
 
export default function Filter({ setSelectedColor, setSelectedSize }: { setSelectedColor: (value: string) => void; setSelectedSize: (value: string) => void }) {
  return(<>
  <div className="flex gap-4 mb-6">

  <select onChange={(e) => setSelectedColor(e.target.value)}>
    <option value="">All Colors</option>
    <option value="Black">Black</option>
    <option value="Purple">Purple</option>
    <option value="Grey">Grey</option>
  </select>

  <select onChange={(e) => setSelectedSize(e.target.value)}>
    <option value="">All Sizes</option>
    <option value="S">S</option>
    <option value="M">M</option>
    <option value="L">L</option>
    <option value="XL">XL</option>
  </select>

</div></>)
}
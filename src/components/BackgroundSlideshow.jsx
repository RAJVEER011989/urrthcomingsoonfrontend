import { useEffect, useState } from "react";

export default function BackgroundSlideshow({ slides, interval = 3000 }) {

  const [index,setIndex] = useState(0)

  useEffect(()=>{

    const timer = setInterval(()=>{
      setIndex((prev)=> (prev+1) % slides.length)
    },interval)

    return ()=>clearInterval(timer)

  },[slides,interval])

  return(

    <div className="slideshow">

      {slides.map((img,i)=>(
        <div
          key={i}
          className={`slide ${i===index ? "active" : ""}`}
          style={{backgroundImage:`url(${img})`}}
        />
      ))}

    </div>

  )
}
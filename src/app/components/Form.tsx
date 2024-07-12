"use client";

import { useState } from 'react';

const Form = () => {
  const [tono, setTono] = useState('')
  const [topic, setTopic] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState<boolean>(false)

  const getData = async () => {
    const data = await fetch(
      `${process.env.API_NEXT}/api?search=${topic.replace(" ","+")}+en+tono+${tono}`
    )
    return data.json()
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if( tono === "" || topic === "") {
      alert("Por favor llene todos los campos")
    } else {
      setResult('')
      setLoading(true)
      e.preventDefault()
      getData().then(r  => {
        setResult(r.data)
        setLoading(false)
        setTopic('')
        setTono('')
      })
    }
  }
 
  return (
      <>
        <div className="form-section container flex justify-center">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="mr-4" htmlFor="tono">Tono de la historia: </label>
                  <select disabled={loading} value={tono} required onChange={(e) => setTono(e.target.value)} name="tono" id="tono" className="bg-slate-800 px-4 py-2 rounded-lg">
                    <option value="">Seleccione un tono</option>
                    <option value="divertido">Divertido</option>
                    <option value="para dormir">Para dormir</option>
                    <option value="emocionante">Emocionante</option>
                  </select>
                </div>
                <div className="flex flex-col mb-4">
                  <label className="mb-2" htmlFor="topic">De que tema quieres tu historia?</label>
                  <textarea disabled={loading} value={topic} required onChange={(e) => setTopic(e.target.value)}  className="bg-slate-800 p-2 rounded-lg" name="topic" id="topic" rows={3} placeholder="Escribe tu texto aquí" />
                </div>
                <input type="submit" disabled={loading} value={`${loading ? "Cargando..." : "Generar Historia"}`} className="bg-sky-600 hover:bg-sky-900 py-2 px-4 text-white p-2 rounded-lg cursor-pointer" />
              </form>
        </div>
        { result !== "" && (
            <div className="result-section">
              <h2>Historia</h2>
              <p>{result}</p>
            </div>
        )}
    </>  
  )
}

export default Form
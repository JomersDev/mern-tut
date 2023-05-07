import { useState } from "react"
import { useWorkoutsContext } from "../hooks/useWorkoutsContext"
import { useAuthContext } from "../hooks/useAuthContext"

const WorkoutForm = () => {
  const {dispatch} = useWorkoutsContext()
  const {user} = useAuthContext()

  const [title, setTitle] = useState('')
  const [load, setLoad] = useState('')
  const [reps, setReps] = useState('')
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyfields] = useState([])
  
  const handleSubmit = async (e) => {
    e.preventDefault()

    // check if user exists before sending POST req
    if(!user) {
      setError('You must be logged in')
      return
    }

    const workout = {title, load, reps}

    const response = await fetch('http://localhost:4000/api/workouts', {
      method: 'POST',
      body: JSON.stringify(workout),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (!response.ok) {
      setError(json.error)
      setEmptyfields(json.emptyFields)
    }
    if (response.ok) {
      setTitle('')
      setLoad('')
      setReps('')
      setError(null)
      setEmptyfields([])
      console.log('new workout added', json)
      dispatch({type: 'CREATE_WORKOUT', payload: json})
    }
  }

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Workout</h3>

      <label>Exercise Title:</label>
        <input 
          type="text" 
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          className={emptyFields.includes('title') ? 'error': ''}
        />
      <label>Load (in Kg):</label>
        <input 
          type="number" 
          onChange={(e) => setLoad(e.target.value)}
          value={load}
          className={emptyFields.includes('load') ? 'error': ''}
        />
      <label>Reps:</label>
        <input 
          type="number" 
          onChange={(e) => setReps(e.target.value)}
          value={reps}
          className={emptyFields.includes('reps') ? 'error': ''}
        />
      <button>Add Workout</button>
      {error && <div className="error">{error}</div>}
    </form>
    )
}

export default WorkoutForm
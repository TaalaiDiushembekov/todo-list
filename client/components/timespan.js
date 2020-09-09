import React from 'react'

const TimeSpan = ({ setTimespan }) => {
  return (
    <div>
      <button
        type="button"
        className="mr-2 bg-green-400 px-2 rounded"
        onClick={() => setTimespan('day')}
      >
        day
      </button>
      <button
        type="button"
        className="mr-2 bg-green-400 px-2 rounded"
        onClick={() => setTimespan('week')}
      >
        week
      </button>
      <button
        type="button"
        className="mr-2 bg-green-400 px-2 rounded"
        onClick={() => setTimespan('month')}
      >
        month
      </button>
      <button
        type="button"
        className="mr-2 bg-green-400 px-2 rounded"
        onClick={() => setTimespan()}
      >
        all time
      </button>
    </div>
  )
}

export default TimeSpan

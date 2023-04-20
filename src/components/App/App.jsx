import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

function App() {
  const dispatch = useDispatch();
  const elements = useSelector(store => store.elementList)
  const [newElement, setNewElement] = useState('');


  // GET elements from server using saga
  const getElements = () => {
    dispatch({ type: 'FETCH_ELEMENTS' });
  }


  useEffect(() => {
    getElements();
  }, []);

  // POST new element to server using saga
  const addElement = () => {
    dispatch({ type: 'ADD_ELEMENT',
     payload: {name: newElement},
    setNewElement: setNewElement });
  }



  return (
    <div>
      <h1>Atomic Elements</h1>

      <ul>
        {elements.map(element => (
          <li key={element}>
            {element}
          </li>
        ))}
      </ul>

      <input 
        value={newElement} 
        onChange={evt => setNewElement(evt.target.value)} 
      />
      <button onClick={addElement}>Add Element</button>
    </div>
  );
}


export default App;

import { useState, useEffect } from 'react'
import './App.css'

const initialEditFormState = {
  name: '',
  species: '',
  status: 'Alive'
}


function App() {
  // Estado para guardar los personajes. Es una lista [] arranca vacía. Este mismo estado lo usaremos para editar cada personaje
  const [charactes, setCharactes] = useState([])
  // Estado de carga. Si es verdadero mostramos un mensaje de cargando datos. Si es falso mostramos los datos.
  const [loading, setLoading] = useState(true)
  // Etado para saber el id del personaje que vamos a editar
  const [characterID, setCharacterId] = useState(null)
  // Estado para el formulario de edición. Este lo usaremos para editar cada uno de los personajes
  const [editForm, setEditForm] = useState(initialEditFormState)

  // Funcion para traer los personajes
  const getCharactes = async () => {
    try {
      const res = await fetch('https://rickandmortyapi.com/api/character')
      if (res.ok) {
        const data = await res.json()
        console.log(data);
        // data.results para poder acceder a los personajes directamente
        setCharactes(data.results)
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  // Traemos los peronajes la primera vez que se cargue app
  useEffect(() => {
    getCharactes()
  }, [])

  // Funcion para poder escribir en los inputs (formulario completo)

  const handleInputs = (e) => {
    const { name, value } = e.target
    setEditForm({
      ...editForm,
      [name]: value
    })
  }

  // Funcion para empezar a editar. Seteamos el personaje a editar y los valores del formulario (Serían los valores de cada personaje. Su nombre, especie, y estado)
  const editCharacter = (character) => {
    console.log(character);

    setCharacterId(character.id)
    setEditForm({
      name: character.name,
      species: character.species,
      status: character.status
    })
  }

  // Funcion para guardar. Hay que editar solo el personaje que fue seleccionado. Por eso recorremos todos, preguntamos si es el que se está editando y lo ajustamos
  const saveCharacter = () => {
    setCharactes(
      charactes.map((character) => characterID === character.id ?
        {
          ...character,
          name: editForm.name,
          species: editForm.species,
          status: editForm.status
        } : character)
    )
    setCharacterId(null)
    setEditForm(initialEditFormState)
  }
  // Funciona de cacelar la edicion. Solo volvemos los estados para editar a su valor inicial. Eso obliga a cerrar la edicion porque ya no coinciden los ids
  const cancelEdit = () => {
    setCharacterId(null)
    setEditForm(initialEditFormState)
  }

  return (
    <>
      <h1>Rick & Morty Editable</h1>
      {
        loading ?
          <p>Loading Characters</p>
          :
          <section className='characters-section'>
            {charactes.length > 0 ?
              charactes.map((character) => (
                <article className='character-card' key={character.id}>
                  <img src={character.image} alt={character.name} />
                  <div className='character-info'>

                    {/* Aquí validamos. Es el estado characterId igual al charecter que estamos clieando? si es verdadero mostramos los campos editables (sino) : Mostramos los datos normales */}
                    {
                      characterID === character.id ?
                        <form className='character-edit-form'>
                          <input
                            type="text"
                            name="name"
                            placeholder='Character Name'
                            value={editForm.name}
                            onChange={(e) => handleInputs(e)} />
                          <input
                            type="text"
                            name="species"
                            placeholder='Character Specie'
                            value={editForm.species}
                            onChange={(e) => handleInputs(e)} />
                          <select
                            name="status"
                            onChange={(e) => handleInputs(e)}>
                            <option value="Alive">Alive</option>
                            <option value="Dead">Dead</option>
                            <option value="Unknown">Unknown</option>
                          </select>
                          <div className='form-actions'>
                            <button onClick={saveCharacter}>Save</button>
                            <button onClick={cancelEdit}>Cancel</button>
                          </div>
                        </form>
                        :
                        <>
                          <p>{character.name}</p>
                          <p>{character.species}</p>
                          <p>{character.status}</p>
                          <button onClick={() => editCharacter(character)}>Edit</button>
                        </>
                    }
                  </div>
                </article>
              ))
              :
              <p>No Characters</p>
            }
          </section>
      }
    </>
  )
}

export default App

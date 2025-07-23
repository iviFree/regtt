import { useState } from 'react'
import { supabase } from './supabase'
import FullScreenLoader from './components/FullScreenLoader.jsx'

function App() {
  const [email, setEmail] = useState('')
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [fullName, setFullName] = useState('')
  const [tiktokUser, setTiktokUser] = useState('@')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [accessCode, setAccessCode] = useState('')

  const isValidFullName = (name) => {
    const regex = /^[a-zA-ZÀ-ÿ\s]{4,}$/
    return (
      regex.test(name.trim()) &&
      !name.includes('<') &&
      !name.includes('>') &&
      !name.includes('{') &&
      !name.includes('}') &&
      !name.toLowerCase().includes('script')
    )
  }

  const isValidTikTokHandle = (handle) => {
    const username = handle.slice(1)
    const regex = /^[a-zA-Z0-9_.]{2,}$/
    return (
      handle.startsWith('@') &&
      regex.test(username) &&
      !handle.includes('<') &&
      !handle.includes('>') &&
      !handle.includes('{') &&
      !handle.includes('}') &&
      !handle.toLowerCase().includes('script')
    )
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const cleanEmail = email.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

    if (
      !emailRegex.test(cleanEmail) ||
      cleanEmail.includes('<') ||
      cleanEmail.includes('>') ||
      cleanEmail.toLowerCase().includes('script') ||
      cleanEmail.includes('{') ||
      cleanEmail.includes('}')
    ) {
      setError('Correo inválido o sospechoso.')
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('authorized_emails')
      .select('*')
      .eq('email', cleanEmail)
      .eq('is_registered', false)

    setLoading(false)

    if (error) {
      setError('Error al consultar Supabase')
      return
    }

    if (data.length === 0) {
      setError('Este correo no está autorizado o ya fue registrado.')
    } else {
      setEmail(cleanEmail)
      setIsAuthorized(true)
    }
  }

  const generateCode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const letter = letters[Math.floor(Math.random() * letters.length)]

    let digits = []
    while (digits.length < 3) {
      const digit = Math.floor(Math.random() * 10)
      if (
        digits.length === 0 ||
        (digit !== digits[digits.length - 1] &&
          Math.abs(digit - digits[digits.length - 1]) !== 1)
      ) {
        digits.push(digit)
      }
    }

    return letter + digits.join('')
  }

  const isCodeUnique = async (code) => {
    const { data, error } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('access_code', code)
      .limit(1)

    if (error) {
      console.error('Error al verificar código único:', error)
      return false
    }

    return data.length === 0
  }

  const generateUniqueCode = async () => {
    let code = ''
    let unique = false
    while (!unique) {
      code = generateCode()
      unique = await isCodeUnique(code)
    }
    return code
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!isValidFullName(fullName)) {
      setError('Nombre inválido. Usa solo letras y al menos 4 caracteres.')
      setLoading(false)
      return
    }

    if (!isValidTikTokHandle(tiktokUser)) {
      setError('Usuario de TikTok inválido. Usa solo letras, números, guiones bajos y puntos.')
      setLoading(false)
      return
    }

    const code = await generateUniqueCode()

    const { error: insertError } = await supabase
      .from('event_registrations')
      .insert({
        email,
        full_name: fullName,
        tiktok_handle: tiktokUser,
        access_code: code,
      })

    if (insertError) {
      setLoading(false)
      setError('Error al guardar el registro')
      return
    }

    const { error: rpcError } = await supabase
      .rpc('mark_as_registered', { user_email: email })

    if (rpcError) {
      setLoading(false)
      setError('Error al marcar el correo como registrado.')
      return
    }

    setLoading(false)
    setAccessCode(code)
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      {loading && <FullScreenLoader />}

      {accessCode ? (
        <div className="text-center">
          <h1 style={{ fontSize: '3rem' }}>{accessCode}</h1>
          <p style={{ fontSize: '1.1rem', marginTop: '1rem' }}>
            Tu registro ha sido exitoso. Este código es <strong>único e intransferible</strong>.  
            Guárdalo para tu acceso al evento.
          </p>
        </div>
      ) : !isAuthorized ? (
        <form onSubmit={handleVerify}>
          <h1>Registro de Invitados</h1>
          <label>Correo electrónico:</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              const input = e.target.value.trim()
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

              if (
                emailRegex.test(input) &&
                !input.includes('<') &&
                !input.includes('>') &&
                !input.toLowerCase().includes('script') &&
                !input.includes('{') &&
                !input.includes('}')
              ) {
                setEmail(input)
                setError('')
              } else {
                setEmail(input)
                setError('Correo inválido o sospechoso.')
              }
            }}
            required
          /><br /><br />
          <button type="submit">Verificar correo</button><br /><br />
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <h1>Completa tu registro</h1>

          <label>Correo electrónico:</label><br />
          <input type="email" value={email} disabled /><br /><br />

          <label>Nombre completo:</label><br />
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          /><br /><br />

          <label>Usuario de TikTok:</label><br />
          <input
            type="text"
            value={tiktokUser}
            onChange={(e) => {
              const input = e.target.value
              if (!input.startsWith('@')) return
              setTiktokUser(input)
            }}
            required
          /><br /><br />

          <button type="submit">Guardar registro</button><br /><br />
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      )}
    </div>
  )
}

export default App

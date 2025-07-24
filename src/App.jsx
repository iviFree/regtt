import { useState } from 'react'
import { supabase } from './supabase'
import emailjs from '@emailjs/browser'
import FullScreenLoader from './components/FullScreenLoader.jsx'
import logoLive from './assets/img/tikTokCopaLive-LogoHeader.png'
import tiktokCopaLiveLogo from './assets/img/tikTokCopaLive-Logo.png'

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

  const sendConfirmationEmail = async (name, email, code) => {
    try {
      await emailjs.send(
        'service_0nw3dxn',
        'template_jqh2hgq',
        {
          name,
          email,
          code,
        },
        '6Sc8dj2rDZFi389qd'
      )
      console.log('Correo enviado')
    } catch (error) {
      console.error('Error enviando correo:', error)
    }
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

    await sendConfirmationEmail(fullName, email, code)

    setLoading(false)
    setAccessCode(code)
  }

  return (
    <div className="container-fluid" style={{ fontFamily: 'Arial' }}>
      {loading && <FullScreenLoader />}

      <div className="row justify-content-center p-4">
        {/* Primera columna: Logo TikTok Live */}
        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 pe-md-0 pe-lg-5 pe-xl-5 pe-xxl-5 imagecontainer logoLive d-flex flex-row justify-content-center justify-content-sm-center justify-content-md-center justify-content-lg-end">
          <img src={logoLive} alt="TikTok Live" />
        </div>

        {/* Segunda columna: Imagen TikTok Copa Live */}
        <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6 imagecontainer logoSoonContainer mb-5">
          <img src={tiktokCopaLiveLogo} alt="Logo TikTok Copa Live" />
        </div>

        {/* Tercera columna: Formulario de registro */}
        <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6">
          {accessCode ? (
            <div className="text-center">
              <h1 className='codeReg'><span>Tu codigo de registro es:</span><br/><span className='accessCode'>{accessCode}</span></h1>
              <p className="codeLegend">
                Tu registro ha sido exitoso y se ha enviado a tu correo electrónico registrado.<br />Este código es único e intransferible.<br />
                Guárdalo para tu acceso al evento.
              </p>
            </div>
          ) : !isAuthorized ? (
            <form onSubmit={handleVerify} className='d-flex flex-column justify-content-center'>
              <h1>REGÍSTRATE AHORA</h1>
              <label>E-MAIL:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-control"
                />
                {error && <p className="text-danger">{error}</p>}
              <button type="submit" className="btn btn-primary">Verificar correo</button><br /><br />
              
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <h1>Completa tu registro</h1>

              <label>Correo electrónico:</label><br />
              <input type="email" value={email} disabled className="form-control" /><br />

              <label>Nombre completo:</label><br />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="form-control"
              /><br />

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
                className="form-control"
              /><br />

              <button type="submit" className="btn btn-success">Guardar registro</button><br /><br />
              {error && <p className="text-danger">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default App

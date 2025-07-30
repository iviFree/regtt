// src/components/CheckAccess.jsx
import { useState } from 'react';
import { supabase } from '../supabase';
import logoLive from '../assets/img/tikTokCopaLive-LogoHeader.png'
import tiktokCopaLiveLogo from '../assets/img/tikTokCopaLive-Logo.png'


function CheckAccess() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckCode = async () => {
    setIsChecking(true);
    setStatus(null);

    const { data, error } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('access_code', code)
      .eq('code_used', false)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('🚫 Error consultando código:', error);
      setStatus('error');
      setIsChecking(false);
      return;
    }

    if (!data) {
      setStatus('invalid');
      setIsChecking(false);
      return;
    }

    const { error: updateError } = await supabase
      .from('event_registrations')
      .update({ code_used: true })
      .eq('id', data.id);

    if (updateError) {
      console.error('❌ Error actualizando código:', updateError);
      setStatus('update_error');
    } else {
      setStatus('valid');
    }

    setIsChecking(false);
  };

  const resetCheck = () => {
    setCode('');
    setStatus(null);
  };

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div id="google_translate_element" style={{ display: 'none' }}></div>
        <div className="text-end mt-2 mb-2 notranslate">
          <button onClick={() => changeLanguage('es')} className="btn btn-light me-2 notranslate">ES</button>
          <button onClick={() => changeLanguage('en')} className="btn btn-light me-2 notranslate">EN</button>
          <button onClick={() => changeLanguage('pt')} className="btn btn-light notranslate">BR</button>
        </div>
      </div>
      {/* Logo TikTok LIVE */}
      <div className="row justify-content-center p-4">
        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 pe-md-0 pe-lg-5 pe-xl-5 pe-xxl-5 imagecontainer logoLive d-flex flex-row justify-content-center justify-content-sm-center justify-content-md-center justify-content-lg-end">
          <img src={logoLive} alt="TikTok Live" />
        </div>
        <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6 imagecontainer logoSoonContainer mb-5">
          <img src={tiktokCopaLiveLogo} alt="Logo TikTok Copa Live" />
        </div>
        <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6 d-flex  flex-column justify-content-center">
          <label>Ingresa tu código de acceso:</label>
          {status === null && (
              <>
              <input
                className='form-control'
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                />
                <button
                  onClick={handleCheckCode}
                  disabled={isChecking}
                >
                  {isChecking ? 'Verificando...' : 'Verificar código'}
                </button>
              </>
            )}

            {status === 'valid' && (
              <>
                <p className="text-success text-center mt-3">
                  Código válido.<br/>Acceso permitido.
                </p>
                <button onClick={resetCheck}>
                  Volver
                </button>
              </>
            )}

            {status === 'invalid' && (
              <>
                <p className="text-danger text-center mt-3">
                  El código no existe o ya fue utilizado.
                </p>
                <button onClick={resetCheck}>
                  Intentar de nuevo
                </button>
              </>
            )}

            {status === 'update_error' && (
              <>
                <p className="text-warning text-center mt-3">
                  Error al actualizar el estado del código.
                </p>
                <button onClick={resetCheck}>
                  Volver
                </button>
              </>
            )}

            {status === 'error' && (
              <>
                <p className="text-warning text-center mt-3">
                  Error al consultar el código. Intenta más tarde.
                </p>
                <button className="btn btn-secondary w-100 mt-2" onClick={resetCheck}>
                  Volver
                </button>
              </>
            )}
        </div>
      </div>
    </div>
  );
}

export default CheckAccess;

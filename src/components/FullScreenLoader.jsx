import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(fas)

const loaderStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: '#1e1e1e',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
  color: 'white',
  fontSize: '3rem',
  fontFamily: 'Arial',
}

export default function FullScreenLoader() {
  return (
    <div style={loaderStyle}>
      <FontAwesomeIcon icon={['fas', 'spinner']} spin />
    </div>
  )
}

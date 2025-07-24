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
  backgroundColor: 'rgba(255, 17, 85, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
  color: '#00f7ef',
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

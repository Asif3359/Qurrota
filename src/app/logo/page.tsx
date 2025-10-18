import React from 'react'
import QurrotaLogo from '../../lib/QurrotaLogo';
import Fabicon from '../../lib/Fabicon';

const LogoPage: React.FC = () => {
  return (
  <>
    <QurrotaLogo width={500} height={200} className="logo" title="Qurrota logo"/>  
    <Fabicon width={500} height={200} className="logo" title="Qurrota logo"/>

</>
  )
};

export default LogoPage;  
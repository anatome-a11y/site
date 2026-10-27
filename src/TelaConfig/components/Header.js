import React from 'react'

const Header = ({style,title,children}) => {
   return (
       <div style={{display:'flex',flexDirection:'column',...style}}>

           <div className="config-section-title">
               {title}
           </div>

           <div className="config-section-body">
               {children}
           </div>

       </div>
   )
}

export default Header

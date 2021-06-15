import React from 'react'

const Header = ({style,title,children}) => {
   return (
       <div style={{display:'flex',flexDirection:'column',...style}}>

           <div style={{
              border:'1px solid #d2d2d2',
              backgroundColor:'#fafafa',
              fontSize:'2rem',
              display:'flex',
              justifyContent:'center',
              padding:12,
           }}>  
               {title}
           </div>

           <div style={{flex:1,border:'1px solid #d2d2d2'}}>
               {children}
           </div>

       </div>
   )
}

export default Header

import React from 'react';

type LayoutProps = {
    children:React.ReactNode
};

const Layout:React.FC<LayoutProps> = ({children}) => {
    
    return (<>
    {/* <NavBar/> */}
    <main>{children}</main>
    </>)
}
export default Layout;
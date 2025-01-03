'use client';
   import React from 'react';

   const ProtectedLayout = ({ children }) => {
     return (
       <div className="protected-layout">
         <header>
           <h1>Заголовок</h1>
         </header>
         <div className="content">
           <aside>
             <nav>
               <ul>
                 <li><a href="/protected/page1">Страница 1</a></li>
                 <li><a href="/protected/page2">Страница 2</a></li>
                 <li><a href="/protected/page3">Страница 3</a></li>
               </ul>
             </nav>
           </aside>
           <main>
             {children}
           </main>
         </div>
         <footer>
           <p>Подвал</p>
         </footer>
         <style jsx>{`
           .protected-layout {
             display: flex;
             flex-direction: column;
             min-height: 100vh;
           }
           header, footer {
             background: #333;
             color: #fff;
             padding: 1rem;
             text-align: center;
           }
           .content {
             display: flex;
             flex: 1;
           }
           aside {
             width: 200px;
             background: #f4f4f4;
             padding: 1rem;
           }
           main {
             flex: 1;
             padding: 1rem;
           }
         `}</style>
       </div>
     );
   };

   export default ProtectedLayout;
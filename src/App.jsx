import './App.css';
import WrapperPromo from "./components/WrapperPromo.jsx";
import Header from "./components/Header.jsx";
import Promo from "./components/Promo.jsx";
import Featured from "./components/Featured.jsx";

function App() {
  return (
    <>
        <WrapperPromo />
        <Header />
        <Promo />


        <main className='main'>
            <Featured />
        </main>

    </>
  )
}

export default App

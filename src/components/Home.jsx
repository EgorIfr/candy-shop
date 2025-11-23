import WrapperPromo from './WrapperPromo.jsx';
import Header from './Header.jsx';
import Promo from './Promo.jsx';
import Featured from './Featured.jsx';

export default function Home() {
  return (
    <>
      <WrapperPromo />
      <Header />
      <Promo />

      <main className="main">
        <Featured />
      </main>
    </>
  );
}

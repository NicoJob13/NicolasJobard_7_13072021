import logo from '';
import '.styles/styles.scss';

function App() {
  return (
    <div>
      <header>
        <img src={logo} alt="logo de l'entreprise" />
        <p>
          Bienvenue chez Groupomania !
        </p>
      </header>
    </div>
  );
}

export default App;